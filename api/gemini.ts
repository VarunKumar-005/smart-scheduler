import {
    generateChatResponse,
    generateLearningPathway,
    generateStudyPlan,
    getRecommendedCertifications,
} from '../services/geminiService.server';

interface VercelRequest {
    method?: string;
    body?: Record<string, any>;
}

interface VercelResponse {
    status(code: number): VercelResponse;
    json(body: unknown): VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { operation, ...payload } = req.body ?? {};
        switch (operation) {
            case 'learningPathway':
                return res.status(200).json(await generateLearningPathway(payload.domain));
            case 'recommendations':
                return res.status(200).json(await getRecommendedCertifications(payload.bookmarkedCerts, payload.course));
            case 'studyPlan':
                return res.status(200).json(await generateStudyPlan(payload.certsToStudy, payload.dailyHours, payload.startDate));
            case 'chat':
                return res.status(200).json(await generateChatResponse(payload.history, payload.message));
            default:
                return res.status(400).json({ error: 'Unknown operation' });
        }
    } catch (error) {
        console.error('Gemini API request failed:', error);
        return res.status(500).json({ error: 'AI request failed' });
    }
}
