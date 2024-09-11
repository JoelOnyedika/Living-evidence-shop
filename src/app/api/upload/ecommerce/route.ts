import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase";
import { uploadImages } from '@/lib/supabase/queries/uploadForms';
import { v4 as uuidv4 } from 'uuid';
import { getCookie } from '@/lib/server-actions/auth-actions';
import { useState } from 'react';

export async function POST(request: NextRequest) {
  try {
    let cookie = null
    const getUserCookie = async () => {
        const userCookie = await getCookie('userCookie')
        console.log(userCookie)
        if (userCookie) {
            console.log(userCookie)
            cookie = JSON.parse(userCookie.value)
            console.log(cookie)
        }
      }
    
      getUserCookie()

    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const condition = formData.get('condition') as string;
    const images = formData.getAll('image') as File[];
    
    console.log(
        'route',
        images
    )

    const productId = uuidv4();
    const imageUrls = await uploadImages(
      'projectImages',
      'ecommerce',
      cookie.id,
      productId,
      images
    );
    if (imageUrls.error) {
      console.log('image',imageUrls.error)
      return NextResponse.json({ success: false, error: error.message })
    }

    // Create Supabase client
    const supabase = await createClient();
    
    console.log(cookie.id)

    // Insert product data into Supabase
    const { data, error } = await supabase
      .from('ecommerce_products')
      .insert({
        id: productId,
        user_id: cookie.id,
        title,
        description,
        price,
        category,
        image: imageUrls,
        type: 'ecommerce',
        brand,
        condition,
        model
      });

    if (error) {
      console.log(error)
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true, productId, imageUrls });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error uploading images or saving product data' },
      { status: 500 }
    );
  }
}