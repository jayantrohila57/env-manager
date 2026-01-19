import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const project = pgTable(
  "project",
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
  (table) => [index("project_userId_idx").on(table.userId)],
);

export const environment = pgTable(
  "environment",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(), // dev, staging, prod
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("environment_projectId_idx").on(table.projectId)],
);

export const environmentVariable = pgTable(
  "environment_variable",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    encryptedValue: text("encrypted_value").notNull(),
    environmentId: text("environment_id")
      .notNull()
      .references(() => environment.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("environment_variable_environmentId_idx").on(table.environmentId),
    index("environment_variable_key_idx").on(table.key),
  ],
);

// Relations
export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
  environments: many(environment),
  variables: many(environmentVariable),
}));

export const environmentRelations = relations(environment, ({ one, many }) => ({
  project: one(project, {
    fields: [environment.projectId],
    references: [project.id],
  }),
  variables: many(environmentVariable),
}));

export const environmentVariableRelations = relations(
  environmentVariable,
  ({ one }) => ({
    environment: one(environment, {
      fields: [environmentVariable.environmentId],
      references: [environment.id],
    }),
  }),
);
