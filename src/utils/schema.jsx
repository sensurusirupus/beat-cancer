import { sql } from "drizzle-orm";
import { integer, varchar, pgTable, serial, text, decimal, timestamp } from "drizzle-orm/pg-core";

// users schema
export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username"),
  age: integer("age"),
  location: varchar("location"),
  folders: text("folders")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  treatmentCounts: integer("treatment_counts").notNull().default(0),
  folder: text("folder")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  createdBy: varchar("created_by").notNull(),
});

// records schema
export const Records = pgTable("records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => Users.id)
    .notNull(),
  recordName: varchar("record_name").notNull(),
  analysisResult: varchar("analysis_result").notNull(),
  kanbanRecords: varchar("kanban_records").notNull(),
  createdBy: varchar("created_by").notNull(),
});

// Health Professionals schema
export const HealthProfessionals = pgTable("health_professionals", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  specialization: varchar("specialization").notNull(),
  pictureUrl: varchar("picture_url"),
  qualifications: text("qualifications").array().default(sql`ARRAY[]::text[]`),
  yearsOfExperience: integer("years_of_experience"),
  contactEmail: varchar("contact_email").notNull(),
  contactPhone: varchar("contact_phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ethAddress: varchar("eth_address"),
});

// Subscriptions schema
export const Subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id).notNull(),
  planName: varchar("plan_name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("ETH"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subscription Transactions schema (for handling payments and conversions)
export const SubscriptionTransactions = pgTable("subscription_transactions", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").references(() => Subscriptions.id).notNull(),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
  paidCurrency: varchar("paid_currency").notNull(),
  conversionRate: decimal("conversion_rate", { precision: 10, scale: 6 }),
  usdEquivalent: decimal("usd_equivalent", { precision: 10, scale: 2 }),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  transactionHash: varchar("transaction_hash"),
});
