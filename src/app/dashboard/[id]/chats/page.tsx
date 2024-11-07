"use client"

import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Home, MessageSquare, Package, Search, Settings, Users } from 'lucide-react'
import Navbar from '@/components/Hero/Navbar'
import { useParams, useRouter } from 'next/navigation'
import {dashboardLinks} from '@/lib/constants'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export default function ChatsPage() {
  // This would typically come from a database or API
  const chats = [
    { id: 1, user: "Alice Smith", avatar: "/avatars/alice.jpg", lastMessage: "Thank you for your order!", time: "2 mins ago" },
    { id: 2, user: "Bob Johnson", avatar: "/avatars/bob.jpg", lastMessage: "When will my package arrive?", time: "1 hour ago" },
    { id: 3, user: "Carol Williams", avatar: "/avatars/carol.jpg", lastMessage: "I'd like to return an item.", time: "1 day ago" },
    { id: 4, user: "David Brown", avatar: "/avatars/david.jpg", lastMessage: "Do you have this in blue?", time: "2 days ago" },
    { id: 5, user: "Eve Davis", avatar: "/avatars/eve.jpg", lastMessage: "Is this product still available?", time: "1 week ago" },
  ]
  const { id } = useParams()
  const navlinks = dashboardLinks(id)

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-16 bg-white shadow-sm hidden md:block">
          <nav className="flex flex-col items-center gap-4 py-4">
            <TooltipProvider>
              {navlinks.map((data, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={data.href}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground"
                      prefetch={false}
                    >
                      <data.icon className="h-5 w-5" />
                      <span className="sr-only">{data.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{data.title}</TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Chats</h1>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search chats..."
                  className="pl-8"
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Chats</CardTitle>
                <CardDescription>Click on a chat to view the full conversation.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chats.map((chat) => (
                    <Link key={chat.id} href={`/dashboard/chats/${chat.id}`} className="block">
                      <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <Avatar>
                          <AvatarImage src={chat.avatar} alt={chat.user} />
                          <AvatarFallback>{chat.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{chat.user}</p>
                          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                        </div>
                        <div className="text-xs text-gray-400">{chat.time}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}