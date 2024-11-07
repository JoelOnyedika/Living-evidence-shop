// app/lib/server-functions.js
'use server'

import {createClient} from '@/lib/supabase'
import {v4} from 'uuid'

export async function getInitialListings() {
  const supabase = await createClient()
  
  const fetchListings = async (table, type) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false })
      .limit(7)  // Fetching 7 of each type to ensure we have at least 20 total

    if (error) {
      console.error(`Error fetching ${type} data:`, error)
    }

    return data
  }

  const [ecommerceData, realEstateData, jobData] = await Promise.all([
    fetchListings('ecommerce_products', 'ecommerce'),
    fetchListings('real_estate_listings', 'realEstate'),
    fetchListings('job_postings', 'jobPosting')
  ])

  return {
    data: [...ecommerceData, ...realEstateData, ...jobData],
    error: null
  }
}

export async function searchListings(searchTerm, listingType) {
    const supabase = await createClient()

  
  const searchTable = async (table, type) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('type', type)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error(`Error searching ${type} data:`, error)
    }

    return data || []
  }

  let results = []

  if (listingType === 'all' || !listingType) {
    const [ecommerceData, realEstateData, jobData] = await Promise.all([
      searchTable('ecommerce_products', 'ecommerce'),
      searchTable('real_estate_listings', 'realEstate'),
      searchTable('job_postings', 'jobPosting')
    ])
    results = [...ecommerceData, ...realEstateData, ...jobData]
  } else if (listingType === 'ecommerce') {
    results = await searchTable('ecommerce_products', 'ecommerce')
  } else if (listingType === 'realEstate') {
    results = await searchTable('real_estate_listings', 'realEstate')
  } else if (listingType === 'jobPosting') {
    results = await searchTable('job_postings', 'jobPosting')
  }

  return {
    data: results,
    error: null
  }
}