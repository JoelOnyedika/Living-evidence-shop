"use server";
import { createClient } from '@/lib/supabase';
import { v4 } from 'uuid';

export const getProductsDataById = async (id: any, type: any) => {
    console.log(id, type)
    try {
        const supabase = await createClient();
        var table = null
        if (type === 'ecommerce') {
            table = 'ecommerce_products'
        } else if (type === 'job') {
            table = 'job_postings'
        } else if (type === 'realestate') {
            table = 'real_estate_listings'
        }
     
        // Removed the extra closing parenthesis at the end of this line
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id);

        if (error) {
            console.log(error);
            return { data, error: { message: error.message } };
        } else {
            console.log(data)
            return { data: data, error: null };
        }
    } catch (error) {
        console.log(error);
        return { data: null, error: { message: "Whoops something went wrong. Please refresh" } };
    }
};
