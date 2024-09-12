// app/actions/chatActions.ts
'use server'

import {createClient} from '@/lib/supabase'
import {v4 as uuidV4} from 'uuid'

export async function fetchMessages(productId: string) {
    const supabase = await createClient()
    const randId = uuidV4()
  const { data, error } = await supabase
    .from('chat')
    .select('messages')
    .eq('product_id', productId)
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

export async function fetchOrCreateChat(sellerId: string, buyerId: string, productId: string, productType: string) {
  // First, try to fetch an existing chat
  const supabase = await createClient()
  let { data: existingChat, error: fetchError } = await supabase
    .from('chat')
    .select('*')
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .eq('product_id', productId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 is the error code for "no rows returned"
    return {data: null, error: {message: `Error creating chat: ${createError.message}`}};
  }

  if (existingChat) {
    return {data: existingChat, error: null};
  }

  // If no existing chat, create a new one
  const randUUID = uuidV4()

  const { data: createdChat, error: createError } = await supabase
    .from('chat')
    .insert({ id: randUUID, buyer_id: buyerId, product_id: productId, product_type: productType, messages: [], seller_id: sellerId })
    .select()
    .single();

  if (createError) {
    return {data: null, error: {message: `Error creating chat: ${createError.message}`}};
  }

  return { data: createdChat, error: null }
}