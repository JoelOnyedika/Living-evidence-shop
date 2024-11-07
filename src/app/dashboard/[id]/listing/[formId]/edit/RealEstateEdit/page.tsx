"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RealEstateFormSchema, IPopupMessage } from "@/lib/types";
import PopupMessage from "@/components/global/Popup";
import LoadingSpinner from "@/components/global/LoadingSpinner";
import { fetchListingByTableAndId } from '@/lib/supabase/queries/dashboard'
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Navbar from '@/components/Hero/Navbar'

const RealEstateEditForm = () => {
  const [popup, setPopup] = useState<IPopupMessage>({
    message: "",
    mode: null,
    show: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState(null);

  const router = useRouter();
  const params = useParams();

  const form = useForm<z.infer<typeof RealEstateFormSchema>>({
    resolver: zodResolver(RealEstateFormSchema),
    defaultValues: {
      title: editData ? editData.title : "",
      description: editData ? editData.description : "",
      price: editData ? editData.price : 0,
      location: editData ? editData.location : "",
      propertyType: editData ? editData.propertyType : "",
      image: editData ? editData.image : null,
    },
    
  });
  useEffect(() => {
    getListings()
  }, [])


  const { reset } = form;

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title || "",
        description: editData.description || "",
        price: editData.price || "",
        location: editData.location || "",
        propertyType: editData.propertyType || "",
        image: editData.image || "",
      });
    }
  }, [editData, reset]);


  async function getListings() {
    const {data, error} = await fetchListingByTableAndId(params.formId, 'real_estate_listings')
    if (error) {
      setPopup({ message: error.message, mode: 'error', show: true })
    } else {
      setEditData(data)
    }
  }
  const onSubmit = async (data: z.infer<typeof RealEstateFormSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('userId', params.id);
    formData.append('title', data.title);
    formData.append('location', data.location);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('propertyType', data.propertyType);
    data.image.forEach((image, index) => {
      formData.append(`image`, image);
    });

    try {
      const response = await fetch('/api/upload/realEstate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setPopup({message: 'Failed to upload', mode: 'error'});
      }

      const result = await response.json();
      router.push(`/buy/realestate/${result.productId}`);
    } catch (error) {
      console.log('Error:', error);
      setPopup({ message: 'Whoops, something went wrong', mode: 'error', show: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hidePopup = () => {
    setPopup({ show: false, message: "", mode: null });
  };

  return (
    <div className="flex flex-col space-y-5">
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
      <Navbar />
      <span className="justify-center font-bold items-center flex text-3xl">
       Edit your Real Estate Listing
      </span>
      {editData ?       <Card>
        <CardContent>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property title" {...field} />
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
                    <Textarea rows={3} placeholder="Enter property description" {...field} />
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
                    <Input type="number" placeholder="Enter property price" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
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
            <Button type="submit" className="w-full">
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>  
        </CardContent>
      </Card> : <LoadingSpinner />}

      
    </div>
  );
};

export default RealEstateEditForm;