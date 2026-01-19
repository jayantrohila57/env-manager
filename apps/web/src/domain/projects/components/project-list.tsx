"use client";

import { useProjects } from "../hooks/use-projects";
import { CreateProjectDialog } from "./create-project-dialog";
import { ProjectListView } from "./project-list-view";

interface Project {
  id: string;
  name: string;
  description: string | null;
}

export default function ProjectList() {
  const { projects, status, createProject, isCreating, deleteProject } =
    useProjects();

  const handleCreate = async (data: { name: string; description?: string }) => {
    await createProject(data);
  };

  const handleEdit = async (project: Project) => {
    // In a real app, this would open a dialog.
    // For brevity, I'll keep logic simple in the container.
    console.log("Edit project", project);
  };

  const handleDelete = async (project: Project) => {
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      await deleteProject({ id: project.id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">Projects</h2>
        <CreateProjectDialog onConfirm={handleCreate} isPending={isCreating} />
      </div>

      <ProjectListView
        projects={projects}
        status={status}
        onCreate={() => {}} // Create is handled by its own dialog trigger in the header
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
