
import React, { useState } from 'react';
import { FileCode, Target, BotMessageSquare } from 'lucide-react';
import { PlanningDashboard } from './components/Step1_Planning/PlanningDashboard';
import { MonitoringDashboard } from './components/Step2_Monitoring/MonitoringDashboard';
import { AnalysisDashboard } from './components/Step3_Analysis/AnalysisDashboard';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: 'گام اول: برنامه‌ریزی فصلی', icon: <FileCode className="ml-2" /> },
    { id: 2, name: 'گام دوم: کنترل و بازخورد', icon: <Target className="ml-2" /> },
    { id: 3, name: 'گام سوم: تحلیل و بهبود', icon: <BotMessageSquare className="ml-2" /> },
  ];

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return <PlanningDashboard />;
      case 2:
        return <MonitoringDashboard />;
      case 3:
        return <AnalysisDashboard />;
      default:
        return <PlanningDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">سامانه مدیریت عملکرد مارون</h1>
          <img src="https://picsum.photos/120/40" alt="Company Logo" className="rounded"/>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="flex justify-around items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center text-lg font-semibold p-3 rounded-lg transition-colors duration-300 ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-500 hover:bg-blue-100'
                  }`}
                >
                  {step.icon}
                  {step.name}
                </button>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="transition-opacity duration-500">
          {renderContent()}
        </div>
      </main>
      
      <footer className="text-center py-4 text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} شرکت مهندسین عمران مارون. تمام حقوق محفوظ است.
      </footer>
    </div>
  );
};

export default App;
