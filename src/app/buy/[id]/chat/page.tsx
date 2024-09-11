import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendIcon, PhoneIcon, VideoIcon } from "lucide-react"

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <Card className="flex flex-col h-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Buyer" />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>John Doe (Buyer)</CardTitle>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="icon" variant="ghost">
              <PhoneIcon className="h-5 w-5" />
              <span className="sr-only">Call</span>
            </Button>
            <Button size="icon" variant="ghost">
              <VideoIcon className="h-5 w-5" />
              <span className="sr-only">Video call</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              <div className="flex items-end">
                <Avatar className="mr-2">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Customer" />
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
                <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                  <p>Hello! How can I assist you today?</p>
                </div>
              </div>
              <div className="flex items-end justify-end">
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3 max-w-[80%]">
                  <p>Hi! I'm interested in your product. Can you tell me more about its features?</p>
                </div>
                <Avatar className="ml-2">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Buyer" />
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-end">
                <Avatar className="mr-2">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Customer" />
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
                <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                  <p>Of course! Our product has several key features including...</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form className="flex w-full items-center space-x-2">
            <Input type="text" placeholder="Type your message..." className="flex-grow" />
            <Button type="submit" size="icon">
              <SendIcon className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}