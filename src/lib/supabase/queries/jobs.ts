"use server";
import { createClient } from '@/lib/supabase';


export const fetchJobsData = async () => {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase
            .from('job_postings')
            .select('*')
            .limit(30)

        if (error) {
            console.log(error);
            return { data, error: { message: error.message } };
        } else {
            console.log(data)
            return { data: data, error: null };
        }
    } catch (error) {
        console.log(error)
        return { data: null, error: { message: "Whoops something went wrong while fetching jobs." } }
    }
}