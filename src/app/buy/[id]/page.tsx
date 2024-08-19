import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Bookmark } from 'lucide-react'
import cam from '@/components/images/camera.png'
import Image from 'next/image'
import Navbar from "@/components/Hero/Navbar"
import Reviews from "@/components/Hero/Reviews"

export default function Component() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex-1 grid gap-4">
          <div className="grid gap-4">
            <Image
              src={cam}
              width={800}
              height={500}
              alt="Product Image"
              className="rounded-lg object-cover w-full aspect-[16/9]"
            />
            <div className="grid grid-cols-3 gap-4">
              <Image
                src={cam}
                width={200}
                height={150}
                alt="Product Thumbnail 1"
                className="rounded-lg object-cover w-full aspect-[4/3]"
              />
              <Image
                src={cam}
                width={200}
                height={150}
                alt="Product Thumbnail 2"
                className="rounded-lg object-cover w-full aspect-[4/3]"
              />
              <Image
                src={cam}
                width={200}
                height={150}
                alt="Product Thumbnail 3"
                className="rounded-lg object-cover w-full aspect-[4/3]"
              />
            </div>
          </div>
          </div>
        <div className="flex-1 grid gap-6">
        <div>
          <h1 className="text-3xl font-bold">Acme Wireless Headphones</h1>
          <p className="text-2xl font-semibold text-primary">$99.99</p>
        </div>
        <p className="text-muted-foreground">
          Experience the ultimate in audio quality and comfort with our Acme Wireless Headphones. Crafted with premium
          materials and advanced noise-cancelling technology, these headphones deliver an immersive listening experience
          that will elevate your daily routine.
        </p>
        <div className="grid gap-4">
          <div>
            <h2 className="text-xl font-semibold">Product Details</h2>
            <ul className="grid gap-2 text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>Brand</span>
                <span>Acme</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Model</span>
                <span>AW-1000</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Connectivity</span>
                <span>Bluetooth 5.0</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Battery Life</span>
                <span>Up to 30 hours</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Noise Cancellation</span>
                <span>Advanced</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Condition</span>
                <span>New</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Seller Details</h2>
            <div className="grid gap-2 text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Feedback</span>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                  <span className="text-sm">(4.8)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Button size="lg">Buy Now</Button>
          <Button size="lg" variant="outline">
            <Bookmark className="w-4 h-4 mr-2" />
            Add to Bookmarks
          </Button>
        </div>
      </div>  
    </div>
      <Reviews />
    </div>
    
  )
}

function StarIcon(props) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}