import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from '../../configs/axios';

// Get all public listings
export const getAllpublicListing = createAsyncThunk("listing/getAllPublicListing", async (_, {rejectWithValue}) => {
  try {
    const {data} = await api.get('/api/listing/public')
    return data;
  } catch (error) {
    console.error('Error fetching public listings:', error);
    return rejectWithValue({
      listings: [],
      message: error.message
    });
  }
})

// Get all user listings
export const getAllUserListings = createAsyncThunk("listing/getAllUserListing", async ({getToken}, {rejectWithValue})=> {
  try {
    const token = await getToken();
    const {data} = await api.get('/api/listing/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return data
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return rejectWithValue({
      listings: [],
      balance: {
        earned: 0,
        withdrawn: 0,
        available: 0
      },
      message: error.message
    });
  }
})

const listingSlice = createSlice({
  name: "listing",
  initialState: {
    listings: [],
    userListings: [],
    balance: {
      earned: 0,
      withdrawn: 0,
      available: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    setListings: (state, action) => {
      state.listings = Array.isArray(action.payload) ? action.payload : [];
    }
  },
  extraReducers: (builder) => {
    // Get all public listings
    builder.addCase(getAllpublicListing.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllpublicListing.fulfilled, (state, action) => {
      state.loading = false;
      state.listings = action.payload?.listings || [];
    });
    builder.addCase(getAllpublicListing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to fetch listings';
      state.listings = [];
    });

    // Get all user listings
    builder.addCase(getAllUserListings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllUserListings.fulfilled, (state, action) => {
      state.loading = false;
      state.userListings = action.payload?.listings || [];
      state.balance = action.payload?.balance || {
        earned: 0,
        withdrawn: 0,
        available: 0
      };
    });
    builder.addCase(getAllUserListings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to fetch user listings';
      state.userListings = [];
    });
  }
})

export const {setListings} = listingSlice.actions;

export default listingSlice.reducer