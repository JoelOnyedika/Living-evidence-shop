"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PopupMessage from "@/components/global/Popup";
import { IPopupMessage } from "@/lib/types";
import { useParams } from "next/navigation";
import { EcommerceFormSchema as formSchema } from "@/lib/types";
import LoadingSpinner from '@/components/global/LoadingSpinner'
import { fetchListingByTableAndId } from '@/lib/supabase/queries/dashboard'
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Navbar from '@/components/Hero/Navbar'

export default function EcommerceEditForm() {
  const [popup, setPopup] = useState<IPopupMessage>({
    message: "",
    mode: null,
    show: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState(null)
  const router = useRouter();
  const params = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: editData ? editData.user_id : "",
      title: editData ? editData.title : "",
      description: editData ? editData.description : "",
      price: editData ? editData.price : "",
      category: editData ? editData.category : "",
      brand: editData ? editData.brand : "",
      model: editData ? editData.model : "",
      condition: editData ? editData.condition : "",
    },
  });
  const { reset } = form;

  useEffect(() => {
    if (editData) {
      reset({
        userId: editData.user_id || "",
        title: editData.title || "",
        description: editData.description || "",
        price: editData.price || "",
        category: editData.category || "",
        brand: editData.brand || "",
        model: editData.model || "",
        condition: editData.condition || "",
      });
    }
  }, [editData, reset]);

  useEffect(() => {
    getListings()
  }, [])

  async function getListings() {
    const {data, error} = await fetchListingByTableAndId(params.formId, 'ecommerce_products')
    if (error) {
      setPopup({ message: error.message, mode: 'error', show: true })
    } else {
      console.log(data)
      setEditData(data)
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("userId", params.id); // Replace with actual user ID
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    // formData.append('image', data.image);
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("condition", data.condition);

    data.image.forEach((image, index) => {
      formData.append(`image`, image);
    });

    try {
      const response = await fetch("/api/upload/ecommerce", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setPopup({ message: "Failed to upload", mode: "destructive" });
        console.log(response);
      }

      const result = await response.json();
      console.log(result);
      router.push(`/buy/ecommerce/${result.productId}`);
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show error message to user)
      setPopup({ message: "Whoops, something went wrong", mode: destructive });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hidePopup = () => {
    setPopup({ show: false, message: "", mode: "" });
  };
  return (
    <div className="flex flex-col space-y-5">
      <Navbar />
      <span className="justify-center font-bold items-center flex text-3xl">
       Edit your Ecommerce Listing
      </span>
      <Card>
        <CardContent>
          <Form {...form}>
            {popup.show && (
              <PopupMessage
                message={popup.message}
                mode={popup.mode}
                onClose={hidePopup}
                style={{
                  position: "fixed",
                  top: "20px",
                  right: "20px",
                  zIndex: 9999,
                  backgroundColor: "red",
                  color: "white",
                  padding: "10px",
                }}
              />
            )}

            {editData ? <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product title" {...field} defaultValue={editData.title} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product brand" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product model" {...field} />
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
                          <Input
                            type="number"
                            placeholder="Enter product price"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
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
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="old">Old</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                          </SelectContent>
                        </Select>
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
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []); // Convert FileList to Array<File>
                              field.onChange(files); // Pass array of files to field's onChange
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
          
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <div className="flex space-x-2"> <Loader2 className="animate-spin"/> <span> Uploading... </span></div> : "Update"}
                  </Button>
                </form> : <LoadingSpinner />}
          </Form>  
        </CardContent>
      </Card>
    </div>
  );
}
