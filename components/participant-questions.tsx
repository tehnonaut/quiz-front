import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClockIcon } from 'lucide-react';
import dayjs from 'dayjs';
import { Participant } from '@/api/participant/types';
import { Quiz } from '@/api/quiz/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	getParticipantAnswers,
	saveParticipantAnswer,
	markParticipantAsFinished,
	getParticipant,
} from '@/api/participant';
import { toast } from '@/hooks/use-toast';
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

import { useRouter } from 'next/navigation';

interface QuizQuestionsProps {
	participant: Participant;
	quizData: Quiz;
}

export default function QuizQuestions({ quizData, participant }: QuizQuestionsProps) {
	const { data: participantData } = useQuery({
		queryKey: ['getParticipant', participant._id],
		queryFn: () => getParticipant(participant._id),
		enabled: !!participant._id,
		initialData: participant,
		refetchInterval: 5000,
	});

	const [localParticipant, setLocalParticipant] = useState(participantData || participant);

	const calculateTimeRemaining = () => {
		if (!participantData) return 0;
		const startTime = dayjs(participant.createdAt);
		const endTime = startTime.add(quizData.duration, 'minutes');
		const remainingSeconds = endTime.diff(dayjs(), 'second');
		return Math.max(0, remainingSeconds);
	};

	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [timeRemaining, setTimeRemaining] = useState(45 * 60);
	const [isCompleted, setisCompleted] = useState(false);
	const [showExitDialog, setShowExitDialog] = useState(false);
	const hasSubmittedOnTimeout = useRef(false);

	const { mutate } = useMutation({ mutationFn: saveParticipantAnswer });
	const { mutate: onUpdate } = useMutation<Participant, Error, { participantId: string }>({
		mutationFn: async ({ participantId }) => {
			await markParticipantAsFinished({ participantId });
			return participant; // Return the current participant to match expected type
		},
		onSuccess: (data: Participant) => {
			setLocalParticipant(data);
			setisCompleted(true);
		},
	});

	const { data: participantAnswers } = useQuery({
		queryKey: ['getParticipantAnswers', participant._id],
		queryFn: async () => {
			try {
				const res = await getParticipantAnswers(participant._id);
				return res;
			} catch (error) {
				toast({
					title: 'Error fetching participant answers',
					description: 'Please try again',
					variant: 'destructive',
				});
				//remove participantId from local storage
				localStorage.removeItem('participantId');
				return [];
			}
		},
		enabled: !!participant._id,
	});

	useEffect(() => {
		if (participantAnswers?.length) {
			const answers = participantAnswers.reduce((acc, { question, answer }) => {
				acc[question] = answer;
				return acc;
			}, {} as Record<string, string>);

			setAnswers(answers);
		}
	}, [participantAnswers]);

	useEffect(() => {
		const timer = setInterval(() => {
			const remaining = calculateTimeRemaining();
			setTimeRemaining(remaining);

			// Auto-submit when time expires, but only once
			if (remaining === 0 && !localParticipant.isCompleted && !hasSubmittedOnTimeout.current) {
				hasSubmittedOnTimeout.current = true;
				onFinish();
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [participant.createdAt, quizData.duration, localParticipant.isCompleted]);

	// Reset the ref when isCompleted changes
	useEffect(() => {
		if (localParticipant.isCompleted) {
			hasSubmittedOnTimeout.current = true;
		}
	}, [localParticipant.isCompleted]);

	useEffect(() => {
		if (participantData) {
			setLocalParticipant(participantData);
		}
	}, [participantData]);

	const onFinish = () => {
		onUpdate({
			participantId: participant._id,
		});
	};

	const handleChoiceChange = (questionId: string, value: string) => {
		// Prevent changes if time expired
		if (timeRemaining === 0) return;

		setAnswers((prev) => ({ ...prev, [questionId]: value }));
		onSubmitToAPI(questionId, value);
	};

	const handleAnswerChange = (questionId: string, value: string) => {
		// Prevent changes if time expired
		if (timeRemaining === 0) return;

		setAnswers((prev) => ({ ...prev, [questionId]: value }));
	};

	const onSubmitToAPI = (questionId: string, value: string) => {
		if (value && value.trim() !== '') {
			mutate({
				participantId: participant._id,
				questionId,
				body: {
					answer: value,
				},
			});
		}
	};

	const handleExit = () => {
		localStorage.removeItem('participantId');
		setTimeout(() => {
			window.location.href = `/quiz/${quizData._id}`;
		}, 100);
	};

	return (
		<div className="space-y-8">
			<div className="bg-muted p-6 rounded-lg flex items-center justify-between">
				<p>Number of questions: {quizData.questions.length}</p>
				<h2 className="text-lg font-semibold">{quizData.title}</h2>
				<div className="flex items-center gap-4">
					<div className={`flex items-center gap-2 italic ${timeRemaining <= 60 ? 'text-red-500' : ''}`}>
						<ClockIcon size={20} />
						{Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')} minutes remaining
					</div>
					{localParticipant.isCompleted && <span className="text-green-500">Submitted ✅</span>}
					{timeRemaining === 0 && !localParticipant.isCompleted && <span className="text-red-500">Time expired!</span>}
				</div>
			</div>

			<div>
				<h1>
					<b>Hello, {participant.name}!</b> Welcome to the {quizData.title}.
					<br />
					Please start answering the questions below.
				</h1>
			</div>

			{quizData.questions.map((question, questionIndex) => (
				<div key={question._id} className="border p-4 rounded-lg">
					<h3 className="text-lg font-semibold mb-2">{questionIndex + 1}. Question</h3>
					<p className="mb-4">{question.question}</p>

					{question.type === 'choice' && (
						<RadioGroup
							onValueChange={(value) => handleChoiceChange(question._id, value)}
							value={answers[question._id]}
							disabled={timeRemaining === 0 || localParticipant.isCompleted}
						>
							{question.answers?.map((choice, index) => (
								<div key={choice} className="flex items-center gap-x-2">
									{index + 1}.
									<RadioGroupItem value={choice} id={`${question._id}-${choice}`} />
									<Label htmlFor={`${question._id}-${choice}`}>{choice}</Label>
								</div>
							))}
						</RadioGroup>
					)}

					{question.type === 'answer' && (
						<Textarea
							placeholder="Type your answer here..."
							value={answers[question._id] || ''}
							onChange={(e) => handleAnswerChange(question._id, e.target.value)}
							className="w-full min-h-[200px]"
							onBlur={(e) => onSubmitToAPI(question._id, e.target.value)}
							disabled={timeRemaining === 0 || localParticipant.isCompleted}
						/>
					)}
				</div>
			))}

			<div className="flex items-center gap-4 justify-center">
				<Button
					className="max-w-96 min-w-48 bg-green-600 hover:bg-green-800"
					onClick={() => onFinish()}
					disabled={localParticipant.isCompleted}
				>
					{isCompleted ? '✅ Quiz Submitted' : 'Finish'}
				</Button>

				<Button
					variant="outline"
					className="max-w-96 min-w-48 hover:bg-red-700 hover:text-white"
					onClick={() => setShowExitDialog(true)}
				>
					Exit Quiz
				</Button>
			</div>

			<AlertDialog open={showExitDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
						<AlertDialogDescription>
							This will end your quiz session. Make sure you have saved all your answers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setShowExitDialog(false)}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleExit} className="bg-destructive hover:bg-destructive/90">
							Exit Quiz
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
