export type Quiz = {
	_id: string;
	title: string;
	description: string;
	duration: number;
	points: number;
	isActive: boolean;
	questions: Question[];
};

export type CreateQuizRequest = {
	title: string;
	description: string;
	questions: {
		type: QuestionType;
		question: string;
		answers: string[];
		correctAnswers: string[];
		points: number;
	}[];
	duration: number;
	isActive: boolean;
};

export enum QuestionType {
	CHOICE = 'choice',
	ANSWER = 'answer',
}

export type Question = {
	_id: string;
	type: QuestionType;
	question: string;
	answers: string[];
	correctAnswers: string[];
	points: number;
	quiz: string; // quiz id
};

export type UpdateQuizRequest = {
	_id: string;
	body: {
		title: string;
		description: string;
		questions: Partial<Question>[];
		duration: number;
		isActive: boolean;
	};
};

export type QuizParticipantResults = {
	quizId: string;
	participantId: string;
};

export type AnswerResponse = {
	_id: string;
	answer: string[];
	question: string;
	participant: string;
	points?: number;
	quiz: string;
	isCorrect?: boolean;
};

export type ReviewAnswerRequest = {
	quizId: string;
	participantId: string;
	answerId: string;
	body: {
		points: number;
		isCorrect: boolean;
	};
};
