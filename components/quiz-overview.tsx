'use client';

import { useEffect, useState } from 'react';
import QuizForm from '@/components/participant-create';
import QuizQuestions from '@/components/participant-questions';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getQuizRequest } from '@/api/quiz';
import { createParticipant, getParticipant } from '@/api/participant';
import { Participant } from '@/api/participant/types';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { Quiz } from '@/api/quiz/types';
import { toast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

export const QuizOverview = () => {
	const [quizStarted, setQuizStarted] = useState(false);
	const [participantDetails, setParticipantDetails] = useState<Participant>({
		_id: '',
		quiz: '',
		name: '',
		studentId: '',
		createdAt: '',
		isCompleted: false,
		points: 0,
		isGraded: false,
	});

	const { id: quizId } = useParams();

	const [quizData, setQuizData] = useState<Quiz>({
		_id: '',
		title: '',
		description: '',
		duration: 0,
		isActive: false,
		questions: [],
		points: 0,
	});

	const { data: quiz } = useQuery({
		queryKey: ['do-quiz', quizId],
		queryFn: async () => {
			try {
				const quiz = await getQuizRequest(quizId as string);
				setQuizData(quiz);
				return quiz;
			} catch (error) {
				const message = error instanceof AxiosError ? error.response?.data.message : 'Unknown error fetching quiz';
				toast({
					title: 'Error fetching quiz',
					description: message,
					variant: 'destructive',
				});
				const emptyQuiz = {
					_id: '',
					title: '',
					description: '',
					duration: 0,
					isActive: false,
					questions: [],
					points: 0,
				};
				setQuizData(emptyQuiz);
				return emptyQuiz;
			}
		},
		enabled: !!quizId,
	});

	const { mutate } = useMutation({
		mutationFn: createParticipant,
		onSuccess: (res: Participant) => {
			setParticipantDetails(res);
			setStorageItem('participantId', res._id);
			setQuizStarted(true);
		},
	});

	useEffect(() => {
		const fetchParticipantInfo = async () => {
			const participantId = getStorageItem('participantId');

			if (participantId) {
				const participantInfo = await getParticipant(participantId);
				if (participantInfo) {
					setParticipantDetails(participantInfo);
					setQuizStarted(true);
				} else {
					localStorage.removeItem('participantId');
					toast({
						title: 'Error fetching participant',
						description: 'Please try again',
						variant: 'destructive',
					});
				}
			}
		};

		fetchParticipantInfo();
	}, []);

	const startQuiz = (details: { name: string; studentId: string }) => {
		mutate({ ...details, quizId: quizId as string });
	};

	return (
		<div className="container mx-auto p-4">
			{!quizStarted ? (
				<QuizForm onStart={startQuiz} quiz={quiz} />
			) : (
				quizData && <QuizQuestions quizData={quizData} participant={participantDetails} />
			)}
		</div>
	);
};
