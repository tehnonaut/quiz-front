'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, CircleOffIcon, CopyIcon, Loader, MoreHorizontal, X } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteQuizRequest, getQuizListRequest } from '@/api/quiz';
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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { getBaseUrl } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';

export const QuizDashboard = () => {
	const [quizForDelete, setQuizForDelete] = useState('');

	const { toast } = useToast();
	const queryClient = useQueryClient();

	const { data, isPending } = useQuery({
		queryKey: ['quiz-list'],
		queryFn: getQuizListRequest,
	});

	const { mutate: deleteQuizMutation, isPending: isDeleting } = useMutation({
		mutationFn: deleteQuizRequest,
		onSuccess: () => {
			toast({
				title: 'Quiz deleted',
				description: 'The quiz has been deleted successfully',
			});
			queryClient.invalidateQueries({ queryKey: ['quiz-list'] });
			setQuizForDelete('');
		},
	});

	const baseUrl = getBaseUrl();

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbPage>Quizzes</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div>
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-2xl font-bold">Quizzes</h1>
						<Link href="/dashboard/quizzes/manage">
							<Button variant="default" className="bg-green-800 text-white">
								Create Quiz
							</Button>
						</Link>
					</div>
					<div className="flex items-center gap-2 text-sm">
						When the quiz is active, participants can take it, when it is inactive they cant answer questions. You can
						copy the link and send it to the participants.
					</div>
				</div>
				{isPending ? (
					<p className="flex items-center gap-4 justify-center pt-10">
						<Loader size={24} className="animate-spin" />
						Please wait...
					</p>
				) : (
					<div className="rounded-xl bg-card">
						{data?.length ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead className="hidden lg:table-cell">Duration</TableHead>
										<TableHead className="hidden lg:table-cell">Questions</TableHead>
										<TableHead>Active</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.map((quiz) => (
										<TableRow key={quiz._id}>
											<TableCell>
												<Label htmlFor="quiz-link" className="text-bold text-lg">
													{quiz.title}
												</Label>
												<br />
												<p className="inline-flex items-center gap-1 text-sm text-gray-500 mt-2">
													<Input
														id="quiz-link"
														type="text"
														className=" bg-gray-100 text-gray-800 rounded-md my-2 min-w-48 md:min-w-96 hidden md:block"
														defaultValue={`${baseUrl}/quiz/${quiz._id}`}
														readOnly={true}
														onClick={(e) => {
															e.currentTarget.select();
															navigator.clipboard.writeText(e.currentTarget.value);
														}}
													/>
													<Button
														variant="outline"
														size="icon"
														title="Copy link"
														aria-label="Copy link"
														onClick={() => {
															const URL = `${baseUrl}/quiz/${quiz._id}`;
															navigator.clipboard.writeText(URL);
															toast({
																title: 'Link copied',
																description: 'The link has been copied to clipboard',
															});
														}}
													>
														<CopyIcon size={16} className="cursor-pointer" />
													</Button>
												</p>
											</TableCell>
											<TableCell className="hidden lg:table-cell">{quiz.duration}min</TableCell>
											<TableCell className="hidden lg:table-cell">{quiz.questions.length || 0}</TableCell>
											<TableCell>
												{quiz.isActive ? <Check size={18} color="green" /> : <X size={18} color="#c00" />}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<span className="sr-only">Open menu</span>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<Link href={`/dashboard/quizzes/manage?quizId=${quiz._id}`}>
															<DropdownMenuItem>Edit Quiz</DropdownMenuItem>
														</Link>
														<Link href={`/dashboard/quizzes/${quiz._id}/results`}>
															<DropdownMenuItem>See results</DropdownMenuItem>
														</Link>

														<DropdownMenuSeparator />
														<DropdownMenuItem onClick={() => setQuizForDelete(quiz._id)}>Delete</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<div className="pt-10 flex flex-col gap-5 items-center justify-center">
								<CircleOffIcon className="text-red-500" size={32} />
								<p className="text-center">
									No quizzes found.
									<br />
									<Link href={'/dashboard/quizzes/manage'} className="hover:underline font-bold">
										Create your first quiz.
									</Link>
								</p>
							</div>
						)}
					</div>
				)}
			</div>
			<AlertDialog open={!!quizForDelete}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete quiz and all related data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setQuizForDelete('')}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => deleteQuizMutation(quizForDelete)}
							disabled={isDeleting}
							className="bg-destructive hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
