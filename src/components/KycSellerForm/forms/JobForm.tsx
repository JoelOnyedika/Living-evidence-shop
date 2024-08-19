'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { JobFormSchema, IPopupMessage } from '@/lib/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import PopupMessage from '@/components/global/Popup'
import * as z from "zod"
import { useParams } from "next/navigation"
import { useRouter } from 'next/router'
import { uploadJobForm } from "@/lib/supabase/queries/uploadForms"
import Loader from "@/components/global/loader"

const JobForm = (updateData=[]) => {
  const form = useForm<z.infer<typeof JobFormSchema>>({
    resolver: zodResolver(JobFormSchema),
  })

  const onSubmit = async (formData: z.infer<typeof JobFormSchema>) => {
    const { id } = useParams()
    const router = useRouter()
    console.log(formData)
    try {
      const { data, error }: any = await uploadJobForm(formData, id)
      if (error) {
        console.log(error)
        setPopup({ message: error.message, mode: 'error', show: true })
      }
      console.log(data)
      return router.push(`/dashboard/${id}/listings`)
    } catch (error) {
      console.log(error)
      setPopup({ message: "Whoops something went wrong...", mode: 'error', show: true })
    }
  }

  const [popup, setPopup] = useState<IPopupMessage>({ message: "", mode: null, show: false })

  const hidePopup = () => {
    setPopup({ message: "", mode: null, show: false })
  }

  const isSubmitting = form.formState.isSubmitting

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fulltime" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Full-time
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="parttime" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Part-time
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="contract" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Contract
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="internship" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Internship
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="temporary" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Temporary
                      </FormLabel>
                    </FormItem>
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
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isSubmitting ? <Loader /> : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default JobForm