"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQuizRequest,
  getQuizRequest,
  updateQuizRequest,
} from "@/api/quiz";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreateQuizRequest } from "@/api/quiz/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo } from "react";

const choiceSchema = z.object({
  text: z.string().min(1, "Choice text is required"),
});

const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  type: z.enum(["answer", "choice"]),
  answers: z.array(choiceSchema).optional(),
  correctAnswer: z.string().optional(),
});

const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  duration: z.number().min(1, "Duration must be at least 1 minute").default(45),
  isActive: z.boolean().default(true),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function ManageQuizPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");

  const { mutate: createMutation, isPending: isCreating } = useMutation({
    mutationFn: createQuizRequest,
    onSuccess: () => {
      toast({
        title: "Quiz created",
        description: "The quiz has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["quiz-list"] });
      router.push("/dashboard");
    },
  });

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateQuizRequest,
    onSuccess: () => {
      toast({
        title: "Quiz updated",
        description: "The quiz has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["quiz-list"] });
    },
  });

  const { data: specficQuiz } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: quizId ? () => getQuizRequest(quizId) : undefined,
    enabled: !!quizId,
  });

  const defaultValues: any = useMemo(() => {
    if (specficQuiz) {
      return {
        title: specficQuiz.title,
        description: specficQuiz.description,
        duration: specficQuiz.duration,
        isActive: specficQuiz.isActive,
        questions: specficQuiz.questions.map((q) => ({
          question: q.question,
          type: q.type,
          answers: q.answers?.map((a) => ({ text: a })) || [],
          correctAnswer: q.correctAnswers[0],
        })),
      };
    }

    return {
      title: "",
      description: "",
      duration: 45,
      isActive: true,
      questions: [{ question: "", type: "answer" }],
    };
  }, [specficQuiz]);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues,
  });

  useEffect(() => {
    if (specficQuiz) {
      form.reset(defaultValues);
    }
  }, [specficQuiz]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = (data: QuizFormValues) => {
    const body: CreateQuizRequest = {
      title: data.title,
      description: data.description || "",
      duration: data.duration,
      isActive: data.isActive,
      questions: data.questions.map((q) => ({
        question: q.question,
        answers: q.answers?.map((a) => a.text) || [],
        correctAnswers: [q.correctAnswer || ""],
        type: q.type as any,
      })),
    };

    if (specficQuiz) {
      const questionId = specficQuiz.questions.find(
        (q) => q.question === body.questions[0].question
      )?._id;

      updateMutation({
        _id: specficQuiz._id,
        body: {
          ...body,
          questions: body.questions.map((q) => ({
            ...q,
            _id: questionId || undefined,
            quiz: specficQuiz._id || undefined,
          })),
        },
      });

      return;
    }

    createMutation(body);
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Quizzes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {quizId ? "Update Quiz" : "Create Quiz"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="container mx-auto max-w-3xl space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">
                {quizId ? "Update Quiz" : "Create Quiz"}
              </h1>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {quizId ? "Update Quiz" : "Create Quiz"}
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter quiz title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter quiz description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable Quiz</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="pt-6 space-y-4">
                      <FormField
                        control={form.control}
                        name={`questions.${index}.question`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question {index + 1}</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter question" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`questions.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question Type</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                if (value === "choice") {
                                  const currentAnswers =
                                    form.getValues(
                                      `questions.${index}.answers`
                                    ) || [];
                                  if (currentAnswers.length === 0) {
                                    form.setValue(
                                      `questions.${index}.answers`,
                                      [
                                        { text: "Choice 1" },
                                        { text: "Choice 2" },
                                      ]
                                    );
                                    form.setValue(
                                      `questions.${index}.correctAnswer`,
                                      "0"
                                    );
                                  }
                                }
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select question type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="answer">Answer</SelectItem>
                                <SelectItem value="choice">
                                  Multiple Choice
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {form.watch(`questions.${index}.type`) === "choice" && (
                        <ChoicesFieldArray
                          control={form.control}
                          questionIndex={index}
                        />
                      )}
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="mt-2"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Question
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ question: "", type: "answer" })}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </>
  );
}

function ChoicesFieldArray({
  control,
  questionIndex,
}: {
  control: any;
  questionIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.answers`,
  });

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`questions.${questionIndex}.correctAnswer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Choices (Select the correct answer)</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-2"
              >
                {fields.map((choiceField, choiceIndex) => (
                  <div
                    key={choiceField.id}
                    className="flex items-center space-x-2"
                  >
                    <FormField
                      control={control}
                      name={`questions.${questionIndex}.answers.${choiceIndex}.text`}
                      render={({ field: choiceTextField }) => (
                        <FormItem className="flex items-center space-x-2 flex-grow">
                          <FormControl>
                            <div className="flex items-center space-x-2 w-full">
                              <RadioGroupItem value={`${choiceIndex}`} />
                              <Input
                                className="flex-grow"
                                placeholder={`Choice ${choiceIndex + 1}`}
                                {...choiceTextField}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(choiceIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ text: "" })}
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Choice
      </Button>
    </div>
  );
}
