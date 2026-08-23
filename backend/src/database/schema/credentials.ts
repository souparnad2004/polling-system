import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const credentials = pgTable("credentials", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().unique().references(() => users.id, {onDelete: "cascade"}),
    passwordHash: text("password_hash").notNull(),
    passwordChanegedAt: timestamp("password_changed_at", {withTimezone: true}).notNull().defaultNow(),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).notNull().$onUpdate(() => new Date()),
})

export type Credentiasl = typeof credentials.$inferSelect;
export type NewCredentials = typeof credentials.$inferInsert;