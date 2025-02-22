'use client';

import { useForm, useFieldArray, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { Checkbox } from '@/components/ui/checkbox';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createQuizRequest, getQuizRequest, updateQuizRequest } from '@/api/quiz';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreateQuizRequest, QuestionType } from '@/api/quiz/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useMemo, useState } from 'react';
import { Suspense } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const choiceSchema = z.object({
	text: z.string().min(1, 'Choice text is required'),
});

const questionSchema = z
	.object({
		_id: z.string().optional(),
		question: z.string().min(1, 'Question is required'),
		type: z.enum(['answer', 'choice']),
		answers: z.array(choiceSchema).optional(),
		correctAnswers: z.array(z.string()).optional(),
		quiz: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.type === 'choice') {
				return (
					data.answers !== undefined &&
					data.answers.length > 0 &&
					data.correctAnswers !== undefined &&
					data.correctAnswers.length > 0 &&
					data.answers.some((answer) => answer.text === data?.correctAnswers?.[0])
				);
			}

			return true;
		},
		{
			message: 'At least one choice must be selected as the correct answer',
			path: ['correctAnswers'],
		}
	);

const quizSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string(),
	duration: z.number().min(1, 'Duration must be at least 1 minute').default(45),
	isActive: z.boolean().default(true),
	questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function ManageQuizPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ManageQuizContent />
		</Suspense>
	);
}

function ManageQuizContent() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const quizId = searchParams.get('quizId');
	const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

	const { mutate: createMutation, isPending: isCreating } = useMutation({
		mutationFn: createQuizRequest,
		onSuccess: () => {
			toast({
				title: 'Quiz created',
				description: 'The quiz has been created successfully',
			});
			queryClient.invalidateQueries({ queryKey: ['quiz-list'] });
			router.push('/dashboard');
		},
	});

	const { mutate: updateMutation, isPending: isUpdating } = useMutation({
		mutationFn: updateQuizRequest,
		onSuccess: () => {
			toast({
				title: 'Quiz updated',
				description: 'The quiz has been updated successfully',
			});
			queryClient.invalidateQueries({ queryKey: ['quiz-list'] });
		},
	});

	const { data: specficQuiz } = useQuery({
		queryKey: ['quiz', quizId],
		queryFn: quizId
			? async () => {
					const data = await getQuizRequest(quizId);
					return data;
			  }
			: undefined,
		enabled: !!quizId,
	});

	const defaultValues: QuizFormValues = useMemo(() => {
		if (specficQuiz) {
			return {
				title: specficQuiz.title,
				description: specficQuiz.description,
				duration: specficQuiz.duration,
				isActive: specficQuiz.isActive,
				questions: specficQuiz.questions.map((q) => ({
					_id: q._id,
					quiz: specficQuiz._id,
					question: q.question,
					type: q.type,
					answers: q.answers?.map((a) => ({ text: a })) || [],
					correctAnswers: q.correctAnswers || [],
				})),
			};
		}

		return {
			title: '',
			description: '',
			duration: 45,
			isActive: false,
			questions: [{ question: '', type: 'answer' as const }],
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
	}, [defaultValues, form, specficQuiz]);

	const { fields, append, remove, move } = useFieldArray({
		control: form.control,
		name: 'questions',
	});

	const onSubmit = (data: QuizFormValues) => {
		const body: CreateQuizRequest = {
			title: data.title,
			description: data.description || '',
			duration: data.duration,
			isActive: data.isActive,
			questions: data.questions.map((q) => ({
				_id: q._id,
				quiz: q.quiz,
				question: q.question,
				answers: q.answers?.map((a) => a.text) || [],
				correctAnswers: q.correctAnswers || [],
				type: q.type as QuestionType,
			})),
		};

		if (specficQuiz) {
			updateMutation({
				_id: specficQuiz._id,
				body,
			});
			return;
		}

		createMutation(body);
	};

	const handleDeleteQuestion = (index: number) => {
		remove(index);
		setQuestionToDelete(null);
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
								<BreadcrumbPage>{quizId ? 'Update Quiz' : 'Create Quiz'}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="container mx-auto max-w-3xl space-y-8">
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-bold">{quizId ? 'Update Quiz' : 'Create Quiz'}</h1>
							<Button type="submit" disabled={isCreating || isUpdating} className="bg-green-600 text-white">
								{quizId ? 'Update Quiz' : 'Create Quiz'}
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
												<Textarea placeholder="Enter quiz description" {...field} />
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
													onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
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
												<Checkbox checked={field.value} onCheckedChange={field.onChange} />
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel className="inline">Enable Quiz</FormLabel>
												<FormDescription className="ml-2 inline">
													(when enabled, the participants can see and answer the questions)
												</FormDescription>
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
										<CardContent className="space-y-4">
											<FormField
												control={form.control}
												name={`questions.${index}._id`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input type="hidden" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`questions.${index}.quiz`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input type="hidden" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`questions.${index}.question`}
												render={({ field }) => (
													<FormItem>
														<div className="relative h-9 flex items-center justify-between">
															<FormLabel className="font-semibold text-l">Question {index + 1}</FormLabel>
															<div className="absolute right-0 top-0 flex gap-2">
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() => move(index, index - 1)}
																	disabled={index === 0}
																>
																	<MoveUp className="w-4 h-4" />
																</Button>
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() => move(index, index + 1)}
																	disabled={index === fields.length - 1}
																>
																	<MoveDown className="w-4 h-4" />
																</Button>
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	className="border border-red-300 text-red-500"
																	onClick={() => setQuestionToDelete(index)}
																>
																	<Trash2 className="w-4 h-4 mr-1 text-red-500" />
																	Remove Question
																</Button>
															</div>
														</div>
														<FormControl>
															<Textarea placeholder="Enter question" {...field} />
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
																if (value === 'choice') {
																	const currentAnswers = form.getValues(`questions.${index}.answers`) || [];
																	if (currentAnswers.length === 0) {
																		form.setValue(`questions.${index}.answers`, [{ text: 'Yes' }, { text: 'No' }]);
																	}
																	form.setValue(`questions.${index}.correctAnswers`, [
																		currentAnswers[0]?.text || 'Yes',
																	]);
																} else if (value === 'answer') {
																	form.setValue(`questions.${index}.answers`, []);
																	form.setValue(`questions.${index}.correctAnswers`, []);
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
																<SelectItem value="choice">Multiple Choice</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
											{form.watch(`questions.${index}.type`) === 'choice' && (
												<ChoicesFieldArray control={form.control} questionIndex={index} />
											)}
										</CardContent>
									</Card>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={() => append({ question: '', type: 'answer', correctAnswers: [] })}
								>
									<PlusCircle className="w-4 h-4 mr-1" />
									Add Question
								</Button>
							</CardContent>
						</Card>
						<div className="flex items-center justify-end">
							<Button
								type="submit"
								variant="default"
								disabled={isCreating || isUpdating}
								className="bg-green-600 text-white"
							>
								{quizId ? 'Update Quiz' : 'Create Quiz'}
							</Button>
						</div>
					</div>
				</form>
			</Form>
			<AlertDialog open={questionToDelete !== null}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete this question.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setQuestionToDelete(null)}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => questionToDelete !== null && handleDeleteQuestion(questionToDelete)}
							className="bg-destructive hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

function ChoicesFieldArray({ control, questionIndex }: { control: Control<QuizFormValues>; questionIndex: number }) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: `questions.${questionIndex}.answers`,
	});

	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name={`questions.${questionIndex}.correctAnswers`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Choices (Select the correct answer)</FormLabel>
						<FormControl>
							<RadioGroup
								onValueChange={(value) => {
									field.onChange([value]);
								}}
								value={field.value?.[0] || ''}
								className="space-y-2"
							>
								{fields.map((choiceField, choiceIndex) => (
									<div key={`${choiceField.id}-${choiceIndex}`} className="flex items-center space-x-2">
										<FormField
											control={control}
											name={`questions.${questionIndex}.answers.${choiceIndex}.text`}
											render={({ field: choiceTextField }) => (
												<FormItem className="flex items-center space-x-2 flex-grow">
													<FormControl>
														<div className="flex items-center space-x-2 w-full">
															<RadioGroupItem value={choiceTextField.value} />
															<Input
																className="flex-grow"
																placeholder={`Choice ${choiceIndex + 1}`}
																{...choiceTextField}
																onChange={(e) => {
																	choiceTextField.onChange(e);
																	// Update correctAnswers if this was the selected choice
																	if (field.value?.[0] === choiceTextField.value) {
																		field.onChange([e.target.value]);
																	}
																}}
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
											disabled={fields.length <= 2}
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
			<Button type="button" variant="outline" size="sm" onClick={() => append({ text: '' })}>
				<PlusCircle className="w-4 h-4 mr-1" />
				Add Choice
			</Button>
		</div>
	);
}
