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
import {useState} from "react";
import {LoginFormSchema} from "@/lib/types";

import { actionLoginUser, createSessionCookie, signUpWithOAuth } from "@/lib/server-actions/auth-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link'

const Login = () => {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

const onSubmit: SubmitHandler<z.infer<typeof LoginFormSchema>> = async (
    formData
  ) => {
    try {
      const {data, error} = await actionLoginUser(formData);
      console.log(error);
      if (error) {
        form.reset();
        setSubmitError(error.message);
        console.log("error", error);
      } else {
        console.log("loginData", data)
        const {email} = formData
        const sessionCookie = await createSessionCookie(email)
        console.log(sessionCookie)
        //router.replace("/dashboard/home");
      }
    } catch (error) {
      console.log(error);
      setSubmitError("An unexpected error occurred");
    }
  };

  const handleSignupWithOAuth = async (provider) => {
  try {
    const result = await signUpWithOAuth(provider);
    if (result.error) {
      setSubmitError(result.error.message);
    } else {
      console.log('OAuth process successful:', result);
      router.push(result.data.url);

    }
  } catch (error) {
    console.log(error);
    setSubmitError("An unexpected error occurred");
  }
};

 const router = useRouter();
  const isLoading = form.formState.isSubmitting;
  const [submitError, setSubmitError] = useState("")

  return (
   <div className="w-full h-screen  text-nowrap flex justify-center items-center my-4">
      <div className="p-8 md:w-1/2 w-full border border-solid rounded-md space-y-5 p-10">
        <div>
          <h1 className="text-2xl font-bold text-center">Log in</h1>
          <div className="flex justify-center">
            <span className="mr-2 text-sm font-semibold text-center">Haven't signed up yet?</span>
            <Link href="/signup" className="text-blue-500 hover:underline font-bold">
              Signup
            </Link>
          </div>
        </div>
        <div>
          <Button
            className="flex bg-primary justify-center w-full text-white"
            onClick={() => handleSignupWithOAuth('google')}
          >
            <FcGoogle className="size-6 mr-3" />
            Continue with Google
          </Button>
        </div>
        <Form {...form}>
          <form
            onChange={() => {
              if (submitError) setSubmitError('');
            }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
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
                      type="email"
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
                    <Input
                      placeholder=""
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full bg-primary" type="submit" disabled={isLoading}>
              Submit
            </Button>
          </form>
        </Form>
        {submitError && (
          <Alert className="bg-red-400">
            <AlertDescription className="text-white">
              {submitError}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Login;