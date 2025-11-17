
import { GoogleGenAI, Type } from "@google/genai";

// MOCK DATA to simulate real system data
const mockPerformanceData = {
    kpis: [
        { name: "هزینه پروژه A", target: 5000, actual: 5800, trend: "increase", status: "negative" },
        { name: "پیشرفت پروژه A", target: 80, actual: 65, trend: "increase", status: "negative" },
        { name: "رضایت مشتری", target: 90, actual: 92, trend: "increase", status: "positive" },
    ],
    personnelFeedback: [
        { name: "علی احمدی", role: "مهندس پروژه", self_assessment: "خوب", manager_feedback: "متوسط", peer_feedback: "عالی", actions: "با تاخیر در تحویل فاز دوم مواجه شدیم." },
        { name: "زهرا محمدی", role: "مدیر فنی", self_assessment: "عالی", manager_feedback: "عالی", peer_feedback: "خوب", actions: "نوآوری در کاهش هزینه‌های مصالح." },
    ]
};

const getPromptForReport = (reportId: number): { prompt: string, schema: any } => {
    const data = JSON.stringify(mockPerformanceData, null, 2);

    switch (reportId) {
        case 11: // "تحلیل عارضه‌ها و پیشنهاد پروژه بهبود"
            return {
                prompt: `You are an expert management consultant for a civil engineering firm. Analyze the following performance data for the last quarter: ${data}.
                Based on this data, identify the top 2 performance gaps. For each gap, describe the root cause and propose a specific, actionable improvement project with a clear objective and potential success metrics.
                The response must be in Persian.`,
                schema: {
                    type: Type.OBJECT,
                    properties: {
                        improvement_projects: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    gap: { type: Type.STRING, description: "شرح شکاف عملکردی" },
                                    root_cause: { type: Type.STRING, description: "علت ریشه‌ای مشکل" },
                                    project_suggestion: {
                                        type: Type.OBJECT,
                                        properties: {
                                            title: { type: Type.STRING, description: "عنوان پروژه بهبود" },
                                            objective: { type: Type.STRING, description: "هدف اصلی پروژه" },
                                            metrics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "سنجه‌های موفقیت پروژه" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
        case 12: // "تحلیل شایستگی‌های فنی و رفتاری پرسنل"
            return {
                prompt: `You are an expert HR analyst for a civil engineering firm. Analyze the personnel feedback data: ${data}.
                For each person, provide a brief analysis of their strengths and areas for development based on the feedback. Suggest a potential development path for each.
                The response must be in Persian.`,
                schema: {
                    type: Type.OBJECT,
                    properties: {
                        competency_analysis: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    personnel_name: { type: Type.STRING, description: "نام پرسنل" },
                                    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "نقاط قوت کلیدی" },
                                    areas_for_development: { type: Type.ARRAY, items: { type: Type.STRING }, description: "زمینه‌های بهبود" },
                                    suggested_path: { type: Type.STRING, description: "مسیر توسعه شغلی پیشنهادی" }
                                }
                            }
                        }
                    }
                }
            };
        default:
             return {
                prompt: `You are a helpful business analyst. Summarize the key findings from the following performance data in Persian: ${data}.`,
                schema: {
                    type: Type.OBJECT,
                    properties: {
                        general_summary: {
                            type: Type.STRING,
                            description: "خلاصه‌ای کلی از وضعیت عملکرد"
                        }
                    }
                }
            };
    }
};


export const getAiAnalysis = async (reportId: number): Promise<string> => {
    // This is a placeholder for the actual API key which should be
    // handled securely, e.g., via environment variables.
    // For this example, we're assuming process.env.API_KEY is available.
    if (!process.env.API_KEY) {
        console.warn("API key not found. Using mock response.");
        // Simulate a delay and return mock JSON based on reportId
        return new Promise(resolve => setTimeout(() => {
            if(reportId === 11) {
                resolve(JSON.stringify({
                    "improvement_projects": [
                        {
                            "gap": "تأخیر در پیشرفت پروژه A",
                            "root_cause": "تخصیص ناکافی منابع در فاز دوم و عدم هماهنگی بین تیم فنی و تدارکات.",
                            "project_suggestion": {
                                "title": "پروژه بهبود فرآیند تخصیص منابع و ارتباطات بین واحدی",
                                "objective": "کاهش تأخیرات پروژه به میزان ۲۰٪ در سه ماه آینده از طریق بهینه‌سازی برنامه تخصیص منابع و ایجاد جلسات هماهنگی هفتگی.",
                                "metrics": ["درصد کاهش تأخیرات", "میزان پایبندی به برنامه زمان‌بندی", "امتیاز رضایت تیم‌ها از هماهنگی"]
                            }
                        },
                         {
                            "gap": "افزایش هزینه در پروژه A",
                            "root_cause": "نوسانات قیمت مصالح و عدم پیش‌بینی دقیق در فاز برآورد اولیه.",
                            "project_suggestion": {
                                "title": "پروژه بازنگری و به‌روزرسانی مدل برآورد هزینه",
                                "objective": "افزایش دقت برآورد هزینه‌ها به میزان ۱۵٪ با استفاده از داده‌های تاریخی و مدل‌های پیش‌بینی قیمت.",
                                "metrics": ["درصد خطای برآورد هزینه", "صرفه‌جویی مالی در پروژه‌های جدید"]
                            }
                        }
                    ]
                }));
            } else if (reportId === 12) {
                resolve(JSON.stringify({
                    "competency_analysis": [
                        {
                            "personnel_name": "علی احمدی",
                            "strengths": ["همکاری تیمی عالی", "روحیه مسئولیت‌پذیری"],
                            "areas_for_development": ["مدیریت زمان", "برنامه‌ریزی و پیش‌بینی ریسک"],
                            "suggested_path": "شرکت در دوره‌های مدیریت پروژه (PMP) و استفاده از ابزارهای نوین برنامه‌ریزی."
                        },
                        {
                            "personnel_name": "زهرا محمدی",
                            "strengths": ["خلاقیت و نوآوری فنی", "دقت بالا در کار", "رهبری تیم"],
                            "areas_for_development": ["مهارت‌های مذاکره با تأمین‌کنندگان"],
                            "suggested_path": "به عهده گرفتن نقش راهبر فنی در پروژه‌های بزرگتر و شرکت در کارگاه‌های اصول مذاکره."
                        }
                    ]
                }));
            } else {
                 resolve(JSON.stringify({ "general_summary": "تحلیل کلی نشان می‌دهد که با وجود عملکرد مثبت در رضایت مشتری، چالش‌هایی در مدیریت هزینه و زمان‌بندی پروژه‌ها وجود دارد که نیازمند توجه ویژه است."}));
            }
        }, 1500));
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const { prompt, schema } = getPromptForReport(reportId);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
};
