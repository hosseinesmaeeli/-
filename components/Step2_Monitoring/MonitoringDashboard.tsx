
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Edit, Users, BarChart3, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const kpiData = [
  { name: 'فروردین', 'هزینه پروژه': 4000, 'پیشرفت پروژه': 2400, amt: 2400 },
  { name: 'اردیبهشت', 'هزینه پروژه': 3000, 'پیشرفت پروژه': 1398, amt: 2210 },
  { name: 'خرداد', 'هزینه پروژه': 2000, 'پیشرفت پروژه': 9800, amt: 2290 },
  { name: 'تیر', 'هزینه پروژه': 2780, 'پیشرفت پروژه': 3908, amt: 2000 },
  { name: 'مرداد', 'هزینه پروژه': 1890, 'پیشرفت پروژه': 4800, amt: 2181 },
];


export const MonitoringDashboard: React.FC = () => {
    const monitoringItems = [
        { title: "گزارش خودارزیابی مدیریت", icon: <Edit className="w-8 h-8 text-indigo-500"/>, description: "ثبت اقدامات انجام شده و ارزیابی توسط مدیر واحد." },
        { title: "گزارش بازخورد مدیریت", icon: <Users className="w-8 h-8 text-teal-500"/>, description: "ارزیابی شاخص‌های کیفی فرآیندهایی که در آنها ذینفع هستید." },
        { title: "گزارش شاخص‌های کلیدی PMO", icon: <BarChart3 className="w-8 h-8 text-orange-500"/>, description: "ارائه گزارش عملکرد به مدیرعامل جهت تصمیم‌گیری." },
    ];
    
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-700">داشبورد کنترل و بازخورد</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {monitoringItems.map((item, index) => (
                    <Card key={index} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                            {item.icon}
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">{item.description}</p>
                            <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                                ثبت گزارش
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <div className="mt-12">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center">
                           <Star className="ml-2 text-yellow-500"/> روند شاخص های کلیدی عملکرد
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={kpiData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={50} reversed={true} />
                                <YAxis yAxisId="left" orientation="right" />
                                <YAxis yAxisId="right" orientation="left" stroke="#82ca9d" />
                                <Tooltip contentStyle={{ direction: 'rtl', fontFamily: 'Vazirmatn' }} />
                                <Legend wrapperStyle={{ direction: 'rtl' }} />
                                <Bar yAxisId="left" dataKey="پیشرفت پروژه" fill="#8884d8" name="پیشرفت پروژه" />
                                <Bar yAxisId="right" dataKey="هزینه پروژه" fill="#82ca9d" name="هزینه پروژه (میلیون تومان)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
