"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "../hooks/use-projects";

export function CreateProject() {
  const { createProject, isCreating } = useProjects();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createProject({
      name,
      description: description || undefined,
      repositoryUrl: repositoryUrl || undefined,
      websiteUrl: websiteUrl || undefined,
      isPublic,
    });

    setName("");
    setDescription("");
    setRepositoryUrl("");
    setWebsiteUrl("");
    setIsPublic(false);
  };

  return (
    <Card className="h-full w-full bg-transparent">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Project"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your project..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repositoryUrl">Repository URL (Optional)</Label>
            <Input
              id="repositoryUrl"
              type="url"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
            <Input
              id="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://your-project.com"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="isPublic">Make this project public</Label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
