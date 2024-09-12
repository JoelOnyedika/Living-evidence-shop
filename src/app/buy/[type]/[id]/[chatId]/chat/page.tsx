'use client'

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendIcon, PhoneIcon, VideoIcon } from "lucide-react"
import { fetchMessages, addMessage, createChat } from '@/lib/supabase/queries/chat'
import { useParams } from 'next/navigation'
import { getUserDataById } from '@/lib/supabase/queries/auth';
import { getCookie } from '@/lib/server-actions/auth-actions';
import { fetchOrCreateChat } from '@/lib/supabase/queries/chat';
import Navbar from '@/components/Hero/Navbar';
import PopupMessage from '@/components/global/Popup';
import { IPopupMessage } from '@/lib/types';
import { useRouter } from 'next/navigation'

const CONTACT_INFO_REGEX = /(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b|\b(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|twitter|instagram|linkedin)\.com\/[A-Za-z0-9_.-]+\b/g;

function filterMessage(message) {
  return message.replace(CONTACT_INFO_REGEX, '[REDACTED]');
}

function containsContactInfo(message) {
  return CONTACT_INFO_REGEX.test(message);
}

function InsightBot({ message }) {
  return (
    <div className="flex items-end">
      <div className="bg-yellow-100 text-yellow-800 rounded-lg p-3 max-w-[80%]">
        <p className="font-bold">Insight Bot:</p>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [buyerId, setBuyerId] = useState(null);
  const { type, id, chatId } = useParams()
  const router = useRouter()

  const [popup, setPopup] = useState<IPopupMessage>({
    message: "",
    mode: null,
    show: false,
  });
  
  async function initializeChat(sellerId: string, buyerId: string, id: string, type: string) {
    try {
      setIsLoading(true);
      console.log('Initializing chat with:', { sellerId, buyerId, id, type });
      const { data, error } = await fetchOrCreateChat(sellerId, buyerId, id, type);
      if (data && data.redirect) {
        console.log('Redirecting to:', `/buy/${data.type}/${data.id}`);
        router.push(`/buy/${data.type}/${data.id}`);
        return;
      }
      if (error) {
        console.error('Error in fetchOrCreateChat:', error);
        setPopup({ message: error.message, mode: 'error', show: true });
        return;
      }
      setChat(data);
      setMessages(data.messages || []); // Ensure messages is always an array
    } catch (error) {
      console.error('Error initializing chat:', error);
      setPopup({ message: 'Error initializing chat interface.', mode: 'error', show: true });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function setupChat() {
      try {
        const cookieData = await getCookie('userCookie');
        if (!cookieData) {
          console.error('No user cookie found');
          setPopup({ message: 'User not authenticated', mode: 'error', show: true });
          rotuer.push('/login')
          return;
        }
        const userCookie = JSON.parse(cookieData.value);
        console.log('User cookie:', userCookie);
        
        if (!userCookie || !userCookie.id) {
          console.error('Invalid user data in cookie');
          setPopup({ message: 'Invalid user data', mode: 'error', show: true });
          return;
        }
        
        setBuyerId(userCookie.id);
        const sellerId = localStorage.getItem('currentSellerId');
        console.log('Seller ID from localStorage:', sellerId);

        if (!sellerId) {
          console.error('No seller ID found in localStorage');
          setPopup({ message: 'Seller information missing', mode: 'error', show: true });
          router.push(`/buy/${type}/${id}`)
          return;
        }

        await initializeChat(sellerId, userCookie.id, id, type);
      } catch (error) {
        console.error('Error in setupChat:', error);
        setPopup({ message: 'Error setting up chat', mode: 'error', show: true });
      }
    }

    setupChat();
  }, [id, type]);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const filteredMessage = filterMessage(inputMessage);

    try {
      let newMessage = await addMessage(chatId, filteredMessage, 'user');
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputMessage('');

      if (containsContactInfo(inputMessage)) {
        const insightMessage = await addMessage(
          chatId,
          "Please do not share contact information in the chat.",
          'insight'
        );
        setMessages(prevMessages => [...prevMessages, insightMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  const hidePopup = () => {
    setPopup({ show: false, message: "", mode: "" });
  };

  return (
    <>
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
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading messages...</p>
                  </div>
                ) : messages && messages.length > 0 ? (
                  messages.map((message) => (
                    message.sender === 'insight' ? (
                      <InsightBot key={message.id} message={message.content} />
                    ) : (
                      <div key={message.id} className={`flex items-end ${message.sender === 'user' ? 'justify-end' : ''}`}>
                        <Avatar className={message.sender === 'user' ? 'ml-2' : 'mr-2'}>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={message.sender} />
                          <AvatarFallback>{message.sender[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className={`${message.sender === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'} rounded-lg p-3 max-w-[80%]`}>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    )
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-grow"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <Button type="submit" size="icon">
                <SendIcon className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}