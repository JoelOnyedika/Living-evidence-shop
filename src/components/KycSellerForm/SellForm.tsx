"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import EcommerceForm from "./forms/EcommerceForm";
import RealEstateForm from "./forms/RealEstateForm";
import JobForm from "./forms/JobForm";
import { ChevronDown, X } from "lucide-react";

export default function SellForm() {
  const [selectedCategory, setSelectedCategory] = useState("ecommerce");
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  return (
    <div className="bg-background mt-8 text-foreground min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl w-full">
        <div className="flex md:flex-col items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {selectedCategory === "ecommerce"
              ? "Sell on Our Marketplace"
              : selectedCategory === "realestate"
              ? "Sell Commodities on Our Marketplace"
              : selectedCategory === "job"
              ? "Post Jobs and get Hired!"
              : "Sell on Our Marketplace"}
          </h1>
          <div className="flex items-center gap-2 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Select Category: {selectedCategory}{" "}
                  <ChevronDownIcon className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleCategoryChange("ecommerce")}
                  className={
                    selectedCategory === "ecommerce"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  E-commerce Product
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCategoryChange("realestate")}
                  className={
                    selectedCategory === "realestate"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  Real Estate Listing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCategoryChange("job")}
                  className={
                    selectedCategory === "job"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  Job Posting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden md:flex pt-5 items-center gap-2">
            <Button
              variant={selectedCategory === "ecommerce" ? "primary" : "outline"}
              className="active:shadow-glow"
              onClick={() => handleCategoryChange("ecommerce")}
            >
              E-commerce Product
            </Button>
            <Button
              variant={
                selectedCategory === "realestate" ? "primary" : "outline"
              }
              onClick={() => handleCategoryChange("realestate")}
            >
              Real Estate Listing
            </Button>
            <Button
              variant={selectedCategory === "job" ? "primary" : "outline"}
              onClick={() => handleCategoryChange("job")}
            >
              Job Posting
            </Button>
          </div>
        </div>
        <Card>
          <CardContent>
            {selectedCategory === "ecommerce" && <EcommerceForm />}
            {selectedCategory === "realestate" && <RealEstateForm />}
            {selectedCategory === "job" && <JobForm />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
