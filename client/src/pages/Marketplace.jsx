import { ArrowLeftIcon, FilterIcon, Search } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ListingCard from '../components/ListingCard'
import FilterSidebar from '../components/FilterSidebar'

const Marketplace = () => {

  const [searchParams] = useSearchParams()
  const search = searchParams.get("search")

  const navigate = useNavigate()
  const [showFilterPhone, setShowFilterPhone] = useState(false)
  const { listings } = useSelector(state => state.listing)
  const [filters, setFilters] = useState({
    platform: null,
    maxPrice: 100000,
    minFollowers: 0,
    niche: null,
    verified: false,
    monetized: false,
  })

  // Safety check: ensure listings is an array before filtering
  const safeListings = Array.isArray(listings) ? listings : []

  const filteredListings = safeListings.filter((listing) => {

    if (filters.platform && filters.platform.length > 0) {
      if (!filters.platform.includes(listing.platform)) return false
    }
    if (filters.maxPrice) {
      if (listing.price > filters.maxPrice) return false
    }
    if (filters.minFollowers) {
      if (listing.followers_count < filters.minFollowers) return false
    }
    if (filters.niche && filters.niche.length > 0) {
      if (!filters.niche.includes(listing.niche)) return false
    }
    if (filters.verified && listing.verified !== filters.verified) return false
    if (filters.monetized && listing.monetized !== filters.monetized) return false

    if (search) {
      const trimmed = search.trim()
      if (
        !listing.title?.toLowerCase().includes(trimmed.toLowerCase()) &&
        !listing.username?.toLowerCase().includes(trimmed.toLowerCase()) &&
        !listing.description?.toLowerCase().includes(trimmed.toLowerCase()) &&
        !listing.platform?.toLowerCase().includes(trimmed.toLowerCase()) &&
        !listing.niche?.toLowerCase().includes(trimmed.toLowerCase())
      )
        return false
    }

    return true
  })

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32'>
      <div className='flex items-center justify-between text-slate-500'>
        <button onClick={() => { navigate('/'); scrollTo(0, 0) }} className='flex items-center gap-2 py-5'>
          <ArrowLeftIcon className="size-4" />
          Back to Home
        </button>
        <button onClick={() => setShowFilterPhone(true)} className='flex sm:hidden items-center gap-2 py-5'>
          <FilterIcon className="size-4" />
          Filters
        </button>
      </div>
      <div className='relative flex items-start justify-between gap-8 pb-8'>
        <FilterSidebar setFilters={setFilters} filters={filters} setShowFilterPhone={setShowFilterPhone} showFilterPhone={showFilterPhone} />
        <div className='flex-1 grid xl:grid-cols-2 gap-4'>
          {filteredListings.length > 0 ? (
            filteredListings.sort((a, b) => a.featured ? -1 : b.featured ? 1 : 0).map((listing, index) => (
              <ListingCard listing={listing} key={listing.id || index} />
            ))
          ) : (
            <div className='col-span-2 text-center py-20'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Search className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-xl font-medium text-gray-800 mb-2'>No listings found</h3>
              <p className='text-gray-600'>Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Marketplace