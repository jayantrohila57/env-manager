import { type ZodTypeAny, z } from "zod/v3";

// Shared response helpers
export const makeResponseSchema = <T extends ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.literal("success"),
    message: z.string(),
    data: dataSchema,
    error: z.string().nullable().default(null),
  });

export const respond = <T>({
  data,
  message = "OK",
}: {
  data: T;
  message?: string;
}): { status: "success"; message: string; data: T; error: string | null } => ({
  status: "success",
  message,
  data,
  error: null,
});

// Project schemas
export const createProjectInput = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export const updateProjectInput = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

export const getProjectInput = z.object({
  id: z.string().uuid(),
});

export const projectOutput = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Environment schemas
export const listEnvironmentsInput = z.object({
  projectId: z.string().uuid(),
});

export const createEnvironmentInput = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).max(64),
});

export const updateEnvironmentInput = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(64).optional(),
});

export const getEnvironmentInput = z.object({
  id: z.string().uuid(),
});

export const environmentOutput = z.object({
  id: z.string(),
  name: z.string(),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Variable schemas
export const createVariableInput = z.object({
  environmentId: z.string().uuid(),
  key: z.string().min(1).max(256),
  value: z.string(),
});

export const updateVariableInput = z.object({
  id: z.string().uuid(),
  key: z.string().min(1).max(256).optional(),
  value: z.string().optional(),
});

export const getVariableInput = z.object({
  id: z.string().uuid(),
});

export const variableOutput = z.object({
  id: z.string(),
  key: z.string(),
  environmentId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const variableWithDecryptedValueOutput = variableOutput.extend({
  value: z.string(),
});

export const environmentWithVariablesOutput = z.object({
  environment: environmentOutput.nullable(),
  variables: z.array(variableOutput),
});

// Bulk import schemas
export const bulkImportVariablesInput = z.object({
  environmentId: z.string().uuid(),
  variables: z.array(
    z.object({
      key: z.string().min(1).max(256),
      value: z.string(),
    }),
  ),
  overwrite: z.boolean().default(false),
});

export const bulkImportResultOutput = z.object({
  created: z.number(),
  updated: z.number(),
  skipped: z.number(),
});

// Export schemas
export const exportVariablesInput = z.object({
  environmentId: z.string().uuid(),
});

export const exportVariablesOutput = z.string();

// Audit log schemas
export const auditLogOutput = z.object({
  id: z.string(),
  userId: z.string(),
  projectId: z.string().nullable(),
  environmentId: z.string().nullable(),
  variableId: z.string().nullable(),
  action: z.string(),
  entityType: z.string(),
  oldValue: z.string().nullable(),
  newValue: z.string().nullable(),
  createdAt: z.date(),
});

export const listAuditLogsInput = z.object({
  projectId: z.string().uuid().optional(),
  environmentId: z.string().uuid().optional(),
  action: z
    .enum(["CREATE", "UPDATE", "DELETE", "BULK_IMPORT", "EXPORT"])
    .optional(),
  entityType: z.enum(["VARIABLE", "ENVIRONMENT", "PROJECT"]).optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

// Template schemas
export const createTemplateInput = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  variables: z.array(
    z.object({
      key: z.string().min(1).max(256),
      value: z.string().optional().default(""),
      description: z.string().optional(),
    }),
  ),
});

export const getTemplateInput = z.object({
  id: z.string().uuid(),
});

export const listTemplatesOutput = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  variableCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const templateWithVariablesOutput = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  variables: z.array(
    z.object({
      id: z.string(),
      key: z.string(),
      value: z.string(),
      description: z.string().nullable(),
    }),
  ),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const applyTemplateInput = z.object({
  templateId: z.string().uuid(),
  environmentId: z.string().uuid(),
});
