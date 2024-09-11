// app/actions/ecommerceActions.ts
'use server'

import { uploadEcommerceForm } from "@/lib/supabase/queries/uploadForms"

export async function serverUploadAction(formData: FormData) {
  const userId = formData.get('userId') as string;
 //  const result = await uploadEcommerceForm(formData, userId);
 console.log(formData)
  //return result;
}