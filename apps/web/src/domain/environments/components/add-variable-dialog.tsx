"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddVariableDialogProps {
  onConfirm: (data: { key: string; value: string }) => Promise<void>;
  isPending: boolean;
}

export function AddVariableDialog({
  onConfirm,
  isPending,
}: AddVariableDialogProps) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    await onConfirm({ key: key.trim().toUpperCase(), value });
    setOpen(false);
    setKey("");
    setValue("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Variable
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Variable</DialogTitle>
          <DialogDescription>Add a new environment variable.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="var-key">Key</Label>
              <Input
                id="var-key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="DATABASE_URL"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="var-value">Value</Label>
              <Textarea
                id="var-value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="your-value-here"
                rows={3}
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
