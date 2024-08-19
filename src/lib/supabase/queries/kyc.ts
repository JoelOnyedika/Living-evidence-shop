"use server"
import {createClient} from '@/lib/supabase'
import {v4} from 'uuid'



export const hasUserCompletedKyc = async (id: number) => {
	try {
		const supabase = await createClient()
		const { data, error } = await supabase.from('detailed_profiles').select('*').eq('basic_profile_id', id)
		if (error) {
			console.log(error)
			return { data: null, error: {message: error.message} }
		}
		console.log(data)
		return { data: data, error: null }	
	} catch (error) {
		console.log(error)
		return { data: null, error: { message: "Something went wrong" } }
	}
	
}

export const createUserKyc = async (formData: any, basicProfileId: number) => {
	try {
		const supabase = await createClient()
		const myUUID = v4()
		const { firstName, lastName, email, phoneNumber, dob, income, assets, liablilties, preferredContact, nationality, address, profilePhoto, governmentID, occupation } = formData
		const { data, error } = await supabase.from('detailed_profiles').insert(
			{ 
				id: myUUID, 
				basic_profile_id: basicProfileId,
				first_name: firstName,
				last_name: lastName,
				email,
				phone_number: phoneNumber,
				profile_photo: profilePhoto,
				address,
				nationality,
				preferred_contact: preferredContact,
				government_id: governmentID,
				occupation,
				income,
				assets,
				liablilties,
				date_of_birth: dob
			})
		if (error) {
			console.log(error)
			return { data: null, error: { message: "Something went wrong" } }
		}
		console.log(data)
		return { data, error: null }
	} catch(error) {
		console.log(error)
		return { data: null, error: { message: "Something went wrong" } }
	}
}

export const updateUserKycStatus = async (userId) => {
	try {
		const supabase = await createClient()
		const { data, error } = await supabase.from('basic_profiles').update({ kyc_status: 'pending' }).eq('id', userId)
		if (error) {
			console.log(error)
			return { data: null, error: { message: "Something went wrong" } }		
		}
		console.log(data)
		return { data, error: null }	
	} catch(error) {
		console.log(error)
		return { data: null, error: { message: "Something went wrong" } }	
	}
}
	

export const checkKycStatus = async(userId: number ) => {
	try {
		const supabase = await createClient()
		const { data, error } = await supabase.from('basic_profiles').select("*").eq('id', userId)
		if (error) {
			console.log(error)
			return { data: null, error: { message: "Something went wrong" } }		
		}
		console.log(data)
		if (data[0].kyc_status === 'yes') {
			return { data: true, error: null }
		}
		return { data: false, error: null }

		return { data, error: null }	
	} 
	catch(error) {
		console.log(error)
		return { data: null, error: { message: "Something went wrong" } }	
	}

}