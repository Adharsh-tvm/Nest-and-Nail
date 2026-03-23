import React from "react";
import { ArrowRight, Info } from "lucide-react";

interface ServiceDetailsStepProps {
  title: string;
  description: string;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onNext: () => void;
}

export function ServiceDetailsStep({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onNext,
}: ServiceDetailsStepProps) {
  const isValid = title.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Service Details</h2>
        <p className="text-gray-500">Provide details about the work you need done.</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Broken Pipe Repair"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-gray-900"
          />
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe the issue, required materials, or specific instructions for the professional..."
            rows={5}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium text-gray-900 resize-none"
          />
        </div>

        <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
           <Info className="w-5 h-5 shrink-0 mt-0.5" />
           <p>The more details you provide, the better the professional can prepare for the job. Address and final pricing will be confirmed after booking.</p>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 group"
      >
        Continue to Summary
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
