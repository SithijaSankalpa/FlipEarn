import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";
import sendEmail from "../configs/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "profile-marketplace" });

// Inngest function to save user data to the database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const {data} = event

      // Check if user already exists in the database
      const user = await prisma.user.findFirst({
        where: {id: data.id}
      })
      
      if(user){
        // Update user data if it exists
        await prisma.user.update({
          where: {id: data.id},
          data: {
            email: data?.email_addresses[0]?.email_address,
            name: data?.first_name + " " + data?.last_name,
            image: data?.image_url,
          }
        })
        return;
      }
      
      await prisma.user.create({
        data: {
          id: data.id,
          email: data?.email_addresses[0]?.email_address,
          name: data?.first_name + " " + data?.last_name,
          image: data?.image_url,
        }
      })
    } catch (error) {
      console.error('Error syncing user creation:', error);
      throw error;
    }
  },
);

// Inngest function to delete user from the database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      const {data} = event

      const listings = await prisma.listing.findMany({
        where: {ownerId: data.id}
      })
      const chats = await prisma.chat.findMany({
        where: {OR: [{ownerId: data.id}, {chatUserId: data.id}]}
      })
      const transactions = await prisma.transaction.findMany({
        where: {userId: data.id}
      })

      if(listings.length === 0 && chats.length === 0 && transactions.length === 0){
        await prisma.user.delete({where: {id: data.id}})
      } else {
        await prisma.listing.updateMany({
          where: {ownerId: data.id},
          data: {status: "inactive"}
        })
      }
    } catch (error) {
      console.error('Error syncing user deletion:', error);
      throw error;
    }
  }, 
);

// Inngest function to update user data in the database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      const {data} = event

      await prisma.user.update({
        where: {id: data.id},
        data: {
          email: data?.email_addresses[0]?.email_address,
          name: data?.first_name + " " + data?.last_name,
          image: data?.image_url,
        }
      })
    } catch (error) {
      console.error('Error syncing user update:', error);
      throw error;
    }
  },
);

// Inngest function to send purchase email to the customer
const sendPurchaseEmail = inngest.createFunction(
  {id: 'send-purchase-email'},
  {event: "app/purchase"},
  async ({event}) => {
    try {
      const {transaction} = event.data;

      const customer = await prisma.user.findFirst({
        where: {id: transaction.userId}
      })
      const listing = await prisma.listing.findFirst({
        where: {id: transaction.listingId}
      })
      const credential = await prisma.credential.findFirst({
        where: {listingId: transaction.listingId}
      })
      
      await sendEmail({
        to: customer.email,
        subject: "Your credentials for the account you purchased",
        html: `
          <h2>Thank you for purchasing account @${listing.username} of ${listing.platform}</h2>
          <p>Here are your credentials for the listing you purchased.</p>
          <h3>New Credentials</h3>
          <div>
          ${credential?.updatedCredential?.map((cred)=> `<p>${cred.name}: ${cred.value}</p>`).join("") || '<p>No credentials available</p>'}
          </div>
          <p>If you have any questions, please contact us at <a href="mailto:support@example.com">support@example.com</a></p>
        `
      })
    } catch (error) {
      console.error('Error sending purchase email:', error);
      throw error;
    }
  }
)

// Inngest to send new credential for deleted listings
const sendNewCredentials = inngest.createFunction(
  {id: 'send-new-credentials'},
  {event: "app/listing-deleted"},
  async ({event}) => {
    try {
      const {listing, listingId} = event.data;
      const newCredential = await prisma.credential.findFirst({
        where: {listingId},
      })
      
      if(newCredential){
        await sendEmail({
          to: listing.owner.email,
          subject: "New credentials for your deleted listing",
          html:`
            <h2>Your new credentials for your deleted listing:</h2>
            <p><strong>Title:</strong> ${listing.title}</p>
            <p><strong>Username:</strong> ${listing.username}</p>
            <p><strong>Platform:</strong> ${listing.platform}</p>
            <h3>New Credentials</h3>
            <div>
              ${newCredential?.updatedCredential?.map((cred)=> `<p>${cred.name}: ${cred.value}</p>`).join("") || '<p>No credentials available</p>'}
            </div>
            <h3>Old Credentials</h3>
            <div>
              ${newCredential?.originalCredential?.map((cred)=> `<p>${cred.name}: ${cred.value}</p>`).join("") || '<p>No credentials available</p>'}
            </div>
            <p>If you have any questions, please contact us at <a href="mailto:support@example.com">support@example.com</a></p>
          `    
        })
      }
    } catch (error) {
      console.error('Error sending new credentials:', error);
      throw error;
    }
  }
)

// Create an array where we export all Inngest functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  sendPurchaseEmail,
  sendNewCredentials
];