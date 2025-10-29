
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Certification, StudyPlan, PathwayStep } from "../types";
import { CERTIFICATION_DATA } from "../constants";

const API_KEY = 'AIzaSyDPVTWkIvT4LouuxSwVMy1Kf5cKnQIccfc';

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

interface CourseInfo {
  name: string;
  url: string;
}

export const generateLearningPathway = async (domain: string): Promise<PathwayStep[]> => {
    const prompt = `You are an expert tech educator and curriculum designer. A user wants a detailed learning pathway for the domain: "${domain}".

Instructions:
1.  **Create a Learning Path:** Break this domain down into a logical sequence of 5-7 learning steps.
2.  **Detail Each Step:** For each step, provide:
    - A clear title (e.g., "Step 1: HTML Fundamentals").
    - A concise \`description\` of what the user will learn and why it's important.
    - A \`detailedDescription\`: A more in-depth explanation (2-3 sentences) covering the core concepts and real-world applications of this step.
    - A list of \`keyTopics\`: An array of 3-5 essential topics or skills to master for this step (e.g., "Semantic HTML", "Forms and Inputs", "Accessibility").
    - \`prerequisites\`: A list of required knowledge. For the first step, list general foundational skills (e.g., "Basic computer literacy"). For subsequent steps, list the titles of *previous steps* in this pathway that are required.
    - A list of 1-2 fictional, but realistic, learning resources (like online courses).
3.  **Format Resources:** For each resource, you MUST provide the following details:
    - \`id\`: a unique kebab-case string (e.g., 'html-essentials-course').
    - \`name\`: The course name (e.g., "HTML5 Essentials for Beginners").
    - \`provider\`: A fictional provider (e.g., "CodeAcademy Pro", "Techflix").
    - \`icon\`: A single, relevant emoji.
    - \`category\`: A category slug based on the domain (e.g., 'web-dev', 'game-dev').
    - \`description\`: A short, compelling course description.
    - \`difficulty\`: 'Beginner', 'Intermediate', or 'Advanced'.
    - \`duration\`: An estimated time to complete (e.g., "4 weeks").
    - \`rating\`: A number between 4.0 and 5.0.
    - \`reviewCount\`: A realistic number of reviews (e.g., 15230).

Your response MUST be a single, valid JSON array of step objects, with no other text or markdown.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.NUMBER },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            detailedDescription: { type: Type.STRING },
                            keyTopics: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                            },
                            prerequisites: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING
                                }
                            },
                            resources: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        name: { type: Type.STRING },
                                        provider: { type: Type.STRING },
                                        icon: { type: Type.STRING },
                                        category: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
                                        duration: { type: Type.STRING },
                                        rating: { type: Type.NUMBER },
                                        reviewCount: { type: Type.NUMBER },
                                    },
                                    required: ["id", "name", "provider", "icon", "category", "description", "difficulty", "duration", "rating", "reviewCount"],
                                },
                            },
                        },
                        required: ["step", "title", "description", "detailedDescription", "keyTopics", "prerequisites", "resources"],
                    },
                },
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating learning pathway:", error);
        throw new Error("Failed to generate the learning pathway. The AI model may be temporarily unavailable.");
    }
};


export const getRecommendedCertifications = async (
  bookmarkedCerts: Certification[],
  course?: CourseInfo
): Promise<{ recommendations: Certification[], reasoning: { [key: string]: string } }> => {
  const bookmarkedIds = bookmarkedCerts.map(c => c.id);

  // New logic for course-based recommendations
  if (course && course.name && course.url) {
    const candidateSummary = CERTIFICATION_DATA.map(c => `- ${c.name} (ID: ${c.id}): ${c.description}`).join('\n');
    const prompt = `You are an expert career advisor. A user is planning to take the following course:
---
**Course Name:** ${course.name}
**Course URL:** ${course.url}
---
**Available Certifications:**
${candidateSummary}
---
**Instructions:**
1.  **Primary Goal: Identify Prerequisites.** Your most important task is to use Google Search to analyze the course at the provided URL and identify any prerequisite knowledge or foundational concepts it requires. Search for phrases like "requirements," "prerequisites," or "assumed knowledge."
2.  **Prioritize Foundational Certifications.** Scan the "Available Certifications" list. Your top priority is to find certifications that directly teach the prerequisite skills you identified. If you find any, they MUST be included in your recommendations.
3.  **Find Complementary Certifications.** After addressing prerequisites, find certifications that are a good next step (more advanced) or cover related technologies that would pair well with the skills learned in the course.
4.  **Formulate Recommendations.** Create a final list of up to 4 recommended certification IDs. This list should be prioritized with foundational/prerequisite certifications first, followed by complementary ones.
5.  **Write Specific Reasoning.** For each recommendation, write a clear, concise reason (1-2 sentences). You MUST explicitly state *why* it is being recommended. For example:
    -   For a prerequisite: "This certification is recommended because the course requires foundational Python, and this certification provides a comprehensive introduction to Python programming."
    -   For a complement: "This certification is a great next step, allowing you to apply the course's machine learning concepts in a real-world cloud environment like AWS."
6.  **Format Response.** Your response MUST be a single, valid JSON object with no other text or markdown. The JSON should contain two keys:
    -   "recommendations": An array of certification ID strings.
    -   "reasoning": An array of objects, where each object has an "id" (string) and "reason" (string).

Example JSON format:
{
  "recommendations": ["azure-az900", "aws-cda"],
  "reasoning": [
    { "id": "azure-az900", "reason": "The course description mentions deploying to the cloud, so this certification covers the foundational cloud concepts you'll need to get started." },
    { "id": "aws-cda", "reason": "This is a great complementary certification to apply the course's Python skills in a real-world cloud development environment." }
  ]
}`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        let result;
        try {
            const cleanedText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
            result = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Failed to parse JSON from model response:", parseError, "Raw response:", response.text);
            throw new Error("The AI returned an invalid response format.");
        }
        
        const recommendedIds: string[] = result.recommendations || [];
        const reasoningArray: { id: string, reason: string }[] = result.reasoning || [];
        
        const reasoning = reasoningArray.reduce((acc, item) => {
            acc[item.id] = item.reason;
            return acc;
        }, {} as { [key: string]: string });

        const recommendations = CERTIFICATION_DATA.filter(c => recommendedIds.includes(c.id));
        
        return { recommendations, reasoning };
    } catch (error) {
        console.error("Error getting course-based recommendations:", error);
        throw error;
    }
  }

  // Fallback to existing bookmark-based logic
  if (bookmarkedCerts.length === 0) {
    const recommendations = CERTIFICATION_DATA.filter(c => c.difficulty === 'Beginner').sort((a, b) => b.rating - a.rating).slice(0, 4);
    const reasoning = Object.fromEntries(recommendations.map(c => [c.id, `This is a highly-rated, popular certificate for beginners to get started.`]));
    return { recommendations, reasoning };
  }
  
  const bookmarkedSummary = bookmarkedCerts.map(c => `- ${c.name} (ID: ${c.id})`).join('\n');
  const nonBookmarkedCandidateSummary = CERTIFICATION_DATA.filter(c => !bookmarkedIds.includes(c.id)).map(c => `- ${c.name} (ID: ${c.id}): ${c.description}`).join('\n');

  const bookmarkPrompt = `A user has bookmarked the following certifications, showing their interests:
---
**User's Bookmarks:**
${bookmarkedSummary}
---
**Available Certifications to Recommend From:**
${nonBookmarkedCandidateSummary}
---
Based on the user's bookmarks, recommend up to 4 other certifications from the available list that are a good next step or complement their interests. For each recommendation, provide a brief reason why it's a good fit.
Your response must be a valid JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: bookmarkPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["id", "reason"]
              }
            }
          },
          required: ["recommendations", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text);
    const recommendedIds: string[] = result.recommendations || [];
    const reasoningArray: { id: string, reason: string }[] = result.reasoning || [];
    
    const reasoning = reasoningArray.reduce((acc, item) => {
        acc[item.id] = item.reason;
        return acc;
    }, {} as { [key: string]: string });

    const recommendations = CERTIFICATION_DATA.filter(c => recommendedIds.includes(c.id));
    
    return { recommendations, reasoning };
  } catch (error) {
    console.error("Error getting bookmark recommendations:", error);
    return { recommendations: CERTIFICATION_DATA.filter(c => !bookmarkedIds.includes(c.id)).slice(0, 4), reasoning: {} };
  }
};

export const generateStudyPlan = async (
  certsToStudy: Certification[],
  dailyHours: { [key: string]: number },
  startDate: string
): Promise<StudyPlan> => {
  const dailyAvailability = Object.entries(dailyHours)
    .map(([day, hours]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours} hours`)
    .join('\n');

  const prompt = `You are an expert academic planner and time management coach. Create a detailed, granular, weekly study plan for a student.

The student wants to prepare for the following certifications and has provided their specific daily study availability.

---
**Certifications to Plan For:**
${JSON.stringify(certsToStudy.map(c => ({ name: c.name, description: c.description, duration: c.duration })), null, 2)}
---
**Student's Weekly Availability (in hours):**
${dailyAvailability}
---
**Plan Start Date:** ${startDate}
---

**Instructions:**
1.  **Create a Weekly Breakdown:** Structure the plan week by week.
2.  **Be Granular:** For each week, create a day-by-day plan. Allocate specific, actionable tasks to each day based on the student's available hours.
3.  **Suggest Timings:** To make the schedule more actionable, break down the daily tasks into suggested time slots like "Morning Session (1hr)", "Afternoon Session (2hrs)", or "Evening Review (30min)". The total time for tasks on a given day must not exceed the student's specified availability for that day.
4.  **Be Realistic:** The tasks for each day should be achievable within the specified hours.
5.  **Be Motivating:** Start with an encouraging introduction, provide a brief summary for each week, and end with a motivating conclusion.

Provide a detailed response in the required JSON format.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introduction: { type: Type.STRING, description: "A brief, encouraging intro to the study plan." },
            weeklyPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.NUMBER },
                  weeklySummary: { type: Type.STRING, description: "A summary of the week's goals." },
                  dailyBreakdown: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.STRING },
                        hours: { type: Type.NUMBER },
                        tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["day", "hours", "tasks"]
                    }
                  }
                },
                required: ["week", "weeklySummary", "dailyBreakdown"]
              }
            },
            conclusion: { type: Type.STRING, description: "A final motivating message." }
          },
          required: ["introduction", "weeklyPlan", "conclusion"]
        }
      }
    });
    
    return JSON.parse(response.text);

  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate the study plan. The AI model may be temporarily unavailable.");
  }
};

export const createChatSession = (): Chat => {
    const allCertsString = CERTIFICATION_DATA.map(c => `${c.name} (${c.provider}): ${c.description}`).join('\n');
    const systemInstruction = `You are an expert, friendly AI Study Advisor. Your goal is to help students plan their learning journey with certifications. You have knowledge of the following certifications.

Your key responsibilities are:
1. **Answer Questions:** Respond to user questions about specific certifications from the list.
2. **Provide Guidance:** Offer advice on which certifications might be good for certain career goals (e.g., "for a cloud job, look at AWS or Azure certs").
3. **Be encouraging:** Motivate the user and keep a positive, helpful tone.
4. **Leverage Certification Data:** Use the provided list of certifications as your primary source of truth.

Here is the list of available certifications:
${allCertsString}`;

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
};
