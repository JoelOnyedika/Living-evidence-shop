"use server"
import { createClient } from '@/lib/supabase'


export const updateUsername = async ({
  username,
  email,
}) => {
  try {
    const supabase = await createClient()

    // Query the profile table for the given email
    const { data, error } = await supabase
      .from('basic_profiles')
      .select('*')
      .eq('email', email);

    // Handle any errors from the query
    if (error) {
      console.error('Error fetching profile:', error);
      return { data: null, error: { message: 'Could not fetch profile' } }
    }

    console.log(data)

    // Check if the profile was found
    if (data.length === 0) {
      console.log('No profile found for the given email:', email);
      return { data: null, error: { message: 'No profile found for the given email' } }
    }

    // Update the username in the profile table
    const { id } = data[0]; // Assuming the profile table has an 'id' column
    console.log(id, username)

    const { data: updateData, error: updateError } = await supabase
      .from('basic_profiles')
      .update({ username })
      .eq('id', id);

    // Handle any errors from the update
    if (updateError) {
      console.log('Error updating username:', updateError);
      return { data: null, error: { message: 'Could not update username' } }
    }

    console.log('Username successfully updated', typeof(updateData), updateData);
    
    return { data: data, error: null };
  } catch (error) {
    console.log('An unexpected error occurred:', error);
    return { data: null, error: { message: "An unexpected error occurred" } }
  }
}

export const getUserDataById = async (id: string) => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('basic_profiles').select('*').eq('id', id)
    if (error) {
      console.log(error)
      return { data, error }
    }
    console.log(data)
    rerturn { data, error }
    
  } catch (err) {
    console.log(err)
    return { data: null, error: { message: "Whoops something went wrong, please refresh." }} }
  }
}