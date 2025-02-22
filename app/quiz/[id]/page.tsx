'use client';

import { useEffect, useState } from 'react';
import QuizForm from '@/components/participant-create';
import QuizQuestions from '@/components/participant-questions';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getQuizRequest } from '@/api/quiz';
import { createParticipant, getParticipantInfo } from '@/api/participant';
import { Participant } from '@/api/participant/types';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { Quiz } from '@/api/quiz/types';

export default function QuizPage() {
	const [quizStarted, setQuizStarted] = useState(false);
	const [participantDetails, setParticipantDetails] = useState<{
		participantId: string;
		name: string;
		studentId: string;
	}>({
		participantId: '',
		name: '',
		studentId: '',
	});

	const { id: quizId } = useParams();

	const [quizData, setQuizData] = useState<Quiz | null>(null);

	const { data: quiz } = useQuery({
		queryKey: ['do-quiz', quizId],
		queryFn: async () => {
			try {
				const quiz = await getQuizRequest(quizId as string);
				setQuizData(quiz);
				return quiz;
			} catch (error) {
				throw error;
			}
		},
		enabled: !!quizId,
	});

	const { mutate } = useMutation({
		mutationFn: createParticipant,
		onSuccess: (res: Participant) => {
			const { _id: participantId, name, studentId } = res;
			setParticipantDetails({ participantId, name, studentId });
			setStorageItem('participantId', participantId);
			setQuizStarted(true);
		},
	});

	useEffect(() => {
		const fetchParticipantInfo = async () => {
			const participantId = getStorageItem('participantId');

			if (participantId) {
				const participantInfo = await getParticipantInfo(participantId);
				if (participantInfo) {
					setParticipantDetails({ participantId, name: participantInfo.name, studentId: participantInfo.studentId });
					setQuizStarted(true);
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
				quizData && (
					<QuizQuestions
						quizData={quizData}
						participant={{
							...participantDetails,
							_id: participantDetails.participantId,
							quiz: quizId as string,
							createdAt: new Date().toISOString(),
							isCompleted: false,
						}}
					/>
				)
			)}
		</div>
	);
}
