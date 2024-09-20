'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendIcon, PhoneIcon, VideoIcon, Image, Video, Send } from "lucide-react"
import { fetchMessages, sendMessage, createChat, subscribeToChat } from '@/lib/supabase/queries/chat'
import { useParams } from 'next/navigation'
import { getUserDataById } from '@/lib/supabase/queries/auth';
import { getCookie } from '@/lib/server-actions/auth-actions';
import { fetchOrCreateChat } from '@/lib/supabase/queries/chat';
import Navbar from '@/components/Hero/Navbar';
import PopupMessage from '@/components/global/Popup';
import { IPopupMessage } from '@/lib/types';
import { useRouter } from 'next/navigation'
import { useSupabaseChat } from '@/lib/supabase/hooks/useSupabaseChat';


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
  // const [newMessage, setNewMessage] = useState('') 
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [buyerId, setBuyerId] = useState(null);
  const [cookie, setCookie] = useState(null)
  const { type, id, chatId } = useParams()
  const router = useRouter()

  const [popup, setPopup] = useState<IPopupMessage>({
    message: "",
    mode: null,
    show: false,
  });

  const {messages: msg, error} = useSupabaseChat(chatId)


  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (msg) {
      setMessages(msg);
      console.log('Messages updated:', msg);
      scrollToBottom()
      // Perform any additional actions you need when messages update
    }
  }, [msg]);
  

  useEffect(() => {
    async function setupChat() {
      try {
        const cookieData = await getCookie('userCookie');
        if (!cookieData) {
          console.error('No user cookie found');
          setPopup({ message: 'User not authenticated', mode: 'error', show: true });
          router.push('/login')
          return;
        }
        const userCookie = JSON.parse(cookieData.value);
        setCookie(userCookie)
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

        const { data: chatData, error: chatError } = await fetchOrCreateChat(sellerId, userCookie.id, id, type, chatId);
        if (chatError) {
          console.error('Error fetching or creating chat:', chatError);
          setPopup({ message: chatError.message, mode: 'error', show: true });
          return;
        }

        if (chatData.redirect) {
          router.push(`/buy/${chatData.type}/${chatData.id}`);
          return;
        }

        setChat(chatData);
        setIsLoading(false);

        const { messages, error: messagesError } = await fetchMessages(chatData.id);
        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          setPopup({ message: messagesError.message, mode: 'error', show: true });
        } else {
          setMessages(messages || []);
        }

        console.log(messages)
      } catch (error) {
        console.error('Error in setupChat:', error);
        setPopup({ message: 'Error setting up chat', mode: 'error', show: true });
      }
    }
    
    setupChat();


  }, [id, type, router]);

  const handleSendMessage = async (e) => {
    console.log(inputMessage)
    e.preventDefault()
    if (!inputMessage.trim()) return
    const isViolation = containsContactInfo(inputMessage)
    console.log('violation', isViolation)
    if (isViolation) {
      setMessages([...messages, {
        id: Date.now(),
        sender: 'insight',
        content: "You are violating our rule. Please do not share any contact info, whatsoever",
        timestamp: new Date().toISOString()
      }]);
      setInputMessage('')
      return;
    }

    try {
      const { success, error } = await sendMessage(chatId, cookie.id, inputMessage);
      console.log(success, error)
      if (error) setPopup({ message: error.message, mode: 'error', show: true });
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setPopup({ message: error.message, mode: 'error', show: true });
    }
  }


  const hidePopup = () => {
    setPopup({ show: false, message: "", mode: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
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
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Buyer" />
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">John Doe (Buyer)</h2>
                  <p className="text-sm opacity-75">Online</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[60vh] p-4">
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
                        <Avatar className={`${message.sender === 'user' ? 'order-1 ml-2' : 'mr-2'}`}>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={message.sender} />
                          <AvatarFallback>{message.sender[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className={`${message.sender === 'user' ? 'order-2' : ''} max-w-[80%] ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg p-3 shadow`}>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    )
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">No messages yet. Start a conversation!</p>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          <CardFooter className="bg-gray-100 rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-grow"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <div className="flex space-x-2">
                <Button type="button" size="icon" variant="outline" onClick={() => handleAttachmentClick('image')}>
                  <Image className="h-5 w-5" />
                  <span className="sr-only">Attach Image</span>
                </Button>
                <Button type="button" size="icon" variant="outline" onClick={() => handleAttachmentClick('video')}>
                  <Video className="h-5 w-5" />
                  <span className="sr-only">Attach Video</span>
                </Button>
                <Button type="submit" size="icon" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={(e) => handleSendMessage(e)}>
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}