"use server";

import { z } from "zod";
import { FormSchema } from "../types";
// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import {createClient} from '@/lib/supabase'

import * as dotenv from "dotenv";

dotenv.config({ path: "../../env" });

export async function actionSignupUser({
  email,
  password,
}) {
  console.log("Email and password are going through", email, password);

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("basic_profiles")
      .select("*")
      .eq("email", email);

    if (error) {
      console.error("Error fetching user:", error.message);
      return { error: { message: "An error occurred while checking user existence" } };
    }

    console.log("Data from database:", data);

    if (data && data.length > 0) { // Check if the array has elements
      console.log("User exists", data[0]);
      return { error: { message: "User already exists with this email" } };
    } else {
      // Sign up the user
      console.log(email, password)
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
        },
      });

      console.log(response)
      
      // Check if sign-up was successful
      if (response.error) {
        console.error("Error signing up user:", response.error);
        return { data: null, error: { message: "Error signing up" } };
      }

     return { 
        data: {
          id: response.data.user?.id,
          email: response.data.user?.email,
        }, 
        error: null 
      };
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return { error: { message: "An unexpected error occurred" } };
  }
}



export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = await createClient()
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return error?.message.toString()  
  } catch (error) {
    console.log(error)
  }
  
}

export async function createSessionCookie(email = null) {
  try {
    const supabase = await createClient();

    let userEmail;
    let fullName;
    // let avatarUrl;
    let id;

    // If no email is provided, fetch the session to get the email
    if (!email) {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.log('Error fetching session:', sessionError.message);
        throw sessionError;
      }

      const { session } = sessionData;

      if (session) {
        userEmail = session.user.email;
        fullName = session.user.user_metadata.full_name;
        // avatarUrl = session.user.user_metadata.avatar_url;
        id = session.user.id
      } else {
        console.log('Session not found');
        return;
      }
    } else {
      userEmail = email;

      // Fetch user details using the email
      const { data, error } = await supabase
        .from("basic_profiles")
        .select("*")
        .eq("email", email);

      if (error) throw error;

      if (data && data.length > 0) {
        const user = data[0];
        fullName = user.username;
        // avatarUrl = user.avatar_img;
        userEmail = user.email;
        id = user.id
      } else {
        console.log('No user found with this email');
        return;
      }
    }

    // Update the user data in the database
    const { error: updateError } = await supabase
      .from("basic_profiles")
      .update({ username: fullName, email: userEmail })
      .eq("email", userEmail);

    if (updateError) throw updateError;

    // Set the user cookie
    cookies().set("userCookie", JSON.stringify({ username: fullName, userEmail, id: id }), {
      httpOnly: true,
      secure: true,
    });

    console.log(cookies().get('userCookie'));
  } catch (error) {
    console.log('Error creating session cookie:', error);
  }
}

export const getCookie = async (cookieName) => {
  return cookies().get(cookieName)
}

export const signUpWithOAuth = async (provider) => {
  try {
    const supabase = await createClient();
    console.log(supabase)
    const origin = headers().get('origin');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${origin}/api/auth/callback` }
    });

    if (error) {
      console.log('Error signing up with', provider, error.message);
      return { error };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: { message: "Something went wrong!" } };
  }
};
