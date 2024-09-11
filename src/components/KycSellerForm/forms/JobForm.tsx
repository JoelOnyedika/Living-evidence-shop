import React, { useState } from 'react';
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
import Loader from "@/components/global/loader";

const JobForm = () => {
  const form = useForm({
    resolver: zodResolver(JobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      salary: 0,
      location: '',
      jobType: '',
      image: null,
    },
  });

  const [popup, setPopup] = useState<IPopupMessage>({ message: "", mode: null, show: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();

  const onSubmit = async (data: z.infer<typeof JobFormSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('userId', params.id);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('salary', data.salary.toString());
    formData.append('location', data.location);
    formData.append('jobType', data.jobType);
    formData.append('image', data.image);

    try {
      const response = await fetch('/api/upload/jobPosting', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload');
      }

      const result = await response.json();
      router.push(`/buy/job/${result.productId}`);
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
    <>
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
          <Button type="submit" className="w-full">
            {isSubmitting ? <Loader /> : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default JobForm;