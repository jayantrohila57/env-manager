import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const template = pgTable(
  "template",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("template_userId_idx").on(table.userId)],
);

export const templateVariable = pgTable(
  "template_variable",
  {
    id: text("id").primaryKey(),
    templateId: text("template_id")
      .notNull()
      .references(() => template.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    encryptedValue: text("encrypted_value").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("template_variable_templateId_idx").on(table.templateId)],
);

export const templateRelations = relations(template, ({ one, many }) => ({
  user: one(user, {
    fields: [template.userId],
    references: [user.id],
  }),
  variables: many(templateVariable),
}));

export const templateVariableRelations = relations(
  templateVariable,
  ({ one }) => ({
    template: one(template, {
      fields: [templateVariable.templateId],
      references: [template.id],
    }),
  }),
);
