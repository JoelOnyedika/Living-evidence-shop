"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FormSchema } from "@/lib/types";
import { updateUsername } from "@/lib/supabase/queries/auth"
import { actionSignupUser, signUpWithOAuth, createSessionCookie } from "@/lib/server-actions/auth-actions";
import { FcGoogle } from "react-icons/fc";
import clsx from "clsx";
import { MailCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMemo } from 'react'
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link'

const Signup = () => {
  const [confirmation, setConfirmation] = useState(false);
  const [submitError, setSubmitError] = useState("");


  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (formData: any) => {

    try {
      console.log(formData)
      const signupResult = await actionSignupUser(formData);
      console.log("signup result got triggered", signupResult)

      if (signupResult.error) {
        console.log(signupResult.error)
        setSubmitError(signupResult.error.message);
        form.reset();
        return;
      } else {
        const insertResult = await updateUsername({username: formData.username, email: formData.email})
        console.log("Insert result ", insertResult)

        if (insertResult.error) {
          setSubmitError("Unable to save username to database");
          form.reset();
          return;
        }

        const cookie = await createSessionCookie(formData.email)
        console.log(cookie)

        setConfirmation(true);
      }
      
    } catch (error) {
      console.log(error)
      setSubmitError("An unexpected error occurred");
      form.reset();
    }
    console.log(formData);
  }


  const handleSignupWithOAuth = async (provider) => {
  try {
    const result = await signUpWithOAuth(provider);
    if (result.error) {
      setSubmitError(result.error.message);
    } else {
      console.log('OAuth process successful:', result);
      router.push(result.data.url)
    }
  } catch (error) {
    console.log(error);
    setSubmitError("An unexpected error occurred");
  }
  };

  const isLoading = form.formState.isSubmitting;
  

  return (
    <div className="w-full h-screen flex justify-center items-center my-4">
      <div className="p-8 md:w-1/2 w-full border border-solid rounded-md space-y-5">  {/* Adjusted width here */}
        <div>
          <h1 className="text-2xl font-bold text-center">Create an Account</h1>
          <div className="flex justify-center">
            <span className="mr-2 text-center">Already a user</span>
            <Link href="/login" className="text-blue-500 hover:underline font-bold">
              Log in
            </Link>
          </div>
        </div>
        <div>
          <Button 
            className="flex bg-primary justify-center w-full text-white"
            onClick={() => handleSignupWithOAuth('google')}
          >
            <FcGoogle className="text-xl mr-3"/>
            Signup with Google
          </Button>
        </div>
        <Form {...form}>
          <form
            onChange={() => {
              if (submitError) setSubmitError("");
            }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              disabled={isLoading}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={isLoading}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="joejoe@email.com"
                      {...field}
                      type={"email"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={isLoading}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type={"password"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full bg-primary" type="submit" disabled={isLoading}>
              Submit
            </Button>
          </form>
          {submitError && (
              <Alert>
                <AlertDescription>{submitError.length > 0 && submitError}</AlertDescription>
              </Alert>
            )}
            {(confirmation) && (
              <Alert className={` text-black`}>
                  <MailCheck className="h-4 w-4 text-black" />
                <AlertTitle>
                  {submitError ? "Invalid Link" : "Check your email."}
                </AlertTitle>
                <AlertDescription>
                  {submitError ||
                    "An email confirmation has been sent."}
                </AlertDescription>
              </Alert>
            )}
        </Form>
      </div>
    </div>
  );
};

export default Signup;
