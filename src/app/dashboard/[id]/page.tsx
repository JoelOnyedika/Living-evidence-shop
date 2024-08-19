"use client"

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { ArrowUp, ArrowDown, Menu, Bell, Package, Home, Package2, Power, Star, Settings, MessageCircle, X  } from 'lucide-react'
import Navbar from '@/components/Hero/Navbar'
import {dashboardLinks} from '@/lib/constants'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { checkKycStatus } from '@/lib/supabase/queries/kyc'
import { IPopupMessage } from '@/lib/types'
import DashSkeleton from '@/components/Dashboard/DashSkeleton'
import PopupMessage from '@/components/global/Popup'


export default function Dashboard() {
  const { id } = useParams()
  const navlinks = dashboardLinks(id)
  const router = useRouter()
  const [popup, setPopup] = useState<IPopupMessage>({ message: "", mode: null, show: false })
  const [kycStatus, setKycStatus] = useState(true)
  
  const checkKycStatus = async ()  => {
    try {
      const { data, error } = await checkKycStatus(id)
      if (error) {
        console.log(error)
        setPopup({ message: error.message, mode: 'error', show: true })
      }
      if (data) {
        setKycStatus(true)
      } else setKycStatus(false)
    } catch (error) {
      console.log(error)
      setPopup({ message: "Whoops something went wrong. Please refresh", mode: 'error', show: true })
    }
  }

  useEffect(() => {
    checkKycStatus()
  }, [])

  const showPopup = (message, mode) => {
    setPopup({ show: true, message, mode })
  }

  const hidePopup = () => {
    setPopup({ show: false, message: '', mode: '' })
  }
  return (
    <div className="flex flex-col">
      <Navbar />
      {popup.show && (
          <PopupMessage 
            message={popup.message} 
            mode={popup.mode} 
            onClose={hidePopup}
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
      { kycStatus === true ? (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
              <Link
                href="#"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                prefetch={false}
              >
                <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              { navlinks.map((data) => (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={data.href}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                    >
                      <data.icon className="h-5 w-5" />
                      <span className="sr-only">{data.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{data.title}</TooltipContent>
                </Tooltip>    
              )) }
            </TooltipProvider>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    prefetch={false}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="#"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    prefetch={false}
                  >
                    <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                  </Link>
                  { navlinks.map((data) => (
                      <Link
                        href={data.href}
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        prefetch={false}
                      >
                        <data.icon className="h-5 w-5" />
                        {data.title}
                      </Link>
                    )) }
                  
                  
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-4">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h1 className="text-lg font-semibold">Joel Onyedika</h1>
                <p className="text-sm text-muted-foreground">Seller</p>
              </div>
            </div>
            
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-0 rounded-none shadow-none">
                <CardHeader className="px-7">
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>An overview of your account activity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Total Sales</div>
                        <div className="text-2xl font-bold">$12,345</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowUp className="h-4 w-4 fill-green-500" />
                        <span>+15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Active Listings</div>
                        <div className="text-2xl font-bold">42</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowDown className="h-4 w-4 fill-red-500" />
                        <span>-3%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Pending Orders</div>
                        <div className="text-2xl font-bold">8</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowUp className="h-4 w-4 fill-green-500" />
                        <span>+2</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Positive Reviews</div>
                        <div className="text-2xl font-bold">89%</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowUp className="h-4 w-4 fill-green-500" />
                        <span>+5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 rounded-none shadow-none">
                <CardHeader className="px-7">
                  <CardTitle>My Listings</CardTitle>
                  <CardDescription>Manage the products you have listed for sale.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
        ) : kycStatus === null ? (<DashSkeleton/>) : router.push(`/sell/${id}`) }
      
    </div>
    
  )
}
