'use client';

import { Separator } from '@radix-ui/react-separator';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuizParticipantResultsRequest, updateAnswerReviewRequest } from '@/api/quiz';
import { toast } from '@/hooks/use-toast';
import { QuestionType, Quiz, AnswerResponse, Question } from '@/api/quiz/types';
import { FormField, FormItem, FormMessage } from './ui/form';
import { FormLabel } from './ui/form';
import { Input } from './ui/input';
import { FormControl } from './ui/form';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckSquare, SquareMinus, SquareSquare, XSquare } from 'lucide-react';
import { Form } from './ui/form';
import { Button } from './ui/button';
import { Participant } from '@/api/participant/types';
import { useEffect, useRef } from 'react';
import React from 'react';

const reviewSchema = z.object({
	points: z.number().min(0, 'Points cannot be negative'),
	isCorrect: z.boolean().optional(),
	answerId: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

function ReviewAnswer({ result, index }: { result: { answer: AnswerResponse; question: Question }; index: number }) {
	const queryClient = useQueryClient();
	const form = useForm<ReviewFormValues>({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			points: result?.answer?.points || 0,
			isCorrect: result?.answer?.isCorrect,
			answerId: result?.answer?._id,
		},
	});

	const { mutate: updateReview, isPending } = useMutation({
		mutationFn: async (data: ReviewFormValues) => {
			await updateAnswerReviewRequest({
				quizId: result.question.quiz,
				participantId: result.answer.participant,
				answerId: result.answer._id,
				body: {
					points: data.points,
					isCorrect: data.isCorrect ?? false,
				},
			});
		},
		onSuccess: () => {
			toast({
				title: 'Review updated',
				description: 'The answer review has been updated successfully',
			});
			queryClient.invalidateQueries({
				queryKey: ['getQuizParticipantResultsRequest'],
			});
		},
		onError: () => {
			toast({
				title: 'Error updating review',
				description: 'Please try again',
				variant: 'destructive',
			});
		},
	});

	// Create a debounced save function
	const debouncedSave = (data: ReviewFormValues) => {
		if (data.points !== undefined) {
			updateReview({
				points: data.points,
				isCorrect: data.isCorrect ?? false,
				answerId: result?.answer?._id,
			});
		}
	};

	// Add a ref to store the timeout ID for the input debounce
	const inputTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	return (
		<div className="p-4 rounded-xl my-4 border">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<p className="text-lg font-bold">
						{index + 1}.{' '}
						{result.answer === null ? (
							<SquareMinus className="text-red-500 inline-block mx-2" />
						) : typeof result.answer?.isCorrect === 'boolean' ? (
							result.answer?.isCorrect ? (
								<CheckSquare className="text-green-500 inline-block mx-2" />
							) : (
								<XSquare className="text-red-500 inline-block mx-2" />
							)
						) : (
							<SquareSquare className="text-purple-400 inline-block mx-2" />
						)}
						{result.question?.question}
					</p>
					<p className="mt-4 text-gray-500">{result.answer?.answer ?? 'Not answered'}</p>
				</div>

				{result.question.type === QuestionType.ANSWER && result.answer?.answer != undefined && (
					<div className="w-full flex gap-4">
						<Form {...form}>
							<div className="flex gap-4 flex-col md:flex-row">
								<FormField
									control={form.control}
									name="isCorrect"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Review</FormLabel>
											<FormControl className="h-8">
												<RadioGroup
													className="flex mt-4 h-8"
													onValueChange={(value) => {
														// Update both values
														const isCorrect = value === 'correct';
														form.setValue('isCorrect', isCorrect, { shouldDirty: true });
														const newPoints = isCorrect ? result.question.points : 0;
														form.setValue('points', newPoints, { shouldDirty: true });

														// Clear any pending input timeout
														if (inputTimeoutRef.current) {
															clearTimeout(inputTimeoutRef.current);
															inputTimeoutRef.current = null;
														}

														// Manually trigger the save after a short delay
														setTimeout(() => {
															debouncedSave({
																points: newPoints,
																isCorrect: isCorrect,
																answerId: result?.answer?._id,
															});
														}, 300);
													}}
													value={typeof field.value === 'boolean' ? (field.value ? 'correct' : 'incorrect') : ''}
												>
													<div className="flex gap-4">
														<div className="flex items-center space-x-2">
															<RadioGroupItem value="correct" id={`correct-${index}`} />
															<Label htmlFor={`correct-${index}`}>Correct</Label>
														</div>
														<div className="flex items-center space-x-2">
															<RadioGroupItem value="incorrect" id={`incorrect-${index}`} />
															<Label htmlFor={`incorrect-${index}`}>Incorrect</Label>
														</div>
													</div>
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="points"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Points (max: {result.question.points})</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={0}
													max={result.question.points}
													{...field}
													disabled={typeof form.getValues().isCorrect !== 'boolean' || !form.getValues().isCorrect}
													onChange={(e) => {
														// Ensure points don't exceed maximum
														let newValue = Number(e.target.value);
														if (newValue > result.question.points) {
															newValue = result.question.points;
														}
														field.onChange(newValue);

														// Clear any existing timeout
														if (inputTimeoutRef.current) {
															clearTimeout(inputTimeoutRef.current);
														}

														// Set a new timeout for 1 second
														inputTimeoutRef.current = setTimeout(() => {
															debouncedSave({
																points: newValue,
																isCorrect: form.getValues().isCorrect ?? false,
																answerId: result?.answer?._id,
															});
															inputTimeoutRef.current = null;
														}, 1000); // Wait 1 second before sending request
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</Form>
					</div>
				)}

				{result.question.type === QuestionType.CHOICE && result.answer?.answer != undefined && (
					<div className="flex gap-4">
						<div className="flex gap-2 flex-col">
							<Label htmlFor={`answer-${index}`}>Review:</Label>
							<span className="mt-2">
								{typeof result.answer.isCorrect === 'boolean'
									? result.answer.isCorrect
										? 'Correct'
										: 'Incorrect'
									: 'Not answered'}
							</span>
						</div>
						<div className="flex gap-2 flex-col">
							<Label htmlFor={`points-${index}`}>Points (max: {result.question.points})</Label>
							<Input id={`points-${index}`} type="number" value={result.answer.points || 0} className="w-20" disabled />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export const QuizParticipant = () => {
	const router = useRouter();
	const { id: quizId, participantId } = useParams();

	const form = useForm<ReviewFormValues>({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			points: 0,
			isCorrect: undefined,
			answerId: undefined,
		},
	});

	const { data } = useQuery({
		queryKey: ['getQuizParticipantResultsRequest', quizId, participantId],
		queryFn: async () => {
			try {
				const res = await getQuizParticipantResultsRequest({
					quizId: quizId as string,
					participantId: participantId as string,
				});

				// Initialize form with current values
				form.reset({
					points: res.results[0]?.answer?.isCorrect
						? res.results[0]?.question.points
						: res.results[0]?.answer?.points || 0,
					isCorrect: res.results[0]?.answer?.isCorrect,
					answerId: res.results[0]?.answer?._id,
				});

				return res;
			} catch (error) {
				toast({
					title: 'Error fetching participant results',
					description: 'Please try again',
					variant: 'destructive',
				});
				router.push(`/dashboard/quizzes/${quizId}/results`);
				return null;
			}
		},
		enabled: !!quizId && !!participantId,
		retry: 1,
	});

	if (!data) return <p className="pt-10 text-center">Loading...</p>;
	return (
		<div className="space-y-6">
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
								<BreadcrumbLink href={`/dashboard/quizzes/${quizId}/results`}>Quiz results</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>
									<BreadcrumbLink>Participant results</BreadcrumbLink>
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<Form {...form}>
				<div className="px-4 space-y-6">
					<div className="">
						<p className="font-bold text-2xl mb-1">Title: {data.quiz?.title}</p>
						<p className="text-gray-500 text-sm">Description: {data.quiz?.description}</p>
					</div>
					<div>
						<div className="flex items-center gap-2 mb-2">
							<h1 className="text-xl font-bold">Name: {data.participant?.name}</h1>
						</div>
						<p>Student ID: {data.participant?.studentId}</p>
					</div>
					<div>
						{(data.results ?? []).map((result, index) => (
							<ReviewAnswer key={result.question._id} result={result} index={index} />
						))}
					</div>
				</div>
			</Form>
		</div>
	);
};
