"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createPoll } from "../poll.api";

const createPollSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(200, "Question is too long"),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional(),

  options: z
    .array(
      z.object({
        text: z
          .string()
          .trim()
          .min(1, "Option cannot be empty")
          .max(100, "Option is too long"),
      }),
    )
    .min(2, "At least two options are required")
    .max(10, "Maximum 10 options allowed"),
});

type CreatePollFormData =
  z.infer<typeof createPollSchema>;

interface CreatePollFormProps {
  onSuccess: (pollId: string) => void;
}

export function CreatePollForm({
  onSuccess,
}: CreatePollFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CreatePollFormData>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      description: "",
      options: [
        { text: "" },
        { text: "" },
      ],
    },
  });

  const { fields, append, remove } =
    useFieldArray({
      control,
      name: "options",
    });

  async function onSubmit(
    data: CreatePollFormData,
  ) {
    const poll = await createPoll({
      title: data.title,
      description:
        data.description || undefined,
      options: data.options.map(
        (option) => option.text,
      ),
    });

    onSuccess(poll.id);
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Create a poll</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="title">
              Question
            </Label>

            <Input
              id="title"
              placeholder="What should our team build next?"
              {...register("title")}
            />

            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>

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

          <div className="space-y-4">
            <div>
              <Label>Options</Label>

              <p className="text-sm text-muted-foreground">
                Add at least two choices.
              </p>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-2"
              >
                <Input
                  placeholder={`Option ${index + 1}`}
                  {...register(
                    `options.${index}.text`,
                  )}
                />

                {fields.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      remove(index)
                    }
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
              onClick={() =>
                append({ text: "" })
              }
              disabled={fields.length >= 10}
            >
              Add option
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating..."
              : "Create poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}