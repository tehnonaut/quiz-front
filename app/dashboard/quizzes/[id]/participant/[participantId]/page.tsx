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
import { useQuery } from '@tanstack/react-query';
import { getQuizParticipantResultsRequest } from '@/api/quiz';
import { toast } from '@/hooks/use-toast';

export default function QuizParticipantResultsPage() {
	const router = useRouter();
	const { id: quizId, participantId } = useParams();

	const { data, isPending, isError } = useQuery({
		queryKey: ['getQuizParticipantResultsRequest', quizId, participantId],
		queryFn: async () => {
			try {
				const res = await getQuizParticipantResultsRequest({
					quizId: quizId as string,
					participantId: participantId as string,
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
						<div key={result.question._id} className="p-4 rounded-xl my-4 border">
							<p className="text-lg font-bold">
								{index + 1}. {result.question?.question}
							</p>
							<p className="mt-2">{result.answer?.answer ?? 'No answer'}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
