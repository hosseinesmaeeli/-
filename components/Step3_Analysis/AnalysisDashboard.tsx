
import React, { useState, useCallback } from 'react';
import { getAiAnalysis } from '../../services/geminiService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Loader2, AlertTriangle, Lightbulb, ChevronsUpDown, Check } from 'lucide-react';

const reports = [
    { id: 11, label: "تحلیل عارضه‌ها و پیشنهاد پروژه بهبود" },
    { id: 12, label: "تحلیل شایستگی‌های فنی و رفتاری پرسنل" },
    { id: 13, label: "گزارش شکاف شاخص‌های کیفی" },
    { id: 8, label: "تحلیل عملکرد مدیریت در شاخص‌های کلیدی" },
];

interface ImprovementProject {
    gap: string;
    root_cause: string;
    project_suggestion: {
        title: string;
        objective: string;
        metrics: string[];
    };
}

interface AiResponse {
    improvement_projects?: ImprovementProject[];
    competency_analysis?: {
        personnel_name: string;
        strengths: string[];
        areas_for_development: string[];
        suggested_path: string;
    }[];
    general_summary?: string;
}

export const AnalysisDashboard: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AiResponse | null>(null);

    const handleReportSelection = useCallback(async (reportId: number) => {
        setSelectedReport(reportId);
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await getAiAnalysis(reportId);
            setAnalysisResult(JSON.parse(result));
        } catch (err) {
            setError('خطا در دریافت تحلیل از هوش مصنوعی. لطفاً دوباره تلاش کنید.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const renderResult = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-lg text-blue-600">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p>در حال تحلیل داده‌ها و تولید گزارش توسط هوش مصنوعی...</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-lg text-red-600 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-12 h-12 mb-4" />
                    <p>{error}</p>
                </div>
            );
        }
        if (!analysisResult) {
            return <div className="text-center p-8 text-gray-500">لطفاً یک گزارش را برای مشاهده تحلیل انتخاب کنید.</div>;
        }

        return (
            <div className="space-y-6">
                {analysisResult.improvement_projects && (
                    <div className="space-y-4">
                         {analysisResult.improvement_projects.map((proj, idx) => (
                            <Card key={idx} className="bg-gray-50">
                                <CardHeader>
                                    <CardTitle className="text-blue-700">{proj.project_suggestion.title}</CardTitle>
                                    <p className="text-sm text-gray-500">بر اساس شکاف: {proj.gap}</p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div><strong className="font-semibold">علت ریشه‌ای:</strong> {proj.root_cause}</div>
                                    <div><strong className="font-semibold">هدف پروژه:</strong> {proj.project_suggestion.objective}</div>
                                    <div>
                                      <strong className="font-semibold">سنجه‌های موفقیت:</strong>
                                      <ul className="list-disc list-inside mr-4 mt-1">
                                          {proj.project_suggestion.metrics.map((metric, i) => <li key={i}>{metric}</li>)}
                                      </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                 {analysisResult.competency_analysis && (
                    <div className="space-y-4">
                        {analysisResult.competency_analysis.map((person, idx) => (
                             <Card key={idx} className="bg-gray-50">
                                <CardHeader>
                                    <CardTitle className="text-green-700">تحلیل شایستگی: {person.personnel_name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                      <strong className="font-semibold">نقاط قوت:</strong>
                                      <ul className="list-disc list-inside mr-4 mt-1">{person.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                                    </div>
                                    <div>
                                      <strong className="font-semibold">زمینه‌های بهبود:</strong>
                                      <ul className="list-disc list-inside mr-4 mt-1">{person.areas_for_development.map((d, i) => <li key={i}>{d}</li>)}</ul>
                                    </div>
                                    <div><strong className="font-semibold">مسیر توسعه پیشنهادی:</strong> {person.suggested_path}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                 )}

                {analysisResult.general_summary && <p>{analysisResult.general_summary}</p>}
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-700">داشبورد تحلیل و بهبود (BI & AI)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>انتخاب گزارش</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {reports.map(report => (
                                    <li key={report.id}>
                                        <button 
                                            onClick={() => handleReportSelection(report.id)}
                                            className={`w-full text-right p-3 rounded-lg flex items-center transition-colors ${selectedReport === report.id ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-100'}`}
                                        >
                                           {selectedReport === report.id ? <Check className="ml-2"/> : <Lightbulb className="ml-2"/>}
                                            {report.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-3">
                     <Card className="min-h-[30rem]">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-800">
                                {selectedReport ? `نتایج تحلیل: ${reports.find(r => r.id === selectedReport)?.label}` : 'تحلیل هوش مصنوعی'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           {renderResult()}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
