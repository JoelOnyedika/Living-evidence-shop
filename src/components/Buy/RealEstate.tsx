'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bed, Bath, Square, MapPin, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { v4 as uuidV4 } from 'uuid'
import { useRouter } from 'next/navigation'


export default function RealEstate({data}: any) {
  const image = JSON.parse(data.image);
  const chatId = uuidV4()
  const router = useRouter()

  console.log(data)


  // On the product page
const handleContactSeller = () => {
  localStorage.setItem('currentSellerId', data.user_id);
  console.log(localStorage.getItem('currentSellerId'))

  router.push(`/buy/${data.type}/${data.id}/${chatId}/chat`)
};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Carousel className="w-full max-w-xl">
            <CarouselContent>
                <CarouselItem>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Image src={image[0]} alt={`data image `} width={600} height={400} className="rounded-lg object-cover" />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">${data.price.toLocaleString()}</h2>
                <Badge variant="secondary" className="text-lg">For Sale</Badge>
              </div>
              <p className="text-muted-foreground mb-4 flex items-center">
                <MapPin className="mr-2" size={18} />
                {data.location}
              </p>
              <p className="text-sm text-muted-foreground">{data.description}</p>
            </CardContent>
          </Card>
              <Button className="w-full" onClick={() => handleContactSeller()}>
                Contact Seller
              </Button>
        </div>
      </div>
    </div>
  )
}