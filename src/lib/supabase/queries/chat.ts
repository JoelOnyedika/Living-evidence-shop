// app/actions/chatActions.ts
'use server'

import {createClient} from '@/lib/supabase'
import {v4 as uuidV4} from 'uuid'

export async function fetchMessages(chatId: string) {
    const supabase = await createClient()
    const randId = uuidV4()
  const { data, error } = await supabase
    .from('chat')
    .select('messages')
    .eq('id', chatId)
    .single();

  if (error) {
    return { data: null, error: { message: error.message } }
  };
  return {data, error}
}

export async function addMessage(chatId: string, content: string, sender: string) {
    const supabase = await createClient()
    const randId = uuidV4()
  const newMessage = {
    id: randId,
    content,
    sender,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('chat')
    .update({ 
      messages: supabase.sql`array_append(messages, ${newMessage}::jsonb)`,
      updated_at: new Date().toISOString()
    })
    .eq('id', chatId)
    .select('messages')
    .single();

  if (error) {
    return { data: null, error: { message: error.message } }
  };
  return {data, error};
}

export async function createChat(userId: string, productId: string, productType: string, initialMessage: string) {
    const supabase = await createClient()
    const randId = uuidV4()
  const newChat = {
    id: randId,
    userId,
    productId,
    productType,
    messages: [{
      id: randId,
      content: initialMessage,
      sender: 'user',
      created_at: new Date().toISOString()
    }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('chat')
    .insert(newChat)
    .select()
    .single();

  if (error) {
    return { data: null, error: { message: error.message } }
  };
  return {data, error};
}