'use server'

import { createClient } from '@/lib/supabase'
import { v4 as uuidV4 } from 'uuid'
import { getCookie } from '@/lib/server-actions/auth-actions'

export async function fetchOrCreateChat(sellerId, buyerId, productId, productType, chatId) {
  const supabase = await createClient()

  if (sellerId == null || buyerId == null) {
    console.log('Seller ID or buyer id is null or undefined, redirecting');
    return {
      data: {
        redirect: true,
        type: productType,
        id: productId
      },
      error: null
    };
  }

  let { data: existingChat, error: fetchError } = await supabase
    .from('chat')
    .select('*')
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .eq('product_id', productId)
    .eq('id', chatId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.log('Error fetching chat:', fetchError)
    return { data: null, error: { message: `Error fetching chat: ${fetchError.message}` } };
  }

  if (existingChat) {
    return { data: existingChat, error: null };
  }

  const { data: createdChat, error: createError } = await supabase
    .from('chat')
    .insert({ id: chatId, buyer_id: buyerId, product_id: productId, product_type: productType, messages: [], seller_id: sellerId })
    .select()
    .single();

  if (createError) {
    console.log('Error creating chat:', createError)
    return { data: null, error: { message: `Error creating chat: ${createError.message}` } };
  }

  return { data: createdChat, error: null }
}

export async function sendMessage(chatId, senderId, content) {
  const supabase = await createClient()
  console.log(senderId)

  const { data, error } = await supabase
    .from('chat')
    .select('messages')
    .eq('id', chatId)
    .single()

  if (error) {
    console.error('Error fetching chat:', error)
    return { error: 'Failed to send message' }
  }

  console.log(data)

  const updatedMessages = [
    ...data.messages,
    { id: Date.now(), sender: senderId, content, timestamp: new Date().toISOString() }
  ]

  const { error: updateError } = await supabase
    .from('chat')
    .update({ messages: updatedMessages, updated_at: new Date().toISOString() })
    .eq('id', chatId)

  if (updateError) {
    console.error('Error updating chat:', updateError)
    return { error: 'Failed to send message' }
  }

  return { success: true, message: 'Message sent successfully' }
}


export async function fetchMessages(chatId) {
  const supabase = await createClient();

  // Fetch messages
  const { data: chatData, error: chatError } = await supabase
    .from('chat')
    .select('messages, buyer_id, seller_id')
    .eq('id', chatId)
    .single();

  if (chatError) {
    console.error('Error fetching messages:', chatError);
    return { error: { message: 'Failed to fetch messages' } };
  }

  const { messages, buyer_id, seller_id } = chatData;

  // Fetch user profiles
  const { data: usersData, error: usersError } = await supabase
    .from('detailed_profiles')
    .select('basic_profile_id, profile_photo')
    .in('basic_profile_id', [buyer_id, seller_id]);

  if (usersError) {
    console.error('Error fetching user profiles:', usersError);
    return { error: { message: 'Failed to fetch user profiles' } };
  }

  if (usersData.length < 2) {
    return { error: { message: 'Please log in, or do your KYC' } };
  }

  // Create a map of user IDs to profile pictures
  const userProfilePictures = Object.fromEntries(
    usersData.map(user => [user.basic_profile_id, user.profile_photo || ''])
  );

  // Add profile pictures to messages
  const messagesWithProfilePictures = messages.map(message => ({
    ...message,
    profile_picture: userProfilePictures[message.sender] || ''
  }));

  return { messages: messagesWithProfilePictures };
}


export async function subscribeToChat(chatId) {
  const supabase = await createClient()
  
  return supabase
    .channel(`chat:${chatId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat', filter: `id=eq.${chatId}` }, (payload) => {
      return payload.new.messages
    })
    .subscribe()
}


import { pgTable, update, sql } from 'drizzle-orm'; // Adapt based on your ORM setup

// Function to add a message and mark previous as read if it's a reply
async function addMessageToChat(chatId, senderId, content) {
  // Retrieve the current chat with messages
  const chat = await pgTable('chat').select('*').where({ id: chatId }).first();

  if (!chat) {
    throw new Error('Chat not found');
  }

  // Parse the current messages
  const messages = chat.messages || [];

  // Mark the previous message as read, if there is one
  if (messages.length > 0) {
    messages[messages.length - 1].is_read = true;
  }

  // Add the new message as unread
  const newMessage = {
    id: uuidv4(),       // Unique ID for the message
    sender: senderId,   // ID of the sender
    content: content,   // Message content
    timestamp: new Date().toISOString(),
    is_read: false      // New messages are unread by default
  };
  
  messages.push(newMessage);

  // Update the chat's messages field in the database
  await pgTable('chat')
    .update({ messages: JSON.stringify(messages) })
    .where({ id: chatId });
}
