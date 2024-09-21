"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, Loader2 } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Hero/Navbar";
import Reviews from "@/components/Hero/Reviews";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductsDataById } from "@/lib/supabase/queries/products";
import { IPopupMessage } from "@/lib/types";
import Ecommerce from "@/components/Buy/Ecommerce";
import PopupMessage from "@/components/global/Popup";
import RealEstate from "@/components/Buy/RealEstate";
import Loader from "@/components/global/loader";

export default function Buy() {
  const [popup, setPopup] = useState<IPopupMessage>({
    message: "",
    mode: null,
    show: false,
  });
  const [productData, setProductData] = useState(null);
  const params = useParams();
  
  // Fetch product data function
  const fetchProductsData = async (id, type) => {
    console.log(id, type)
    const { data, error }: any = await getProductsDataById(id, type);
    if (error) {
      console.log(error);
      setPopup({ show: true, message: error.message, mode: "error" });
      return;
    }
    console.log("Fetched data:", data);
    setProductData(data);
  };
  
  // Hide popup function
  const hidePopup = () => {
    setPopup({ show: false, message: "", mode: "" });
  };
  
  // Fetch data when component mounts or params change
  useEffect(() => {
    console.log("Params changed:", params.type);
    fetchProductsData(params.id, params.type);
  }, [params.id, params.type]);
  
  // Log productData when it changes
  useEffect(() => {
    if (productData) {
      console.log("Product data updated:", productData);
    }
  }, [productData]);
  

  return (
    <div className="flex flex-col">
      <Navbar />
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
      {productData === null ? (
       <div className="flex justify-center items-center h-full w-full">
       <div className="transform scale-150">
         <Loader />
       </div>
     </div>
      ) : productData.map((data, index) => (
        data.type === "ecommerce" ? (
          <Ecommerce productData={data} key={index} />
        ) : data.type === "realEstate" ? (
          <RealEstate data={data} />
        ) : data.type === "jobPosting" ? (
          "jobPosting"
        ) : null
      ))
      }

      {/* I MIGHT INTRODUCE REVIEWS LOGIC IF I AM EVER TOLD TO DO SO */}
      {/* <Reviews /> */}
    </div>
  );
}