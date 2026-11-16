import { Certification, PathwayStep, StudyPlan } from "../types";

const request = async <T>(operation: string, payload: Record<string, unknown>): Promise<T> => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, ...payload }),
    });
    if (!response.ok) {
        throw new Error('The AI service is temporarily unavailable.');
    }
    return response.json() as Promise<T>;
};

export const generateLearningPathway = (domain: string): Promise<PathwayStep[]> =>
    request<PathwayStep[]>('learningPathway', { domain });

export const getRecommendedCertifications = (
    bookmarkedCerts: Certification[],
    course?: { name: string; url: string }
): Promise<{ recommendations: Certification[]; reasoning: { [key: string]: string } }> =>
    request('recommendations', { bookmarkedCerts, course });

export const generateStudyPlan = (
    certsToStudy: Certification[],
    dailyHours: { [key: string]: number },
    startDate: string
): Promise<StudyPlan> =>
    request<StudyPlan>('studyPlan', { certsToStudy, dailyHours, startDate });

export const sendChatMessage = (
    history: { role: 'user' | 'model'; text: string }[],
    message: string
): Promise<string> => request<string>('chat', { history, message });
