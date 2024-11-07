'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Users, MessageSquare, ShoppingBag, Search, Trash, Edit, Send } from 'lucide-react'

// Mock data
const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', posts: 5 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', posts: 3 },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', posts: 7 },
]

const mockPosts = [
  { id: 1, userId: 1, title: 'New Summer Collection', content: 'Check out our latest summer styles!' },
  { id: 2, userId: 2, title: 'Flash Sale Alert', content: '24-hour sale on all electronics!' },
  { id: 3, userId: 3, title: 'Customer Appreciation Day', content: 'Special discounts for our loyal customers.' },
]

const mockMessages = [
  { id: 1, userId: 1, content: 'Hello, I have a question about my order.' },
  { id: 2, userId: 2, content: 'When will the new products be in stock?' },
  { id: 3, userId: 3, content: 'Thank you for the great service!' },
]

export default function AdminDashboard() {
  const [users, setUsers] = useState(mockUsers)
  const [posts, setPosts] = useState(mockPosts)
  const [messages, setMessages] = useState(mockMessages)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId))
    setPosts(posts.filter(post => post.userId !== userId))
    setMessages(messages.filter(message => message.userId !== userId))
  }

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  const handleSendMessage = () => {
    if (selectedUser && newMessage.trim()) {
      const newMsg = { id: messages.length + 1, userId: selectedUser.id, content: newMessage.trim() }
      setMessages([...messages, newMsg])
      setNewMessage('')
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <nav>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Products
            </Button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search users, messages, or posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage your e-commerce users here.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Posts</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.posts}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>View and respond to user messages.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {filteredMessages.map(message => {
                    const user = users.find(u => u.id === message.userId)
                    return (
                      <div key={message.id} className="flex items-start space-x-4 mb-4">
                        <Avatar>
                          <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user?.name}</p>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    )
                  })}
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Posts</CardTitle>
                <CardDescription>Manage user posts and content.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map(post => {
                      const user = users.find(u => u.id === post.userId)
                      return (
                        <TableRow key={post.id}>
                          <TableCell>{post.title}</TableCell>
                          <TableCell>{post.content}</TableCell>
                          <TableCell>{user?.name}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Post</DialogTitle>
                                  <DialogDescription>Make changes to the post here.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Title</Label>
                                    <Input id="title" value={post.title} className="col-span-3" />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="content" className="text-right">Content</Label>
                                    <Input id="content" value={post.content} className="col-span-3" />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit">Save changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}