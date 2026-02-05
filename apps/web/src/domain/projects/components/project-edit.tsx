"use client";

import type { ProjectOutput } from "@env-manager/api/types";
import { updateProjectInput } from "@env-manager/api/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod/v3";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "../hooks/use-projects";

interface EditProjectProps {
  project: ProjectOutput;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditProject({
  project,
  onSuccess,
  onCancel,
}: EditProjectProps) {
  const { updateProject, isUpdating } = useProjects();

  const form = useForm({
    resolver: zodResolver(updateProjectInput),
    defaultValues: {
      id: project.id,
      name: project.name,
      description: project.description || "",
      repositoryUrl: project.repositoryUrl || "",
      websiteUrl: project.websiteUrl || "",
      isPublic: project.isPublic,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: z.infer<typeof updateProjectInput>) => {
    try {
      await updateProject({
        id: data.id,
        name: data.name?.trim(),
        description: data.description?.trim() || undefined,
        repositoryUrl: data.repositoryUrl?.trim() || undefined,
        websiteUrl: data.websiteUrl?.trim() || undefined,
        isPublic: data.isPublic,
      });

      onSuccess?.();
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  return (
    <Card className="border-none bg-input/10 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Edit Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Name Field */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="font-medium text-sm">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Enter project name"
                  className={
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }
                  disabled={isUpdating}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="mt-1 text-red-500 text-sm">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Description Field */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="font-medium text-sm">
                  Description <span className="text-gray-400">(Optional)</span>
                </Label>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Provide a brief description of your project to help team members understand its purpose..."
                  rows={4}
                  className={`resize-none ${
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  disabled={isUpdating}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="mt-1 text-red-500 text-sm">
                    {fieldState.error?.message}
                  </p>
                )}
                <p className="mt-1 text-gray-500 text-xs">
                  {field.value?.length || 0}/500 characters
                </p>
              </div>
            )}
          />

          {/* Repository URL Field */}
          <Controller
            name="repositoryUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="font-medium text-sm">
                  Repository URL{" "}
                  <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  {...field}
                  id={field.name}
                  type="url"
                  placeholder="https://github.com/username/repo"
                  className={
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }
                  disabled={isUpdating}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="mt-1 text-red-500 text-sm">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Website URL Field */}
          <Controller
            name="websiteUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="font-medium text-sm">
                  Website URL <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  {...field}
                  id={field.name}
                  type="url"
                  placeholder="https://your-project.com"
                  className={
                    fieldState.invalid
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }
                  disabled={isUpdating}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <p className="mt-1 text-red-500 text-sm">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-gray-500 text-sm">
              <span className="text-red-500">*</span> Required fields
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating || !form.formState.isValid}
                className="min-w-[120px]"
              >
                {isUpdating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-white border-b-2" />
                    Updating...
                  </>
                ) : (
                  "Update Project"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
