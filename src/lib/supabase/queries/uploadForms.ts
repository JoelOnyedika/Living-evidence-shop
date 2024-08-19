import { createClient } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export const uploadEcommerceForm = async (formData: any, userId: any) => {
    try {
        const supabase = await createClient()
        const myId = uuidv4()
        const { price, title, description, category, image } = formData
        const { data, error }:any = supabase
        .from('ecommerce_products')
        .insert({ id: myId, user_id: userId, price, title, description, category, image });
        if (error) {
            console.log(error)
            return {data: null, error: { message: error.message }}
        }
        console.log(data)
        return {data: data, error: null}
    } catch (error) {
        console.log(error)
        return {data: null, error: { message: "Whoops something went wrong. Please refresh..." }}
    }
}
export const uploadRealEstateForm = async (formData: any, userId: any) => {
    try {
        const supabase = await createClient()
        const myId = uuidv4()
        const { description, price, location, title, propertyType, image } = formData
        const { data, error }:any = supabase
        .from('real_estate_listings')
        .insert({ id: myId, user_id: userId, price, title, description, location, image, property_type: propertyType });
        if (error) {
            console.log(error)
            return {data: null, error: { message: error.message }}
        }
        console.log(data)
        return {data: data, error: null}
    } catch (error) {
        console.log(error)
        return {data: null, error: { message: "Whoops something went wrong. Please refresh..." }}
    }
}
export const uploadJobForm = async (formData: any, userId: any) => {
    try {
        const supabase = await createClient()
        const myId = uuidv4()
        const { description, salary, location, title, jobType, image } = formData
        const { data, error }:any = supabase
        .from('job_postings')
        .insert({ id: myId, user_id: userId, salary, title, description, location, image, job_type: jobType });
        if (error) {
            console.log(error)
            return {data: null, error: { message: error.message }}
        }
        console.log(data)
        return {data: data, error: null}
    } catch (error) {
        console.log(error)
        return {data: null, error: { message: "Whoops something went wrong. Please refresh..." }}
    }
}