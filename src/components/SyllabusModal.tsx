import { X, Calendar, Clock, BookOpen, Check, ArrowRight } from 'lucide-react';
import type { Course } from '../types';

interface SyllabusModalProps {
  course: Course | null;
  onClose: () => void;
  onEnrollCourse: (courseName: string) => void;
}

export function SyllabusModal({ course, onClose, onEnrollCourse }: SyllabusModalProps) {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0F0F0F] border border-[#262626] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#181818] border border-[#2B2B2B] text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[#D2F865] bg-[#D2F865]/10 px-2.5 py-1 rounded-full border border-[#D2F865]/20">
              {course.topikLevel}
            </span>
            <span className="text-xs text-[#8E8E93]">{course.koreanTitle}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {course.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#8E8E93] mt-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#141414] border border-[#222222] text-xs mb-6">
          <div className="flex items-center gap-2 text-[#CCCCCC]">
            <Clock className="w-4 h-4 text-[#D2F865]" />
            <div>
              <span className="text-[10px] text-[#737373] block">Duration</span>
              <span className="font-semibold">{course.duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#CCCCCC]">
            <Calendar className="w-4 h-4 text-[#D2F865]" />
            <div>
              <span className="text-[10px] text-[#737373] block">Class Rhythm</span>
              <span className="font-semibold">{course.hoursPerWeek}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#CCCCCC] col-span-2 sm:col-span-1">
            <BookOpen className="w-4 h-4 text-[#D2F865]" />
            <div>
              <span className="text-[10px] text-[#737373] block">Class Size</span>
              <span className="font-semibold">Max 5 Students</span>
            </div>
          </div>
        </div>

        {/* Syllabus Breakdown */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Weekly Pedagogical Breakdown
          </h4>
          <div className="space-y-3">
            {course.syllabus.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#141414] border border-[#202020] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#D2F865] font-semibold w-16 shrink-0">
                    {item.week}
                  </span>
                  <span className="font-medium text-white">{item.topic}</span>
                </div>
                <div className="text-[11px] text-[#8E8E93] font-mono sm:text-right pl-7 sm:pl-0">
                  {item.grammar}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="mb-8">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
            Key Competencies & Milestones
          </h4>
          <div className="space-y-2">
            {course.outcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#9E9E9E]">
                <Check className="w-3.5 h-3.5 text-[#D2F865] shrink-0 mt-0.5" />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#1C1C1C]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#181818] text-xs font-medium text-[#8E8E93] hover:text-white border border-[#262626] cursor-pointer"
          >
            Close Overview
          </button>
          <button
            onClick={() => {
              onClose();
              onEnrollCourse(course.title);
            }}
            className="px-6 py-2.5 rounded-full bg-[#D2F865] hover:bg-[#c2e855] text-xs font-bold text-[#0A0A0A] flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Enroll in this Course</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
