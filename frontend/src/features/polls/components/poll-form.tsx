"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useState } from "react";

import { useCreatePoll } from "../hooks/use-create-poll";
import { useUpdatePoll } from "../hooks/use-update-poll";
import { createPollSchema } from "../schemas/poll.schema";
import type { CreatePollInput, Poll } from "../types/poll.types";
import { PublishPollDialog } from "./publish-poll-dialog";

type PollFormData = z.infer<typeof createPollSchema>;

interface PollFormProps {
  // When a poll is provided the form runs in edit mode (drafts only): fields
  // are prefilled and submitting calls PATCH /api/polls/:pollId.
  poll?: Poll;
  onSuccess: (pollId: string, status: "draft" | "published") => void;
}

export function PollForm({ poll, onSuccess }: PollFormProps) {
  const isEdit = poll !== undefined;
  const createPollMutation = useCreatePoll();
  const updatePollMutation = useUpdatePoll();
  const [isPublishDialogOpen, setPublishDialogOpen] = useState(false);
  const [pendingCreate, setPendingCreate] = useState<Omit<CreatePollInput, "status" | "closedAt"> | null>(null);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PollFormData>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: poll?.title ?? "",
      description: poll?.description ?? "",
      options:
        poll?.options.map((option) => ({ text: option.text })) ?? [
          { text: "" },
          { text: "" },
        ],
      allowAnonymous: poll?.allowAnonymous ?? true,
      allowVoteChange: poll?.allowVoteChange ?? true,
      status: "draft",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const isSubmitting =
    createPollMutation.isPending || updatePollMutation.isPending;

  async function onSubmit(data: PollFormData) {
    const payload = {
      title: data.title,
      // Edit mode sends null so an emptied description actually clears the
      // poll; create mode leaves it undefined when blank.
      description: isEdit
        ? data.description || null
        : data.description || undefined,
      options: data.options.map((option) => option.text),
      allowAnonymous: data.allowAnonymous,
      allowVoteChange: data.allowVoteChange,
    };

    if (isEdit && poll) {
      // Editing is draft-only, so the status never changes here.
      const updated = await updatePollMutation.mutateAsync({
        pollId: poll.id,
        input: payload,
      });
      onSuccess(updated.id, "draft");
      return;
    }

    if (data.status === "published") {
      setPendingCreate({
        title: data.title,
        description: data.description || undefined,
        options: data.options.map((option) => option.text),
        allowAnonymous: data.allowAnonymous,
        allowVoteChange: data.allowVoteChange,
      });
      setPublishDialogOpen(true);
      return;
    }

    const created = await createPollMutation.mutateAsync({
      title: data.title,
      description: data.description || undefined,
      options: data.options.map((option) => option.text),
      allowAnonymous: data.allowAnonymous,
      allowVoteChange: data.allowVoteChange,
      status: "draft",
    });
    onSuccess(created.id, "draft");
  }

  async function confirmCreate(closedAt?: string) {
    if (!pendingCreate) return;

    const created = await createPollMutation.mutateAsync({
      ...pendingCreate,
      status: "published",
      closedAt,
    });
    setPendingCreate(null);
    setPublishDialogOpen(false);
    onSuccess(created.id, "published");
  }

  return (
    <>
      <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit poll" : "Create a poll"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Question</Label>

            <Input
              id="title"
              placeholder="What should our team build next?"
              {...register("title")}
            />

            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Label htmlFor="allowVoteChange">Allow voters to change their vote</Label>
              <p className="text-sm text-muted-foreground">
                On by default. Turn this off for a strict one-chance vote where the first choice is final.
              </p>
            </div>

            <Controller
              control={control}
              name="allowVoteChange"
              render={({ field }) => (
                <Switch
                  id="allowVoteChange"
                  checked={field.value ?? true}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              placeholder="Add some context..."
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Label htmlFor="allowAnonymous">Allow anonymous voting</Label>

              <p className="text-sm text-muted-foreground">
                Let people vote without signing in. Turn this off to restrict
                voting to logged-in users.
              </p>
            </div>

            <Controller
              control={control}
              name="allowAnonymous"
              render={({ field }) => (
                <Switch
                  id="allowAnonymous"
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label>Options</Label>

              <p className="text-sm text-muted-foreground">
                Add at least two choices.
              </p>
            </div>

{fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  {...register(`options.${index}.text`)}
                />

                {fields.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}

            {errors.options?.root && (
              <p className="text-sm text-destructive">
                {errors.options.root.message}
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ text: "" })}
              disabled={fields.length >= 10}
            >
              Add option
            </Button>
          </div>

          {isEdit ? (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="submit"
                variant="outline"
                className="flex-1 cursor-pointer"
                disabled={isSubmitting}
                onClick={() => {
                  setValue("status", "draft");
                }}
              >
                {isSubmitting ? "Saving..." : "Save as draft"}
              </Button>

              <Button
                type="submit"
                className="flex-1 cursor-pointer"
                disabled={isSubmitting}
                onClick={() => {
                  setValue("status", "published");
                }}
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
      </Card>
      <PublishPollDialog
        open={isPublishDialogOpen}
        pending={createPollMutation.isPending}
        onOpenChange={setPublishDialogOpen}
        onConfirm={confirmCreate}
      />
    </>
  );
}