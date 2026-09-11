"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PublishPollDialogProps {
  open: boolean;
  pending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (closedAt?: string) => void;
}

const PRESETS = [
  { label: "1 hour", hours: 1 },
  { label: "6 hours", hours: 6 },
  { label: "24 hours", hours: 24 },
  { label: "3 days", hours: 72 },
];

export function PublishPollDialog({
  open,
  pending = false,
  onOpenChange,
  onConfirm,
}: PublishPollDialogProps) {
  const [selection, setSelection] = useState("24");
  const [customHours, setCustomHours] = useState(48);

  function confirmPublish() {
    if (selection === "none") {
      onConfirm();
      return;
    }

    const hours = selection === "custom" ? customHours : Number(selection);
    if (!Number.isFinite(hours) || hours <= 0) return;

    onConfirm(new Date(Date.now() + hours * 60 * 60 * 1000).toISOString());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set poll closing time</DialogTitle>
          <DialogDescription>
            Choose how long people can vote. You can also leave the poll open
            until you close it manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="poll-close-after">Close poll after</Label>
            <Select
              id="poll-close-after"
              value={selection}
              onValueChange={(value) => setSelection(String(value))}
            >
              <SelectTrigger id="poll-close-after" className="w-full">
                <SelectValue placeholder="Choose a closing time" />
              </SelectTrigger>
              <SelectContent>
              {PRESETS.map((preset) => (
                <SelectItem key={preset.hours} value={String(preset.hours)}>
                  {preset.label}
                </SelectItem>
              ))}
                <SelectItem value="custom">Custom duration</SelectItem>
                <SelectItem value="none">No automatic closing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selection === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom-close-hours">Hours</Label>
              <Input
                id="custom-close-hours"
                type="number"
                min={1}
                step={1}
                value={customHours}
                onChange={(event) => setCustomHours(Number(event.target.value))}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button type="button" onClick={confirmPublish} disabled={pending}>
            {pending ? "Publishing..." : "Publish poll"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
