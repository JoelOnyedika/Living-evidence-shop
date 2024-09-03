"use client";

import Navbar from "@/components/Hero/Navbar";
import DashSidebar from "../../../../components/Dashboard/DashSidebar";
import React, { useState } from "react";
import { Star, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Reviews() {
  // Mock data for reviews
  const mockReviews = [
    {
      id: 1,
      productName: "Ergonomic Chair",
      rating: 4,
      review: "Great chair, very comfortable!",
      customerName: "John Doe",
      date: "2023-06-15",
      response: "",
    },
    {
      id: 2,
      productName: "Wireless Mouse",
      rating: 5,
      review: "Excellent product, works flawlessly.",
      customerName: "Jane Smith",
      date: "2023-06-14",
      response: "Thank you for your feedback!",
    },
    {
      id: 3,
      productName: "Mechanical Keyboard",
      rating: 3,
      review: "Decent keyboard, but a bit noisy.",
      customerName: "Mike Johnson",
      date: "2023-06-13",
      response: "",
    },
    // Add more mock reviews as needed
  ];

  const [reviews, setReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const filteredReviews = reviews
    .filter(
      (review) =>
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.review.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (review) =>
        filterRating === "all" || review.rating === parseInt(filterRating),
    );

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview,
  );

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const handleResponseSubmit = (id: number, response: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, response } : review,
      ),
    );
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ));
  };
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex">
        <DashSidebar />
        <div className="container mx-auto p-4 max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">Product Reviews</h1>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {currentReviews.map((review) => (
            <Card key={review.id} className="mb-4">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{review.productName}</span>
                  <div className="flex">{renderStars(review.rating)}</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{review.review}</p>
                <p className="text-sm text-gray-500">
                  By {review.customerName} on {review.date}
                </p>
                {review.response && (
                  <div className="mt-2 p-2 bg-gray-100 rounded">
                    <p className="font-semibold">Your response:</p>
                    <p>{review.response}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <form
                  className="w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleResponseSubmit(
                      review.id,
                      formData.get("response") as string,
                    );
                    e.currentTarget.reset();
                  }}
                >
                  <Textarea
                    name="response"
                    placeholder="Write your response..."
                    className="w-full mb-2"
                  />
                  <Button type="submit">Submit Response</Button>
                </form>
              </CardFooter>
            </Card>
          ))}
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
