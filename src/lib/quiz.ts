export interface QuizQuestion {
	question: string;
	options: string[];
	answer: string;
}

export interface GradeResult {
	questionIndex: number;
	question: string;
	correctAnswer: string;
	userAnswer: string;
	isCorrect: boolean;
}

export interface Score {
	correct: number;
	total: number;
	percentage: number;
}

// Gemini gives options back as "A) something", and the answer as just "A",
// so the letter is what gets compared.
export function optionLetter(option: string): string {
	return option.slice(0, 1);
}

export function grade(questions: QuizQuestion[], answers: Record<number, string>): GradeResult[] {
	return questions.map((q, i) => {
		const userAnswer = answers[i] ?? '';
		return {
			questionIndex: i,
			question: q.question,
			correctAnswer: q.answer,
			userAnswer,
			isCorrect: userAnswer === q.answer
		};
	});
}

export function scoreOf(results: GradeResult[]): Score {
	const correct = results.filter((r) => r.isCorrect).length;
	const total = results.length;
	return {
		correct,
		total,
		percentage: total ? Math.round((correct / total) * 100) : 0
	};
}
