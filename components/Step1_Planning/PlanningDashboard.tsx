import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ClipboardList, Briefcase, Network, Layers, ArrowLeft } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ManagerCeoAgreement } from './ManagerCeoAgreement';


export const PlanningDashboard: React.FC = () => {
    const [isAgreementModalOpen, setAgreementModalOpen] = useState(false);

    const planningItems = [
        { id: "strategy", title: "بیانیه استراتژی", icon: <ClipboardList className="w-8 h-8 text-blue-500"/>, description: "تعریف ماموریت و اهداف کلان واحدها." },
        { id: "kpi", title: "شاخص‌های کلیدی عملکرد (KPI)", icon: <Layers className="w-8 h-8 text-green-500"/>, description: "مشخص کردن شاخص‌ها و نحوه محاسبه آنها." },
        { id: "processes", title: "فرآیندها و شاخص‌های کیفی", icon: <Network className="w-8 h-8 text-purple-500"/>, description: "طراحی و تصویب فرآیندهای مرتبط با اهداف." },
        { id: "manager-ceo", title: "توافقنامه مدیر و مدیرعامل", icon: <Briefcase className="w-8 h-8 text-red-500"/>, description: "تعیین حدود قابل قبول برای هر شاخص کلیدی." },
        { id: "manager-personnel", title: "توافقنامه مدیر و پرسنل", icon: <Briefcase className="w-8 h-8 text-yellow-500"/>, description: "تخصیص متولیان برای فرآیندها و ارزیابی." },
    ];

    const handleCardButtonClick = (id: string) => {
        if (id === "manager-ceo") {
            setAgreementModalOpen(true);
        } else {
            // Handle other cards clicks if needed
            alert(`دکمه مربوط به '${planningItems.find(item => item.id === id)?.title}' کلیک شد.`);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-700">داشبورد برنامه‌ریزی</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {planningItems.map((item) => (
                     <Card key={item.id} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                            {item.icon}
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                            <p className="text-gray-600 mb-4">{item.description}</p>
                            <button 
                                onClick={() => handleCardButtonClick(item.id)}
                                className="mt-auto w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                            >
                                مشاهده و ویرایش
                                <ArrowLeft className="mr-2 h-4 w-4"/>
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Modal 
                isOpen={isAgreementModalOpen} 
                onClose={() => setAgreementModalOpen(false)}
                title="ثبت / ویرایش توافقنامه مدیر و مدیرعامل"
            >
                <ManagerCeoAgreement onClose={() => setAgreementModalOpen(false)} />
            </Modal>
        </div>
    );
};
