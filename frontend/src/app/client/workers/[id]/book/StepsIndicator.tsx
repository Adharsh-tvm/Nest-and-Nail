import { Calendar, CheckCircle2, ChevronRight, Contact2, MapPin } from "lucide-react";

export function StepsIndicator({ currentStep, numberOfDays }: { currentStep: number, numberOfDays: number }) {
  let steps = [
    { num: 1, label: "Days", icon: Calendar },
    { num: 2, label: "Dates", icon: Calendar },
    { num: 3, label: "Location", icon: MapPin },
    { num: 4, label: "Details", icon: Contact2 },
    { num: 5, label: "Confirm", icon: CheckCircle2 },
  ];

  // Find the exact index or snap to the highest completed step before it
  let currentIndex = steps.findIndex(s => s.num === currentStep);
  if (currentIndex === -1) {
    currentIndex = steps.findIndex(s => s.num > currentStep);
    if (currentIndex === -1) currentIndex = steps.length - 1;
    else currentIndex = Math.max(0, currentIndex - 1);
  }

  return (
    <div className="w-full mb-8 pt-4">
      <div className="flex items-center justify-between relative px-2 sm:px-4">
        {/* Background Line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full z-0 hidden sm:block" />

        {/* Active Line Fill */}
        <div
          className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-500 ease-in-out hidden sm:block"
          style={{ width: steps.length > 1 ? `calc(${(currentIndex) * (100 / (steps.length - 1))}% - 2rem)` : '0' }}
        />

        {steps.map((step, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center gap-2">
              {/* Circle */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md scale-110"
                    : isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : (idx + 1)}
              </div>
              
              {/* Label */}
              <span
                className={`text-xs sm:text-sm font-semibold transition-colors duration-300 hidden sm:block ${
                  isActive ? "text-emerald-700" : isCompleted ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Mobile only active step text */}
      <div className="mt-4 text-center sm:hidden font-bold text-gray-800">
         Step {currentIndex + 1} of {steps.length}: {steps[currentIndex]?.label}
      </div>
    </div>
  );
}
