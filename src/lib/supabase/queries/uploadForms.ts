import { createClient } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload images to a specific bucket and folder path in Supabase storage.
 *
 * @param {string} bucketName - The name of the Supabase storage bucket.
 * @param {string} pathPrefix - Custom folder path where the images will be uploaded (e.g., 'ecommerce', 'real-estate').
 * @param {string} userId - Unique user ID (used for generating file paths).
 * @param {string} productID - Unique product ID (used for generating file paths).
 * @param {File[]} images - List of image files to be uploaded.
 * @returns {Promise<string[]>} - A list of public URLs of the uploaded images.
 */
export const uploadImages = async (
  bucketName: string,
  pathPrefix: string,
  userId: string,
  productId: string,
  images: any
): any => {
    console.log("images",images)
  const uploadPromises = images.map(async (image, index) => {
    console.log(image)
    const fileExt = image.name.split(".").pop();
    const fileName = `${pathPrefix}/${userId}/${productId}/${Date.now()}_${index}.${fileExt}`;
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, image);

    if (error) {
      console.error(`Error uploading image ${image.name}:`, error);
      return { data: null, error };
    }

    console.log(data);

    // Get the public URL of the uploaded image
    const { publicUrl } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName).data;
    console.log(publicUrl);
    return publicUrl;
  });

  const results = await Promise.all(uploadPromises);
  console.log(results);
  return results.filter((url): url is string => url !== null);
};


// HAD TO REMOVE ALL OF THESE CODES BECALUSE THE LOGIC IS BEING HANDLED
// IN THE API/ROUTES.... FOLDERS


// export const uploadEcommerceForm = async (formData: FormData, userId: string) => {
//   try {
//       const supabase = await createClient()
//       const productId = uuidv4()
//       const price = parseFloat(formData.get('price') as string);
//       const title = formData.get('title') as string;
//       const description = formData.get('description') as string;
//       const category = formData.get('category') as string;
//       const imageFile = formData.get('image') as File | null;

//       let imageUrl = '';

//       if (imageFile) {
//           const fileExt = imageFile.name.split('.').pop();
//           const fileName = `${productId}.${fileExt}`;
//           const filePath = `ecommerce/${userId}/${fileName}`;

//           const { data: uploadData, error: uploadError } = await supabase.storage
//               .from('projectImages')
//               .upload(filePath, imageFile);

//           if (uploadError) {
//               console.log(uploadError);
//               return { data: null, error: { message: "Failed to upload image" } };
//           }

//           const { data: { publicUrl } } = supabase.storage
//               .from('projectImages')
//               .getPublicUrl(filePath);

//           imageUrl = publicUrl;
//       }

//       const { data, error } = await supabase
//           .from('ecommerce_products')
//           .insert({ id: productId, user_id: userId, price, title, description, category, image: imageUrl });

//       if (error) {
//           console.log(error)
//           return { data: null, error: { message: error.message } }
//       }

//       return { data: data, error: null }
//   } catch (error) {
//       console.log(error)
//       return { data: null, error: { message: "Whoops something went wrong. Please refresh..." } }
//   }
// }


// export const uploadRealEstateForm = async (formData: any, userId: any) => {
//   try {
//     const supabase = await createClient();
//     const myId = uuidv4();
//     const { description, price, location, title, propertyType, image } =
//       formData;
//     const { data, error }: any = supabase
//       .from("real_estate_listings")
//       .insert({
//         id: myId,
//         user_id: userId,
//         price,
//         title,
//         description,
//         location,
//         image,
//         property_type: propertyType,
//       });
//     if (error) {
//       console.log(error);
//       return { data: null, error: { message: error.message } };
//     }
//     console.log(data);
//     return { data: data, error: null };
//   } catch (error) {
//     console.log(error);
//     return {
//       data: null,
//       error: { message: "Whoops something went wrong. Please refresh..." },
//     };
//   }
// };
// export const uploadJobForm = async (formData: any, userId: any) => {
//   try {
//     const supabase = await createClient();
//     const myId = uuidv4();
//     const { description, salary, location, title, jobType, image } = formData;
//     const { data, error }: any = supabase
//       .from("job_postings")
//       .insert({
//         id: myId,
//         user_id: userId,
//         salary,
//         title,
//         description,
//         location,
//         image,
//         job_type: jobType,
//       });
//     if (error) {
//       console.log(error);
//       return { data: null, error: { message: error.message } };
//     }
//     console.log(data);
//     return { data: data, error: null };
//   } catch (error) {
//     console.log(error);
//     return {
//       data: null,
//       error: { message: "Whoops something went wrong. Please refresh..." },
//     };
//   }
// };
