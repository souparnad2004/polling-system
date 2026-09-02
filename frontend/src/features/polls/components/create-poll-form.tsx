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

import { createPollSchema } from "../schemas/poll.schema";
import { useCreatePoll } from "../hooks/use-create-poll";

type CreatePollFormData = z.infer<typeof createPollSchema>;

interface CreatePollFormProps {
  onSuccess: (pollId: string) => void;
}

export function CreatePollForm({ onSuccess }: CreatePollFormProps) {
  const createPollMutation = useCreatePoll();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePollFormData>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      description: "",
      options: [{ text: "" }, { text: "" }],
      allowAnonymous: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const isSubmitting = createPollMutation.isPending;

  async function onSubmit(data: CreatePollFormData) {
    const poll = await createPollMutation.mutateAsync({
      title: data.title,
      description: data.description || undefined,
      options: data.options.map((option) => option.text),
      allowAnonymous: data.allowAnonymous,
    });

    onSuccess(poll.id);
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Create a poll</CardTitle>
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
