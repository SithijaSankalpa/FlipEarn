import React from 'react'
import Title from './Title'
import { useSelector } from 'react-redux'
import ListingCard from './ListingCard'

const LatestListings = () => {

  const { listings } = useSelector(state => state.listing)

  // Safety check: ensure listings is an array before using .slice()
  const latestListings = Array.isArray(listings) ? listings.slice(0, 4) : []

  return (
    <div className='mt-20 mb-8'>
      <Title title="Latest Listings" description="Discover the hottest social profiles available right now." />
      <div className='flex flex-col gap-6 px-6'>
        {latestListings.length > 0 ? (
          latestListings.map((listing, index) => (
            <div key={listing.id || index} className='mx-auto w-full max-w-3xl rounded-xl'>
              <ListingCard listing={listing} />
            </div>
          ))
        ) : (
          <div className='text-center text-gray-500 py-10'>
            <p>No listings available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LatestListings