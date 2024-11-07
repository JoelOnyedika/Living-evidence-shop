"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { JobFormSchema, IPopupMessage } from '@/lib/types';
import PopupMessage from '@/components/global/Popup';
import LoadingSpinner from "@/components/global/LoadingSpinner";
import { Loader2 } from 'lucide-react'
import { fetchListingByTableAndId } from '@/lib/supabase/queries/dashboard'
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Navbar from '@/components/Hero/Navbar'


const JobEditForm = () => {
  const [editData, setEditData] = useState(null);
  const form = useForm({
    resolver: zodResolver(JobFormSchema),
    defaultValues: {
      title: editData ? editData.title : '',
      description: editData ? editData.description : '',
      salary: editData ? editData.salary : 0,
      location: editData ? editData.location : '',
      jobType: editData ? editData.jobType : '',
    }
    
  });

  const [popup, setPopup] = useState<IPopupMessage>({ message: "", mode: null, show: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    getListings()
  }, [])

  const { reset } = form;

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title || "",
        description: editData.description || "",
        salary: editData.salary || "",
        location: editData.location || "",
        jobType: editData.jobType || "",
      });
    }
  }, [editData, reset]);


async function getListings() {
    const {data, error} = await fetchListingByTableAndId(params.formId, 'job_postings')
    if (error) {
      setPopup({ message: error.message, mode: 'error', show: true })
    } else {
      setEditData(data)
    }
  }

  const onSubmit = async (data: z.infer<typeof JobFormSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('userId', params.id);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('salary', data.salary.toString());
    formData.append('location', data.location);
    formData.append('jobType', data.jobType);
    // formData.append('image', data.image);

    try {
      const response = await fetch('/api/upload/jobPosting', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log('Failed to upload');
        setPopup({ message: 'Failed to upload', mode: 'error', show: true })
      }

      const result = await response.json();
      router.push(`/jobs`);
    } catch (error) {
      console.error('Error:', error);
      setPopup({ message: 'Whoops, something went wrong', mode: 'error', show: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hidePopup = () => {
    setPopup({ message: "", mode: null, show: false });
  };

  return (
    <div className="flex flex-col space-y-5">
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
      <Navbar />
      <Card>
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
                  <Input placeholder="Enter job title" {...field} />
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
                  <Textarea rows={3} placeholder="Enter job description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter salary" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
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
                  <Input placeholder="Enter job location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {['fulltime', 'parttime', 'contract', 'internship', 'temporary'].map((type) => (
                      <FormItem key={type} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={type} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
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
      </Card>
      
    </div>
  );
};

export default JobEditForm;