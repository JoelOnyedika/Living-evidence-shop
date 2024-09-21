'use client'

import React, {useState}  from "react";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import { useRouter  } from 'next/navigation'
import { v4 as uuidV4 } from 'uuid'

const Ecommerce = ({ productData }: any) => {
  const router = useRouter()
  const chatId = uuidV4()
  console.log("productData", productData);

  const handleContactSeller = () => {
    localStorage.setItem('currentSellerId', productData.user_id);
    console.log(localStorage.getItem('currentSellerId'))
  
    router.push(`/buy/${productData.type}/${productData.id}/${chatId}/chat`)
  };

  const [isAddedToCart, setIsAddedToCart] = useState(false)
  
  const image = JSON.parse(productData.image);
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto px-4 py-8 lg:py-12">
      <div className="flex-1 grid gap-4">
        <div className="grid gap-4">
          <Image
            src={image[0]}
            width={800}
            height={500}
            alt="Product Image"
            className="rounded-lg object-cover w-full aspect-[16/9]"
          />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Image
                key={index}
                src={image[index % image.length]}
                width={200}
                height={150}
                alt={`Product Thumbnail ${index + 1}`}
                className="rounded-lg object-cover w-full aspect-[4/3]"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 grid gap-6">
        <div>
          <h1 className="text-3xl font-bold">{productData.title}</h1>
          <p className="text-2xl font-semibold text-primary">${productData.price}</p>
        </div>
        <p className="text-muted-foreground">
          {productData.description}
        </p>
        <div className="grid gap-4">
          <div>
            <h2 className="text-xl font-semibold">Product Details</h2>
            <ul className="grid gap-2 text-muted-foreground">
              <li className="flex items-center justify-between">
                <span>Brand</span>
                <span>{productData.brand}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Model</span>
                <span>{productData.model}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Condition</span>
                <span>{productData.condition}</span>
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
          <Button size="lg" onClick={() => handleContactSeller()} >Contact Seller</Button>          
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;

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
  );
}
