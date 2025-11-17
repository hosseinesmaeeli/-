import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { PlusCircle, Trash2 } from 'lucide-react';

// Mock data moved outside to be used as initial state
const initialAgreementData = [
  {
    id: 1,
    missionCode: 'M-01',
    missionDescription: 'بهبود بهره‌وری ناوگان',
    goalCode: 'G-01-1',
    goalDescription: 'کاهش هزینه‌های تعمیر و نگهداری',
    management: 'مدیریت ماشین‌آلات',
    period: '1403 Q3',
    kpis: [
      { id: 101, name: 'شاخص هزینه کل به ازای هر کیلومتر', lowerBound: '15000', upperBound: '18000', resources: 'دسترسی به داده‌های مالی و پیمایش', prevPeriodValue: '19500' },
      { id: 102, name: 'شاخص زمان توقفات اضطراری', lowerBound: '5%', upperBound: '8%', resources: 'گزارشات تعمیرگاه', prevPeriodValue: '10%' },
    ]
  },
  {
    id: 2,
    missionCode: 'M-02',
    missionDescription: 'افزایش رضایت مشتری',
    goalCode: 'G-02-1',
    goalDescription: 'کاهش زمان پاسخگویی به شکایات',
    management: 'مدیریت کنترل پروژه',
    period: '1403 Q3',
    kpis: [
      { id: 201, name: 'شاخص میانگین زمان حل شکایت', lowerBound: '2 روز', upperBound: '4 روز', resources: 'سیستم CRM', prevPeriodValue: '5 روز' },
    ]
  },
];

interface Kpi {
    id: number;
    name: string;
    lowerBound: string;
    upperBound: string;
    resources: string;
    prevPeriodValue: string;
}

interface Agreement {
    id: number;
    missionCode: string;
    missionDescription: string;
    goalCode: string;
    goalDescription: string;
    management: string;
    period: string;
    kpis: Kpi[];
}

interface ManagerCeoAgreementProps {
  onClose: () => void;
}

export const ManagerCeoAgreement: React.FC<ManagerCeoAgreementProps> = ({ onClose }) => {
    const [agreements, setAgreements] = useState<Agreement[]>(initialAgreementData);
    const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(agreements.length > 0 ? agreements[0] : null);
    const [kpiData, setKpiData] = useState<Kpi[]>([]);

    useEffect(() => {
        if (selectedAgreement) {
            // Create a deep copy for editing to avoid mutating original mock data
            setKpiData(JSON.parse(JSON.stringify(selectedAgreement.kpis)));
        } else {
            setKpiData([]);
        }
    }, [selectedAgreement]);

    const handleSelectAgreement = (agreement: Agreement) => {
        setSelectedAgreement(agreement);
    };

    const handleAddAgreement = () => {
        const newId = agreements.length > 0 ? Math.max(...agreements.map(a => a.id)) + 1 : 1;
        const newAgreement: Agreement = {
            id: newId,
            missionCode: `M-${newId}`,
            missionDescription: 'شرح ماموریت جدید',
            goalCode: `G-${newId}-1`,
            goalDescription: 'شرح هدف جدید',
            management: 'مدیریت جدید',
            period: '1403 Q4',
            kpis: []
        };
        setAgreements(prev => [...prev, newAgreement]);
        setSelectedAgreement(newAgreement); // Auto-select the new agreement
    };
    
    const handleDeleteAgreement = (e: React.MouseEvent, agreementId: number) => {
        e.stopPropagation(); // Prevent row selection when deleting
        if (window.confirm('آیا از حذف این توافقنامه اطمینان دارید؟ این عمل قابل بازگشت نیست.')) {
            const newAgreements = agreements.filter(a => a.id !== agreementId);
            setAgreements(newAgreements);
    
            if (selectedAgreement?.id === agreementId) {
                setSelectedAgreement(newAgreements.length > 0 ? newAgreements[0] : null);
            }
        }
    };
    
    const handleAddKpi = () => {
        if (!selectedAgreement) return;
        const newKpi: Kpi = {
            id: Date.now(), // Use timestamp for a temporary unique key
            name: 'شاخص جدید',
            lowerBound: '',
            upperBound: '',
            resources: '',
            prevPeriodValue: 'ندارد'
        };
        setKpiData(prevKpis => [...prevKpis, newKpi]);
    };

    const handleDeleteKpi = (kpiId: number) => {
        setKpiData(prevKpis => prevKpis.filter(kpi => kpi.id !== kpiId));
    };

    const handleKpiChange = (kpiId: number, field: keyof Kpi, value: string) => {
        setKpiData(prevKpis => 
            prevKpis.map(kpi => 
                kpi.id === kpiId ? { ...kpi, [field]: value } : kpi
            )
        );
    };

    const handleSave = () => {
        if (!selectedAgreement) {
            alert('هیچ توافقنامه‌ای برای ذخیره انتخاب نشده است.');
            return;
        }
        // Update the main agreements list with the potentially modified kpiData
        const updatedAgreements = agreements.map(a => 
            a.id === selectedAgreement.id 
            ? { ...a, kpis: kpiData } 
            : a
        );
        setAgreements(updatedAgreements);
        // In a real app, you would now send `updatedAgreements` to your backend API
        console.log("Saving data:", updatedAgreements);
        alert("تغییرات با موفقیت ذخیره شد.");
        onClose();
    };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>توافقنامه مدیر و مدیرعامل (Master)</CardTitle>
           <button onClick={handleAddAgreement} className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <PlusCircle className="ml-2 h-5 w-5" />
                افزودن توافقنامه جدید
            </button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border border-gray-300">ردیف</th>
                  <th className="p-2 border border-gray-300">کد ماموریت</th>
                  <th className="p-2 border border-gray-300">شرح ماموریت</th>
                  <th className="p-2 border border-gray-300">کد هدف</th>
                  <th className="p-2 border border-gray-300">شرح هدف</th>
                  <th className="p-2 border border-gray-300">واحد/مدیریت</th>
                  <th className="p-2 border border-gray-300">دوره</th>
                  <th className="p-2 border border-gray-300">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {agreements.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`cursor-pointer transition-colors duration-200 hover:bg-blue-100 ${selectedAgreement?.id === item.id ? 'bg-blue-200' : 'bg-white'}`}
                    onClick={() => handleSelectAgreement(item)}
                  >
                    <td className="p-2 border border-gray-300">{index + 1}</td>
                    <td className="p-2 border border-gray-300">{item.missionCode}</td>
                    <td className="p-2 border border-gray-300">{item.missionDescription}</td>
                    <td className="p-2 border border-gray-300">{item.goalCode}</td>
                    <td className="p-2 border border-gray-300">{item.goalDescription}</td>
                    <td className="p-2 border border-gray-300">{item.management}</td>
                    <td className="p-2 border border-gray-300">{item.period}</td>
                    <td className="p-2 border border-gray-300 text-center">
                        <button onClick={(e) => handleDeleteAgreement(e, item.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 size={18} />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>شاخص‌های کلیدی عملکرد (Detail)</CardTitle>
          <button onClick={handleAddKpi} disabled={!selectedAgreement} className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                <PlusCircle className="ml-2 h-5 w-5" />
                افزودن شاخص جدید
            </button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-right border-collapse">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border border-gray-300">شاخص کلیدی</th>
                        <th className="p-2 border border-gray-300 w-24">حد پایین</th>
                        <th className="p-2 border border-gray-300 w-24">حد بالا</th>
                        <th className="p-2 border border-gray-300">منابع مورد نیاز</th>
                        <th className="p-2 border border-gray-300 w-36">مقدار دوره قبل</th>
                        <th className="p-2 border border-gray-300 w-20">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {kpiData.length > 0 ? kpiData.map(kpi => (
                         <tr key={kpi.id} className="bg-white">
                            <td className="p-1 border border-gray-300">
                                <input 
                                    type="text" 
                                    value={kpi.name}
                                    onChange={(e) => handleKpiChange(kpi.id, 'name', e.target.value)}
                                    className="w-full p-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </td>
                            <td className="p-1 border border-gray-300">
                                <input 
                                    type="text" 
                                    value={kpi.lowerBound}
                                    onChange={(e) => handleKpiChange(kpi.id, 'lowerBound', e.target.value)}
                                    className="w-full p-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </td>
                            <td className="p-1 border border-gray-300">
                                 <input 
                                    type="text" 
                                    value={kpi.upperBound}
                                    onChange={(e) => handleKpiChange(kpi.id, 'upperBound', e.target.value)}
                                    className="w-full p-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </td>
                            <td className="p-1 border border-gray-300">
                                <input 
                                    type="text" 
                                    value={kpi.resources}
                                    onChange={(e) => handleKpiChange(kpi.id, 'resources', e.target.value)}
                                    className="w-full p-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                                />
                            </td>
                            <td className="p-2 border border-gray-300 text-center bg-gray-100">{kpi.prevPeriodValue}</td>
                            <td className="p-2 border border-gray-300 text-center">
                                <button onClick={() => handleDeleteKpi(kpi.id)} className="text-red-500 hover:text-red-700 p-1">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="text-center p-4 border border-gray-300 text-gray-500">
                                {selectedAgreement ? 'هیچ شاخصی تعریف نشده است. برای افزودن از دکمه بالا استفاده کنید.' : 'لطفا یک توافقنامه از جدول بالا انتخاب کنید.'}
                            </td>
                        </tr>
                    )}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4 space-x-reverse pt-4">
        <button onClick={onClose} className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors">
            انصراف
        </button>
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            ذخیره تغییرات
        </button>
      </div>
    </div>
  );
};
