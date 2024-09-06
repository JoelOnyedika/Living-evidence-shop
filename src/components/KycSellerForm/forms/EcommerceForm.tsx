"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EcommerceFormSchema as formSchema, IPopupMessage } from '@/lib/types'
import { useState }from 'react'
import { createClient } from "@/lib/supabase"
import { uploadEcommerceForm } from "@/lib/supabase/queries/uploadForms"
import { useParams, useRouter } from 'next/navigation'
import Loader from "@/components/global/loader"

export default function EcommerceForm(updateData=[]) {
  const [popup, setPopup] = useState<IPopupMessage>({ message: "", mode: null, show: false })
  const { id } = useParams()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,category: ""
    },
  })

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    console.log(formData)
    try {
      const { data, error } = await uploadEcommerceForm(formData, id)
      if (error) {
        console.log(error)
        setPopup({ message: error.message, mode: 'error', show: true })
      }
      console.log(data)
      //return router.push(`/dashboard/${id}/listings`)

    } catch (error) {
      console.log(error)
      setPopup({ message: "Whoops something went wrong", mode: 'error', show: true })

    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter product title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter product price" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input type="file" {...field} value={field.value?.filename} onChange={(e) => field.onChange(e.target.files?.[0])} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mansion">Mansion</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="Bungalow">Bungalow</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <Loader />: "Submit"}</Button>
      </form>
    </Form>
  )
}