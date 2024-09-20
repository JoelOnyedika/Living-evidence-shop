"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {Home as HomeIcon, User, MessageCircle, Bell, Star, Package} from 'lucide-react'
import { getCookie } from '@/lib/server-actions/auth-actions'
import { navbarLinks } from '@/lib/constants'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Home } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"


const Navbar = () => {
  const [cookie, setCookie] = useState(null)
  const router = useRouter()

  const getUserCookie = async () => {
    try {
      const getCookies = await getCookie('userCookie')
      const userCookie = JSON.parse(getCookies.value)

      console.log(userCookie)
      if (userCookie) setCookie(userCookie)
    } catch (error) {
      console.log(error)
    }
    
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
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <HomeIcon className="h-6 w-6" />
        <span className="text-lg font-bold">Realty</span>
      </Link>
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
      <div className="flex items-center gap-4">
        {cookie === null ? (
          <>
            <Link href="/login" className="hover:underline underline-offset-4" prefetch={false}>
              Login
            </Link>
            <Link href="/signup" className="hover:underline underline-offset-4" prefetch={false}>
              Register
            </Link>
          </>
        ) : (
          <div className="ml-auto flex items-center gap-2">
            <div >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                    <Bell className="h-4 w-4 text-black" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <div>
                        <div className="font-medium">New Order</div>
                        <div className="text-xs text-muted-foreground">You have a new order from a customer.</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <div>
                        <div className="font-medium">New Review</div>
                        <div className="text-xs text-muted-foreground">
                          A customer has left a new review for your product.
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <div>
                        <div className="font-medium">New Message</div>
                        <div className="text-xs text-muted-foreground">You have a new message from a customer.</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Sheet>
            <SheetTrigger>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="text-black">
                JO
                </AvatarFallback>
              </Avatar>  
            </SheetTrigger>
            <SheetContent>
              <nav className="items-left gap-6 flex flex-col">
                {navbarLinks.map((data, index) => (
                  (data.isDynamic && !cookie) ? null : (
                    <div className="flex gap-3" key={index}>
                      <data.icon />
                      <span
                      key={data.id}
                      className="hover:underline font-semibold underline-offset-4 cursor-pointer"
                      onClick={() => handleNavigation(data.href, data.isDynamic)}
                      >
                        {data.title}
                      </span>
                    </div>
                  )
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar