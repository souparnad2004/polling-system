import { sql } from "drizzle-orm";
import { check, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["active", "inactive"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", {length: 320}).notNull().unique(),
    displayName: varchar("display_name", {length: 100}),
    status: statusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).notNull().$onUpdate(() => new Date()),
},
(table) => [
    check(
        "user_staus_check",
        sql`${table.status} IN ('active', 'inactive')`,
    )
]
)

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;