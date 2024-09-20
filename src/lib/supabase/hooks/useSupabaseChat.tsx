'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from "@supabase/ssr"

let supabase

const createClientSideClient = () => {
  if (supabase) return supabase

  supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabase
}

export function useSupabaseChat(chatId: string) {
  const [messages, setMessages] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSideClient()

  const parseMessages = (data: any) => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.error('Failed to parse messages string:', e)
        return []
      }
    }
    return []
  }

  useEffect(() => {
    if (!chatId) {
      console.log('No chat ID provided')
      return
    }

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'chat', filter: `id=eq.${chatId}` }, 
        (payload) => {
          console.log('Received update:', payload)
          if (payload.new) {
            const parsedMessages = parseMessages(payload.new.messages)
            setMessages(parsedMessages)
          } else {
            console.error('Unexpected payload structure:', payload)
          }
        }
      )
      .subscribe()

    fetchMessages(chatId)

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  const fetchMessages = async (chatId: string) => {
    try {
      console.log('Fetching messages for chat ID:', chatId)
      const { data, error } = await supabase
        .from('chat')
        .select('messages')
        .eq('id', chatId)
        .single()

      if (error) {
        console.error('Error fetching messages:', error)
        setError(`Error fetching messages: ${error.message}`)
        return
      }

      console.log('Fetched data:', data)

      if (data) {
        const parsedMessages = parseMessages(data.messages)
        setMessages(parsedMessages)
        if (parsedMessages.length === 0) {
          console.log('No messages found or empty message list')
        }
      } else {
        console.error('No data returned from query')
        setError('No data returned from query')
      }
    } catch (err) {
      console.error('Unexpected error in fetchMessages:', err)
      setError(`Unexpected error: ${err.message}`)
    }
  }

  return { messages, error }
}