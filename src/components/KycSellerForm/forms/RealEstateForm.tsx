import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RealEstateFormSchema, IPopupMessage } from "@/lib/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import PopupMessage from "@/components/global/Popup";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { z } from "zod";
import { uploadRealEstateForm } from "@/lib/supabase/queries/uploadForms";
import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";

const RealEstateForm = (updateData=[]) => {
  const [popup, setPopup] = useState<IPopupMessage>({
    message: "",
    mode: null,
    show: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams()

  const showPopup = (message: string, mode: string | null) => {
    setPopup({ show: true, message, mode });
  };

  const hidePopup = () => {
    setPopup({ show: false, message: "", mode: null });
  };

  const form = useForm<z.infer<typeof RealEstateFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(RealEstateFormSchema),
  });

  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('userId', params.id); // Replace with actual user ID
    formData.append('title', data.title);
    formData.append('location', data.location);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('propertyType', data.propertyType);
    formData.append('image', data.image);
  
    try {
      const response = await fetch('/api/upload/ecommerce', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        setPopup({ message: 'Failed to upload', mode: 'error', show: true });
        console.log(response);
      }
  
      const result = await response.json();
      console.log(result);
      router.push(`/buy/${result.productId}`);
    } catch (error) {
      console.error('Error:', error);
      setPopup({ message: 'Whoops, something went wrong', mode: 'error', show: true });
    } finally {
      setIsSubmitting(false);
    }
  };
  


  return (
    <>
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
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2 py-5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter property title"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <small className="text-red-500">
              {form.formState.errors.title.message}
            </small>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="Enter property description"
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <small className="text-red-500">
              {form.formState.errors.description.message}
            </small>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter property price"
            {...form.register("price")}
          />
          {form.formState.errors.price && (
            <small className="text-red-500">
              {form.formState.errors.price.message}
            </small>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter property location"
            {...form.register("location")}
          />
          {form.formState.errors.location && (
            <small className="text-red-500">
              {form.formState.errors.location.message}
            </small>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="property-type">Property Type</Label>
          <Select id="property-type" {...form.register("propertyType")}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.propertyType && (
            <small className="text-red-500">
              {form.formState.errors.propertyType.message}
            </small>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="image">Image</Label>
          <Input id="image" type="file" />
          {form.formState.errors.image && (
            <small className="text-red-500">
              {form.formState.errors.image.message}
            </small>
          )}
        </div>
        <Button className="w-full" type="submit">
          {isSubmitting ? <Loader/> : "Submit"}
        </Button>
      </form>
    </>
  );
};

export default RealEstateForm;
