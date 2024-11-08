import { pgTable, uuid, text, timestamp, integer, date, reference, jsonb } from 'drizzle-orm/pg-core';

// Basic user profile schema
export const basicProfiles = pgTable('basic_profiles', {
  id: uuid('id').primaryKey().notNull(),
  username: text('username'),
  email: text('email').unique().notNull(),
  kycStatus: text('kyc_status').default("no"),  // Three modes --- no, pending, yes
  profileImg: text('profile_img').default("https://fyubkrzqjtcfybpusvuk.supabase.co/storage/v1/object/public/defaults/noImageProvided.png"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// Detailed user profile schema
export const detailedProfiles = pgTable('detailed_profiles', {
  id: uuid('id').primaryKey().notNull(),
  basicProfileId: uuid('basic_profile_id').references(() => basicProfiles.id),
  firstName: text('first_name'),
  lastName: text('last_name'), 
  email: text('email').unique().notNull(),
  phoneNumber: text('phone_number'),
  profilePhoto: text('profile_photo'),
  address: text('address'),
  nationality: text('nationality'),
  preferredContact: text('preferred_contact'),
  governmentId: text('government_id'),
  occupation: text('occupation'),
  income: integer('income'),
  assets: integer('assets'),
  liabilities: integer('liabilities'),
  dateOfBirth: date('date_of_birth'),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// Subscription plans schema
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().notNull(),
  name: text('name'),
  ///price: integer('price'),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// User subscriptions schema
export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').primaryKey().notNull(),
  basicProfileId: uuid('basic_profile_id').references(() => basicProfiles.id),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
  startDate: timestamp('start_date', { withTimezone: true, mode: "string" }).defaultNow(),
  endDate: timestamp('end_date', { withTimezone: true, mode: "string" }).defaultNow()
});

// Items for sale schema
export const items = pgTable('items', {
  id: uuid('id').primaryKey().notNull(),
  title: text('title'),
  description: text('description'),
  categoryId: uuid('category_id').references(() => categories.id),
  price: integer('price'),
  location: text('location'),
  sellerId: uuid('seller_id').references(() => basicProfiles.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// Categories schema
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().notNull(),
  name: text('name'),
  description: text('description')
});

// Services schema
export const services = pgTable('services', {
  id: uuid('id').primaryKey().notNull(),
  title: text('title'),
  description: text('description'),
  providerId: uuid('provider_id').references(() => basicProfiles.id),
  price: integer('price'),
  location: text('location'),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// Transactions schema
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().notNull(),
  itemId: uuid('item_id').references(() => items.id),
  buyerId: uuid('buyer_id').references(() => basicProfiles.id),
  amount: integer('amount'),
  transactionDate: timestamp('transaction_date', { withTimezone: true, mode: "string" }).defaultNow()
});


export const ecommerceProducts = pgTable('ecommerce_products', {
  id: uuid('id').primaryKey().notNull(),
  userId: uuid('user_id').notNull().references(() => basicProfiles.id, { onDelete: 'cascade' }),
  price: integer('price').notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  image: text('image').notNull(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  condition: text('condition'),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
}) 

export const realEstateListings = pgTable('real_estate_listings', {
  id: uuid('id').primaryKey().notNull(),
  userId: uuid('user_id').notNull().references(() => basicProfiles.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  location: text('location').notNull(),
  title: text('title', { length: 30 }).notNull(),
  propertyType: text('property_type').notNull(),
  type: text('type').notNull(),
  image: text('image').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
}) 

export const jobPostings = pgTable('job_postings', {
  id: uuid('id').primaryKey().notNull(),
  userId: uuid('user_id').notNull().references(() => basicProfiles.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  salary: integer('salary').notNull(),
  location: text('location').notNull(),
  title: text('title', { length: 30 }).notNull(),
  type: text('type').notNull(),
  jobType: text('job_type').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
})

// export const reviews = pgTable('reviews', {
//   id: uuid('id').primaryKey().notNull(),
//   userId: uuid('user_id').notNull().references(() => basicProfiles.id, { onDelete: 'cascade' }),
//   title: text('title').notNull(),
//   star: integer('star').notNull(),
//   reviewer: uuid('reviewer').references(() => basicProfiles.id).notNull(),
//   productType: text('product_type').notNull(),
//   createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
//     .defaultNow()
//     .notNull(),
// }) 
//// BUG IT HAS NO REFRENCE TO ANY PRODUCT AS THERE ARE THREEE PRODUCTS

// export const dashboard = pgTable('dashboard', {
//   id: uuid('id').primaryKey().notNull(),
//   userId: uuid('user_id').notNull().references(() => basicProfiles.id, { onDelete: 'cascade' }),
//   totalSales: integer('total_sales').default(0),
//   activeListings: integer('active_listings').default(0),
//   pendingOrders: integer('pending_orders').default(0),
//   review: uuid('review').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
//   createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
//     .defaultNow()
//     .notNull(),
// });

export const chat = pgTable('chat', {
  id: uuid('id').primaryKey().notNull(),
  buyerId: uuid('buyer_id').notNull().references(() => basicProfiles.id, { onDelete: 'cascade' }),
  sellerId: uuid('seller_id').notNull().references(() => basicProfiles.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull(),
  productType: text('product_type').notNull(),
  messages: jsonb('messages').notNull().default('[]'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});