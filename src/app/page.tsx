'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getInitialListings, searchListings } from '@/lib/supabase/queries/landing';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Hero/Navbar';
import { Home as HomeIcon, MapPin, Search, ListOrdered, ArrowRight } from 'lucide-react';
import { searchBarLocationDropdownItem, navbarLinks } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/global/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [listingType, setListingType] = useState('all');
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false)
  // const targetRef = useRef(null)

  useEffect(() => {
    const fetchListings = async () => {
      let result;
      if (searchTerm) {
        result = await searchListings(searchTerm, listingType);
      } else {
        result = await getInitialListings();
      }

      if (result.error) {
        console.error('Error fetching listings:', result.error);
        setError('Error loading listings. Please try again later.');
      } else {
        result.data.forEach((obj) => {
          // Check if `obj.image` is a string and try parsing it only if necessary
          if (typeof obj.image === 'string') {
            try {
              obj.image = JSON.parse(obj.image);
            } catch (e) {
              console.error('Error parsing image JSON:', e);
            }
          }
        });
        setListings(result.data);
        console.log(result.data);
      }
    };

    fetchListings();
  }, [searchTerm, listingType]);

//   useEffect(() => {
//   const observer = new IntersectionObserver(
//     ([entry]) => {
//       setIsVisible(entry.isIntersecting);
//       if (entry.isIntersecting) {
//         console.log("The third-to-last item is in view!");
//       } else {
//         console.log("The third-to-last item is out of view.");
//       }
//     },
//     {
//       root: null,
//       rootMargin: '0px',
//       threshold: 0.1, // 10% of the element is visible
//     }
//   );

//   if (targetRef.current) {
//     console.log('Observing the third-to-last item');
//     observer.observe(targetRef.current);
//   }

//   return () => {
//     if (targetRef.current) {
//       console.log('Stopped observing the third-to-last item');
//       observer.unobserve(targetRef.current);
//     }
//   };
// }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSearchTerm = formData.get('q');
    const newListingType = formData.get('type');

    setSearchTerm(newSearchTerm);
    setListingType(newListingType);
    router.push(`/?q=${newSearchTerm}&type=${newListingType}`, undefined, { shallow: true });
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="relative h-[80vh] bg-[url('../components/images/camera.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Find Your Dream Property, Product, or Job</h1>
            <p className="text-lg mb-8">Explore our diverse listings</p>
            <form className="shadow-lg p-6 w-full max-w-3xl flex items-center gap-2" onSubmit={handleSearch}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-[#007BFF] text-white rounded-md px-4 py-2 mr-4">
                    <MapPin className="size-5 mr-2" />
                    Location
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {searchBarLocationDropdownItem.map((data) => (
                    <DropdownMenuItem key={data.id}>{data.location}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Select name="type" defaultValue={listingType}>
                <SelectTrigger>
                  <SelectValue placeholder="Listing Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Listings</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="realEstate">Real Estate</SelectItem>
                  <SelectItem value="jobPosting">Jobs</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                name="q"
                placeholder="Search..."
                defaultValue={searchTerm}
                className="flex-grow"
              />
              <Button type="submit" className="bg-[#28a745] text-white rounded-md px-4 py-2">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </section>
        <section className="py-12 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'Featured Listings'}
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ListOrdered className="mr-2" />
                    Sort by: Newest
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup>
                    <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-asc">Price: Low to High</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-desc">Price: High to Low</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {listings.length === 0 ? (
                <LoadingSpinner />
              ) : (
                  listings.slice(0, 20).map((item, idx) => {
                    const isThirdToLast = idx === listings.length - 3;
                    return (
                      <Card key={idx} >
                        {item.image && item.image.length > 0 ? (
                          <Image
                            src={item.image[0]}
                            alt={item.title}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        ) : <Image
                            src={"https://fyubkrzqjtcfybpusvuk.supabase.co/storage/v1/object/public/defaults/noImageProvided.png?t=2024-11-03T22%3A37%3A09.135Z"}
                            alt={item.title}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />}

                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground mb-4">{item.description.substring(0, 100)}...</p>
                          <div className="flex items-center justify-between">
                            <span className="text-primary font-semibold">
                              {item.price ? `$${item.price}` : item.salary ? `$${item.salary}/yr` : 'N/A'}
                            </span>
                            <Link href={`/buy/${item.type}/${item.id}`} className="inline-flex items-center text-primary hover:text-primary-foreground">
                              <span>View Details</span>
                              <ArrowRight className="ml-2" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  } 
                )
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted text-muted-foreground py-6 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HomeIcon className="h-6 w-6" />
            <span className="text-lg font-bold">Multi Listing Platform</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {navbarLinks.map((data) => (
              <Link key={data.id} href={data.href} className="hover:underline underline-offset-4">
                {data.title}
              </Link>
            ))}
          </nav>
          <p className="text-sm">&copy; 2024 Multi Listing Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
