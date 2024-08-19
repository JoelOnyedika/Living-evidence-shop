"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Webcam, Mails } from 'lucide-react'
import Navbar from "@/components/Hero/Navbar"
import DashSidebar from "../../../../components/Dashboard/DashSidebar"

export default function Listings() {
  const [listings, setListings] = useState([
    {
      id: 1,
      type: "Job Posting",
      title: "Senior Software Engineer",
      status: "Active",
      views: 125,
      applications: 32,
      createdAt: "2023-05-01",
    },
    {
      id: 2,
      type: "E-commerce",
      title: "Handcrafted Ceramic Mugs",
      status: "Active",
      views: 250,
      orders: 18,
      createdAt: "2023-04-15",
    },
    {
      id: 3,
      type: "Real Estate",
      title: "3 Bedroom House for Rent",
      status: "Pending",
      views: 80,
      inquiries: 12,
      createdAt: "2023-03-28",
    },
    {
      id: 4,
      type: "Job Posting",
      title: "Marketing Coordinator",
      status: "Closed",
      views: 90,
      applications: 15,
      createdAt: "2023-02-20",
    },
    {
      id: 5,
      type: "E-commerce",
      title: "Vintage Record Player",
      status: "Active",
      views: 180,
      orders: 22,
      createdAt: "2023-01-10",
    },
    {
      id: 6,
      type: "Real Estate",
      title: "2 Bedroom Apartment for Sale",
      status: "Pending",
      views: 120,
      inquiries: 8,
      createdAt: "2022-12-05",
    },
  ])
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Contact Request",
      message: 'New inquiry for your "Handcrafted Ceramic Mugs" listing',
      createdAt: "2023-05-02",
    },
    {
      id: 2,
      type: "Message",
      message: 'Buyer has a question about your "3 Bedroom House for Rent" listing',
      createdAt: "2023-04-30",
    },
    {
      id: 3,
      type: "Contact Request",
      message: 'New application for your "Senior Software Engineer" job posting',
      createdAt: "2023-04-28",
    },
    {
      id: 4,
      type: "Message",
      message: 'Buyer has left a review for your "Vintage Record Player"',
      createdAt: "2023-04-25",
    },
  ])
  const handleCreateListing = () => {}
  const handleEditListing = (listingId) => {}
  const handleDeleteListing = (listingId) => {}
  const handleViewChat = () => {}
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex">
        <DashSidebar />
        <main className="flex-1 overflow-auto p-6 font-semibold">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="">{listing.title}</p>
                      <p className="text-sm text-muted-foreground">{listing.type}</p>
                    </div>
                    <Badge variant={listing.status === "Active" ? "secondary" : "outline"} className="px-2 py-1 text-xs">
                      {listing.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Views</p>
                      <p className="font-medium">{listing.views}</p>
                    </div>
                    {listing.type === "Job Posting" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="font-medium">{listing.applications}</p>
                      </div>
                    )}
                    {listing.type === "E-commerce" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Orders</p>
                        <p className="font-medium">{listing.orders}</p>
                      </div>
                    )}
                    {listing.type === "Real Estate" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Inquiries</p>
                        <p className="font-medium">{listing.inquiries}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">{listing.createdAt}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center justify-end gap-2">
                    <Dialog>
                      <DialogTrigger>
                        <Button variant="outline" size="sm" className=" font-semibold" onClick={() => handleEditListing(listing.id)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <span className=" font-semibold">
                          Edit your title
                        </span>
                        <Input />
                        <div className="flex space-x-3">
                          <DialogClose>
                            <Button variant="outline" className=" font-semibold" onClick={() => handleDeleteListing(listing.id)}>
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button variant="destructive" className=" font-semibold" onClick={() => handleDeleteListing(listing.id)}>
                            Save changes
                          </Button>      
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" className=" font-semibold" onClick={() => handleDeleteListing(listing.id)}>
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}