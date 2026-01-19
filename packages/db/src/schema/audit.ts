import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { environment, environmentVariable, project } from "./projects";

export const auditLog = pgTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => project.id, {
      onDelete: "cascade",
    }),
    environmentId: text("environment_id").references(() => environment.id, {
      onDelete: "cascade",
    }),
    variableId: text("variable_id").references(() => environmentVariable.id, {
      onDelete: "cascade",
    }),
    action: text("action").notNull(), // 'CREATE', 'UPDATE', 'DELETE', 'BULK_IMPORT', 'EXPORT'
    entityType: text("entity_type").notNull(), // 'VARIABLE', 'ENVIRONMENT', 'PROJECT'
    oldValue: text("old_value"), // JSON of previous state
    newValue: text("new_value"), // JSON of new state
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_log_userId_idx").on(table.userId),
    index("audit_log_projectId_idx").on(table.projectId),
    index("audit_log_createdAt_idx").on(table.createdAt),
  ],
);

// Relations
export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(user, {
    fields: [auditLog.userId],
    references: [user.id],
  }),
  project: one(project, {
    fields: [auditLog.projectId],
    references: [project.id],
  }),
  environment: one(environment, {
    fields: [auditLog.environmentId],
    references: [environment.id],
  }),
  variable: one(environmentVariable, {
    fields: [auditLog.variableId],
    references: [environmentVariable.id],
  }),
}));
