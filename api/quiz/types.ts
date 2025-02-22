export type Quiz = {
	_id: string;
	title: string;
	description: string;
	duration: number;
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
	answer: string[];
	question: string;
	participant: string;
	quiz: string;
};
