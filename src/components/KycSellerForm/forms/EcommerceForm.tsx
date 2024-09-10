"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EcommerceFormSchema as formSchema, IPopupMessage } from '@/lib/types'
import Loader from "@/components/global/loader"
import { uploadEcommerceForm } from "@/lib/supabase/queries/uploadForms"
import { serverUploadAction } from '@/lib/server-actions/uploadFormActions'

export default function EcommerceForm() {
  const [popup, setPopup] = useState<IPopupMessage>({ message: "", mode: null, show: false })
  const { id } = useParams()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      image: null,
    },
  })

  const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

    async function onSubmit(data: z.infer<typeof formSchema>) {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('category', data.category);

      if (data.image instanceof File) {
        const base64Image = await convertToBase64(data.image);
        formData.append('image', base64Image);
      }

      formData.append('userId', id as string);

      try {
        const result = await serverUploadAction(formData);
        if (result.error) {
          setPopup({ message: result.error.message, mode: 'error', show: true });
        } else {
          setPopup({ message: "Product uploaded successfully", mode: 'success', show: true });
          router.push(`/dashboard/${id}/listings`);
        }
      } catch (error) {
        console.error(error);
        setPopup({ message: "Whoops, something went wrong", mode: 'error', show: true });
      }
    }
  

  return (
    <Form {...form}>
      <form action={form.handleSubmit(onSubmit)} className="space-y-8 py-5">
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
                <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
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
        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? <Loader /> : "Submit"}
        </Button>
      </form>
    </Form>
  )
}