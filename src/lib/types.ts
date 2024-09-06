import { z } from "zod";

export const FormSchema = z.object({
  username: z.string().describe("Username").min(4, {message: "Username must have at least five characters"}).max(20, {message: "Username must have at most 20 characters"}),
  email: z.string().describe("Email").email({ message: "Invalid email" }),
  password: z
    .string()
    .describe("Password")
    .min(5, { message: "Password must be at least 5 characters" }),
});


export const LoginFormSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid email" }),
  password: z
    .string()
    .describe("Password")
    .min(5, { message: "Password must be at least 5 characters" }),
});

export const DialogFormSchema = z.object({
  url: z.string().describe("url")
})

export interface IPopupMessage {
    message: string;
    mode: null | "success" | "error" | "warning" ;
    show: boolean;
  }

export type websiteTable = 'websites' | 'documents' | 'videos'
const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
const numberRegex = /^\d+$/
export const maxFileSize = 5 * 1024 * 1024 //5MB
export const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']


const ImageSchema = z.object({
  name: z.string(),
  size: z.number().max(maxFileSize, "File must be less than 5MB"),
  type: z.enum(acceptedImageTypes, "File type must be .jpg, .jpeg, .png, .webp")
})

export const DetailedKycSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  nationality: z.string().min(1, "Nationality is required"),
  address: z.string().min(5, "Address is required"),
  income: z.number().positive("Income must be positive"),
  assets: z.number().nonnegative("Assets must be non-negative"),
  liabilities: z.number().nonnegative("Liabilities must be non-negative"),
  preferredContact: z.enum(["email", "phone", "both"], {
    required_error: "Please select a preferred contact method",
  }),
  profilePhoto: z.any(),
  governmentID: z.any(),
})

export const EcommerceFormSchema = z.object({
  title: z.string().min(3, {message: "Title must have at least three characters"}).max(20, {message: "Title must have at most 20 characters"}),
  description: z.string().min(10, {message: "Description must have at least ten characters"}).max(250, {message: "Title must have at most 250 characters"}),
  price: z.number().positive("Price must be a positive number"),
  image: ImageSchema,
  category: z.string(),
})

export const JobFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  salary: z.number().positive("Salary must be a positive number"),
  location: z.string().min(1, "Location is required"),
  jobType: z.enum(["fulltime", "parttime", "contract", "internship", "temporary"], {
    required_error: "Please select a job type",
  }),
  image: z.any().optional(),
  category: z.literal("Job Posting"),
})

export const RealEstateFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  location: z.string().min(10, {
    message: "location must be at least 10 characters.",
  }),
  price: z.string().regex(phoneRegex, {
    message: "Price must be a positive number.",
  }),
  image: z.any(),
  category: z.array(z.string()).nonempty({
    message: "Please select a category.",
  }),
})