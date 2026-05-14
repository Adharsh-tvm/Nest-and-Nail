import React from "react";
import { ArrowRight } from "lucide-react";

interface DaysSelectionStepProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedDays: number;
  onSelectDays: (days: number) => void;
  numberOfWorkers: number;
  onSelectWorkers: (workers: number) => void;
  onNext: () => void;
}

export function DaysSelectionStep({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedDays,
  onSelectDays,
  numberOfWorkers,
  onSelectWorkers,
  onNext,
}: DaysSelectionStepProps) {
  const options = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {categories && categories.length > 0 && (
        <div className="mb-4">
          <div className="text-center mb-3">
            <h2 className="text-lg font-black text-gray-900 mb-1">Service Type</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">What kind of service do you need?</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-full font-bold text-xs transition-all border-2 ${
                  selectedCategory === cat 
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mb-4 border-t border-gray-100 pt-4 mt-2">
        <h2 className="text-lg font-black text-gray-900 mb-1">Duration</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">How many days do you need this professional for?</p>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {options.map((num) => {
          const isSelected = selectedDays === num;
          return (
            <button
              key={num}
              onClick={() => onSelectDays(num)}
              className={`py-2.5 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-gray-100 bg-white text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <div className="text-center mb-4 border-t border-gray-100 pt-4 mt-2">
        <h2 className="text-lg font-black text-gray-900 mb-1">Team Size</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">How many workers are needed for this service?</p>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {options.map((num) => {
          const isSelected = numberOfWorkers === num;
          return (
            <button
              key={`workers-${num}`}
              onClick={() => onSelectWorkers(num)}
              className={`py-2.5 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-gray-100 bg-white text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={selectedDays === 0}
        className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 group"
      >
        Continue to Dates
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
