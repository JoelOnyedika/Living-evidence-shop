'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DetailedKycSchema, IPopupMessage, acceptedImageTypes, maxFileSize } from '@/lib/types'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { createUserKyc, updateUserKycStatus } from '@/lib/supabase/queries/kyc'
import { router } from 'next/navigation'
import PopupMessage from '@/components/global/Popup'
import { countries } from '@/lib/constants'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function KycForm({ userId }: any) {

  const [popup, setPopup] = useState<IPopupMessage>({ message: "", mode: '', show: false })
  const form = useForm<z.infer<typeof DetailedKycSchema>>({
    mode: "onChange",
    resolver: zodResolver(DetailedKycSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof DetailedKycSchema>> = async (formData: any) => {
    console.log("Something")
    console.log('before', formData)
    const handleFileData = (file: File) => {
      if (file instanceof File) {
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        };
      }
      return null;
    };

    const processedFormData = { ...formData };

    // Handle File objects
    if (processedFormData.profilePhoto instanceof File) {
      processedFormData.profilePhoto = handleFileData(processedFormData.profilePhoto);
    }
    if (processedFormData.governmentID instanceof File) {
      processedFormData.governmentID = handleFileData(processedFormData.governmentID);
    }
  
    // Stringify the processed form data
    const stringifiedFormData = JSON.stringify(processedFormData);
    console.log(stringifiedFormData)

    try {
      const { data: userKycData, error: userKycError } = await createUserKyc(stringifiedFormData, userId)
      if (userKycError) {
        console.log(userKycError)
        setPopup({ message: "Something went wrong, please refresh", mode: "error", show: true })
      }
      console.log(userKycData)
      const { data: userKycStatusData, error: userKycStatusError } = await updateUserKycStatus(userId)
        if (userKycStatusError) {
          console.log(userKycStatusError)
          setPopup({ message: "Something went wrong, please refresh", mode: "error", show: true }) 
        }
        console.log(data)
        //return router.push('/')
    } catch(error) {
        console.log(error)
        setPopup({ message: "Something went wrong, please refresh", mode: "error", show: true }) 
        return
    }
  }

  useEffect(() => {
  console.log('Popup state:', popup);
}, [popup]);

  const showPopup = (message, mode) => {
    setPopup({ show: true, message, mode })
  }

  const hidePopup = () => {
    setPopup({ show: false, message: '', mode: '' })
  }

// ... (rest of the component code)

return (
  <div className="flex flex-col">
    <div>
      {popup.show && (
        <PopupMessage 
          message={popup.message} 
          mode={popup.mode} 
          onClose={hidePopup}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
          }}
        />
      )}
    </div>
    <Card className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Know Your Customer</CardTitle>
        <CardDescription>Please provide the following information to complete your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.toLowerCase()} value={country.toLowerCase()}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 fake street opp someone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Assets</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="250000" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="liabilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Liabilities</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="75000" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Contact Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred contact method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profilePhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept={acceptedImageTypes.join(',')}
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="governmentID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Government-Issued ID</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept={acceptedImageTypes.join(',')}
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full">
              <Button type="submit" className="w-full">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
)
}