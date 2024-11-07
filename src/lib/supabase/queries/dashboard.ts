'use server'

import { createClient } from '@/lib/supabase'

export async function fetchAllTablesData(userId: string) {
  try {
    const supabase = await createClient()

    const { data: ecommerceProducts, error: ecommerceError } = await supabase
      .from('ecommerce_products')
      .select('*')
      .eq('user_id', userId)

    if (ecommerceError) return {error: {message: ecommerceProducts.error.message}};

    const { data: realEstateListings, error: realEstateError } = await supabase
      .from('real_estate_listings')
      .select('*')
      .eq('user_id', userId)

    if (realEstateError) return {error: {message: realEstateError.error.message}};

    const { data: jobPostings, error: jobError } = await supabase
      .from('job_postings')
      .select('*')
      .eq('user_id', userId)

    if (jobError) return {error: {message: jobError.error.message}};;

    // Combine all results into one object
    const allData = [...ecommerceProducts, ...realEstateListings, ...jobPostings]
    console.log(allData)
    return {data: allData, error: null};
  } catch (err) {
    console.log('Error fetching data:', err);
    return {error: {message: "Error fetching your data from database. Please refresh."}}
  }
}
export async function fetchListingByTableAndId(listingId, table) {
  try{
    const supabase = await createClient()
    const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('id', listingId)
          .single()
    if (error) {
      console.log(error)
      return {error : {message: error.message}}
    } else {
      return {data: data}
    }
  } catch (err) {
    console.log('Error fetching data:', err);
    return {error: {message: "Error fetching your data from database. Please refresh."}}
  }
}
// export const fetchReviewsByUserId = (userId) => {
//   const { data, error } = await supabase
//       .from('reviews')
//       .select('*')
//       .eq('user_id', userId)

//     if (ecommerceError) return {error: {message: ecommerceProducts.error.message}};
// }