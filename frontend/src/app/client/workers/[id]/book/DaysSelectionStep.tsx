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
    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {categories && categories.length > 0 && (
        <div className="mb-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Service Type</h2>
            <p className="text-gray-500">What kind of service do you need?</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-5 py-3 rounded-full font-bold text-sm transition-all border-2 ${
                  selectedCategory === cat 
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm scale-105"
                    : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mb-8 border-t border-gray-100 pt-8 mt-4">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Duration</h2>
        <p className="text-gray-500">How many days do you need this professional for?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {options.map((num) => {
          const isSelected = selectedDays === num;
          return (
            <button
              key={num}
              onClick={() => onSelectDays(num)}
              className={`py-4 rounded-2xl border-2 font-bold text-lg transition-all active:scale-95 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-gray-100 bg-white text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50"
              }`}
            >
              {num} {num === 1 ? "Day" : "Days"}
            </button>
          );
        })}
      </div>

      <div className="text-center mb-8 border-t border-gray-100 pt-8 mt-4">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Team Size</h2>
        <p className="text-gray-500">How many workers are needed for this service?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {options.map((num) => {
          const isSelected = numberOfWorkers === num;
          return (
            <button
              key={`workers-${num}`}
              onClick={() => onSelectWorkers(num)}
              className={`py-4 rounded-2xl border-2 font-bold text-lg transition-all active:scale-95 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-gray-100 bg-white text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50"
              }`}
            >
              {num} {num === 1 ? "Worker" : "Workers"}
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
