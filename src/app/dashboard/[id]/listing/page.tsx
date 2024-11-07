"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Webcam, Mails } from 'lucide-react'
import Navbar from "@/components/Hero/Navbar"
import DashSidebar from "../../../../components/Dashboard/DashSidebar"
import { useState, useEffect } from 'react'
import { checkKycStatus } from '@/lib/supabase/queries/kyc'
import { useParams, useRouter } from 'next/navigation'
import { IPopupMessage } from '@/lib/types'
import { fetchAllTablesData } from '@/lib/supabase/queries/dashboard'
import PopupMessage from '@/components/global/Popup'
import LoadingSpinner from '@/components/global/LoadingSpinner'
import {parseTimestamp} from '@/lib/helpers'
import Image from 'next/image'

export default function Listings() {
  const [popup, setPopup] = useState<IPopupMessage>({ message: "", mode: null, show: false })
  const [kycStatus, setKycStatus] = useState<null | boolean>(true) // must be null at all times to show sk
  const { id } = useParams()
  const [listings, setListings] = useState(null)
  const router = useRouter()

  const fetchListing = async () => {
    const { data, error } = await fetchAllTablesData(id)
    if (error) {
      setPopup({ message: error.message, mode: 'error', show: true })
    } else {
      data.forEach((obj) => {
        // Check if `obj.image` is a string and try parsing it only if necessary
        if (typeof obj.image === 'string') {
          try {
            obj.image = JSON.parse(obj.image);
          } catch (e) {
            console.error('Error parsing image JSON:', e);
          }
        }
      });
      console.log(data)
      setListings(data)
    }
  }

  const checkKyc = async ()  => {
    try {
      const { data, error } = await checkKycStatus(id)
      if (error) {
        console.log(error)
        setPopup({ message: error.message, mode: 'error', show: true })
      }
      // note that data returned is bool
      if (data) {
        setKycStatus(data)
        return true
      } else setKycStatus(false)
        return false
    } catch (error) {
      console.log(error)
      setPopup({ message: "Whoops something went wrong. Please refresh", mode: 'error', show: true })
    }
  }
  
  useEffect(() => {
    fetchListing()
  }, [])

  function guessTypeAndTable(type: string){
    // this function guesses the type the table and the page route for the edit form
    if (type === 'jobPosting')  return ['Job Posting', 'job_postings', 'JobEdit']
    else if (type === 'ecommerce')  return ['E-Commerce', 'ecommerce_products', 'EcommerceEdit']
    else if (type === 'realEstate')  return ['Real Estate', 'real_estate_listings', 'RealEstateEdit']
    return ''
  }

  const handleCreateListing = () => {}
  const handleEditListing = (listingId:string, page: string) => {
    router.push(`/dashboard/${id}/listing/${listingId}/edit/${page}`)
  }
  const handleDeleteListing = (listingId) => {}
  const handleViewChat = () => {}
  
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex">
        <DashSidebar />
        <main className="flex-1 overflow-auto p-6 font-semibold">
          {popup.show && (
          <PopupMessage 
            message={popup.message} 
            mode={popup.mode} 
            onClose={() => setPopup({ show: false, message: '', mode: '' })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings !== null ? listings.map((listing) => (
              <Card key={listing.id}>
              {listing.image && listing.image.length > 0 ? (
                <Image
                  src={listing.image[0]}
                  alt={listing.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : <Image
                  src={"https://fyubkrzqjtcfybpusvuk.supabase.co/storage/v1/object/public/defaults/noImageProvided.png?t=2024-11-03T22%3A37%3A09.135Z"}
                  alt={listing.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-t-lg"
                />}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="">{listing.title}</p>
                      <p className="text-sm text-muted-foreground">{guessTypeAndTable(listing.type)[0]}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {listing.type === "jobPosting" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Applications</p>
                        <p className="font-medium">{listing.title}</p>
                      </div>
                    )}
                    {listing.type === "ecommerce" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Orders</p>
                        <p className="font-medium">{listing.title}</p>
                      </div>
                    )}
                    {listing.type === "realEstate" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Inquiries</p>
                        <p className="font-medium">{listing.title}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">{parseTimestamp(listing.created_at)[0]}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className=" font-semibold" onClick={() => handleEditListing(listing.id, guessTypeAndTable(listing.type)[2])}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className=" font-semibold" onClick={() => handleDeleteListing(listing.id)}>
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )) : <LoadingSpinner />}
          </div>
        </main>
      </div>
    </div>
  )
}