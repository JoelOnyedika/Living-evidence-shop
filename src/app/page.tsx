"use client"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from '@/components/Hero/Navbar'
import { Home as HomeIcon, User } from 'lucide-react'
import { searchBarLocationDropdownItem } from '@/lib/constants'
import {MapPin, Search} from 'lucide-react'
import { homepageDetails } from '@/lib/constants'
import {useState, useMemo, useEffect} from 'react'
import { ListOrdered, ArrowRight } from 'lucide-react'
import { getCookie } from '@/lib/server-actions/auth-actions'
import { navbarLinks } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import cam from '@/components/images/camera.png'


export default function Home() { 
  const [searchTerm, setSearchTerm] = useState("")
  const [searchLocation, setSearchLocation] = useState(null)
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [category, setCategory] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [currentPage, setCurrentPage] = useState(1)
  const [results, setResults] = useState(homepageDetails)
  const filteredResults = useMemo(() => {
    let filtered = results
    if (searchTerm) {
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (location) {
    }
    if (priceRange) {
      filtered = filtered.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1])
    }
    if (category) {
    }
    switch (sortBy) {
      case "price-asc":
        filtered = filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered = filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        filtered = filtered.sort((a, b) => b.id - a.id)
        break
      default:
        break
    }
    return filtered
  }, [searchTerm, location, priceRange, category, sortBy, results])
  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageResults = filteredResults.slice(startIndex, endIndex)

  const [cookie, setCookie] = useState(null)
  const router = useRouter()

  const getUserCookie = async () => {
    const userCookie = await getCookie('userCookie')
    console.log(userCookie)
    if (userCookie) setCookie(userCookie)
  }

  useEffect(() => {
    getUserCookie()
  }, [])

  const handleNavigation = (href, isDynamic) => {
    if (isDynamic) {
      if (cookie) {
        // Assume the cookie contains the user ID or a way to get it
        const userId = cookie.id
        router.push(`${href}/${userId}`)
      } else {
        // If no user is logged in, redirect to login or show a message
        router.push('/login')
      }
    } else {
      router.push(href)
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1">
        <section className="relative h-[80vh] bg-[url('../components/images/camera.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Find Your Dream Property</h1>
            <p className="text-lg mb-8">Buy and Sell Real Estate with Ease</p>
            <form className="shadow-lg p-6 w-full max-w-3xl flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-[#007BFF] text-white rounded-md px-4 py-2 mr-4">
                    <MapPin className="size-5 mr-2" />
                    {searchLocation === null ? "Location" : searchLocation}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {searchBarLocationDropdownItem.map((data) => (
                      <DropdownMenuItem key={data.id} onClick={() => setSearchLocation(data.location)}>{data.location}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Select id="property-type">
                <SelectTrigger>
                  <SelectValue className={"text-black"} placeholder="Property Type" value={"House"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-[#28a745] text-white rounded-md px-4 py-2">
        <Search className="w-5 h-5 mr-2" />
        Search
      </Button>
            </form>
          </div>
        </section>
        <section className="py-12 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
              </div>

              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListOrdered className="mr-2" />
                  Sort by:{" "}
                  {sortBy === "relevance"
                    ? "Relevance"
                    : sortBy === "price-asc"
                    ? "Price: Low to High"
                    : sortBy === "price-desc"
                    ? "Price: High to Low"
                    : "Newest"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value)}>
                  <DropdownMenuRadioItem value="relevance">Relevance</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-asc">Price: Low to High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-desc">Price: High to Low</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {currentPageResults.map((item) => (
            <Card key={item.id}>
              <Image
                src={cam}
                alt={item.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">${item.price}</span>
                  <Link
                    href="/buy/1234"
                    className="inline-flex items-center text-primary hover:text-primary-foreground"
                    prefetch={false}
                  >
                    <span>View Details</span>
                    <ArrowRight className="ml-2" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted text-muted-foreground py-6 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HomeIcon className="h-6 w-6" />
            <span className="text-lg font-bold">Realty</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {navbarLinks.map((data) => (
              (data.isDynamic && !cookie) ? null : (
                <span
                  key={data.id}
                  className="hover:underline underline-offset-4 cursor-pointer"
                  onClick={() => handleNavigation(data.href, data.isDynamic)}
                >
                  {data.title}
                </span>
              )
            ))}
          </nav>
          <p className="text-sm">&copy; 2024 Realty. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

