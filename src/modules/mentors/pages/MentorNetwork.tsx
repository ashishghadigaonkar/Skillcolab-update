/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Mentor, MentorshipSession } from "../../../types";
import { 
  User, Star, Calendar, MessageSquare, Plus, Clock, ExternalLink, ShieldAlert, CreditCard,
  ChevronLeft, ChevronRight, Check, AlertCircle, Info, MapPin, Sparkles, BookOpen
} from "lucide-react";

interface MentorNetworkProps {
  onViewProfile?: (userId: string) => void;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formatDateString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getDayNameFromDate = (date: Date) => {
  return DAYS_OF_WEEK[date.getDay()];
};

export default function MentorNetwork({ onViewProfile }: MentorNetworkProps = {}) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [bookedSessions, setBookedSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);

  // View switch: 'list' (List Roster) or 'calendar' (Master Interactive Board)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // --- MASTER CALENDAR STATES ---
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 5, 14)); // Defaults to June 14, 2026 to match simulated date
  const [selectedCalDate, setSelectedCalDate] = useState<Date | null>(new Date(2026, 5, 22)); // Default selected cell day: June 22, 2026
  const [calBookingTopic, setCalBookingTopic] = useState("");
  const [calSelectedMentorId, setCalSelectedMentorId] = useState<string | null>(null);
  const [calSelectedSlot, setCalSelectedSlot] = useState<string | null>(null);
  const [calBookingSuccess, setCalBookingSuccess] = useState(false);

  // --- LIST SYSTEM BOOKING MODAL STATES ---
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingTopic, setBookingTopic] = useState("");
  const [selectedDaySlot, setSelectedDaySlot] = useState("");
  const [bookingDate, setBookingDate] = useState("2026-06-22");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Modal mini calendar month navigation
  const [miniCalDate, setMiniCalDate] = useState<Date>(new Date(2026, 5, 14));

  // --- REVIEWS MODAL STATES ---
  const [viewingReviewsMentor, setViewingReviewsMentor] = useState<Mentor | null>(null);

  useEffect(() => {
    fetchMentorsAndSessions();
  }, []);

  const fetchMentorsAndSessions = async () => {
    setLoading(true);
    try {
      const [mentsData, sessData] = await Promise.all([
        fetch("/api/mentors").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/mentors/booked").then(r => r.ok ? r.json() : []).catch(() => [])
      ]);
      setMentors(mentsData);
      setBookedSessions(sessData);
    } catch (e) {
      console.error("Failed to load mentors framework:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- MASTER CALENDAR BOOKING FUNCTION ---
  const handleCalendarBook = async (mentor: Mentor) => {
    if (!selectedCalDate || !calSelectedSlot) return;
    const dateStr = formatDateString(selectedCalDate);

    try {
      const res = await fetch(`/api/mentors/${mentor.id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: calBookingTopic || "Technical mentorship sync",
          date: dateStr,
          timeSlot: calSelectedSlot
        })
      });

      if (res.ok) {
        setCalBookingSuccess(true);
        setTimeout(() => {
          setCalSelectedMentorId(null);
          setCalSelectedSlot(null);
          setCalBookingTopic("");
          setCalBookingSuccess(false);
          fetchMentorsAndSessions();
        }, 1500);
      }
    } catch (e) {
      console.error("Error booking technical consultation from calendar:", e);
    }
  };

  // --- MODAL LIST BOOKING FUNCTION ---
  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !selectedDaySlot) return;

    try {
      const res = await fetch(`/api/mentors/${selectedMentor.id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: bookingTopic || "General career roadmap consult",
          date: bookingDate,
          timeSlot: selectedDaySlot
        })
      });

      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          setSelectedMentor(null);
          setBookingTopic("");
          setSelectedDaySlot("");
          setBookingSuccess(false);
          fetchMentorsAndSessions();
        }, 1500);
      }
    } catch (e) {
      console.error("Error booking consultation session from modal framework:", e);
    }
  };

  // --- CALENDAR GRID GENERATOR UTILITY ---
  const generateCalendarCells = (viewedDate: Date) => {
    const year = viewedDate.getFullYear();
    const month = viewedDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells: { date: Date; isCurrentMonth: boolean; dayNum: number }[] = [];

    // Prior Month Padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      cells.push({
        date: new Date(year, month - 1, dayNum),
        isCurrentMonth: false,
        dayNum
      });
    }

    // Current Month days
    for (let i = 1; i <= totalDays; i++) {
      cells.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        dayNum: i
      });
    }

    // Successive Month Padding days to make grid standard 42 size
    const remainingDays = 42 - cells.length;
    for (let i = 1; i <= remainingDays; i++) {
      cells.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        dayNum: i
      });
    }

    return cells;
  };

  // Master calendar navigation handlers
  const handleMasterPrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleMasterNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const handleMasterResetToday = () => {
    const today = new Date(2026, 5, 14); // Locked mockup date representing current time coordinates
    setCalendarDate(today);
    setSelectedCalDate(new Date(2026, 5, 22)); // Reset to beautiful populated weekday cell template
  };

  // Modal mini calendar navigation
  const handleMiniPrevMonth = () => {
    setMiniCalDate(new Date(miniCalDate.getFullYear(), miniCalDate.getMonth() - 1, 1));
  };

  const handleMiniNextMonth = () => {
    setMiniCalDate(new Date(miniCalDate.getFullYear(), miniCalDate.getMonth() + 1, 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-52">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Generate cells for viewed months
  const masterCells = generateCalendarCells(calendarDate);

  return (
    <div className="space-y-6 font-sans text-slate-100">
      
      {/* 1. MASTER HEADER & VIEW MODE SELECTOR TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-850 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-white leading-tight flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Professional Mentorship Network
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Synchronize technical milestones, book real-time review calendars, and mock coding sessions.
          </p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "list"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Alumni Directory
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "calendar"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Interactive Scheduler
          </button>
        </div>
      </div>

      {/* --- RENDER VIEW 1: DIRECTORY ROSTER LIST --- */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main cards roster */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Verified Alumni & Industry Mentors</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Connect with systems architects, designers, and web leads from elite nodes.</p>
              </div>
              <span className="px-2.5 py-1 bg-slate-950 border border-indigo-500/25 text-indigo-300 font-mono text-[10px] uppercase rounded-md font-bold tracking-wider">
                Pre-vetting active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.map((m) => (
                <div key={m.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all text-xs">
                  
                  <div className="space-y-3.5">
                    {/* Header profile row */}
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <img 
                          onClick={() => onViewProfile && onViewProfile(m.userId || "mentor_nitin")}
                          src={m.avatarUrl} 
                          alt={m.fullName} 
                          className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-800 cursor-pointer hover:opacity-85 transition-opacity" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 
                            onClick={() => onViewProfile && onViewProfile(m.userId || "mentor_nitin")}
                            className="text-sm font-extrabold text-white leading-snug cursor-pointer hover:underline"
                          >
                            {m.fullName}
                          </h4>
                          <p className="text-indigo-300 font-semibold text-[11px] leading-tight">{m.role}</p>
                          <p className="text-[10px] text-slate-500 mt-1">📍 {m.company || "University alumni network"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-950 border border-slate-850/60 px-1.5 py-0.5 rounded text-amber-400 font-bold font-mono text-[10px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" /> {m.rating}
                      </div>
                    </div>

                    {/* Specialty tags */}
                    <div className="flex flex-wrap gap-1">
                      {m.expertise.map((exp, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-slate-950 border border-slate-850 rounded text-[10px] text-slate-300 font-medium">
                          {exp}
                        </span>
                      ))}
                    </div>

                    <p className="text-slate-400 leading-relaxed text-[11.5px] h-14 overflow-hidden text-ellipsis italic">
                      "{m.biography}"
                    </p>

                    <div className="flex justify-between items-center text-slate-450 font-mono text-[10px] pt-1.5 leading-none">
                      <span>💵 {m.pricing}</span>
                      <button 
                        onClick={() => setViewingReviewsMentor(m)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold cursor-pointer font-sans"
                      >
                        Read {m.reviewCount} reviews
                      </button>
                    </div>
                  </div>

                  {/* Booking trigger */}
                  <button 
                    onClick={() => {
                      setSelectedMentor(m);
                      setBookingDate("2026-06-22"); // default select mockup date
                      setSelectedDaySlot(""); // Reset
                      setMiniCalDate(new Date(2026, 5, 14)); // reset mini calendar month
                    }}
                    className="w-full mt-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    Schedule Consultation <Calendar className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar: List view */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl bg-gradient-to-br from-slate-900 to-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-850 pb-3 mb-4">
                <Clock className="text-indigo-400 w-4 h-4" /> Booked Consultations
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {bookedSessions.map((sess) => (
                  <div key={sess.id} className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2.5 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[11px] font-bold text-white block">{sess.topic}</span>
                        <span className="text-[9px] text-indigo-300 font-sans">Mentor: {sess.mentorName}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[9px] font-mono leading-none capitalize font-semibold">
                        {sess.status}
                      </span>
                    </div>

                    <div className="text-slate-400 text-[10px] font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{sess.date} @ {sess.timeSlot}</span>
                    </div>
                    
                    {sess.meetingLink && (
                      <a 
                        href={sess.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-1 px-2.5 bg-indigo-950/30 border border-indigo-900/30 text-indigo-300 text-[10px] font-bold rounded-md flex items-center justify-center gap-1 hover:bg-slate-800 hover:border-slate-750 transition-colors w-full text-center mt-1"
                      >
                        Enter Google Meet Room <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}

                {bookedSessions.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">No upcoming calls reserved.</div>
                )}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-400 space-y-2">
              <div className="flex border-b border-slate-850 pb-2.5 mb-1.5 justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Payments Integration</span>
                <CreditCard className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-[10px] leading-normal">
                SkillCollab handles commercial integration bridging transactions using Stripe Connect. Direct API routes process payment triggers via <code>/api/payment/*</code>.
              </p>
              <div className="pt-2">
                <div className="p-2 text-center rounded-lg bg-slate-950 border border-slate-850 font-mono text-[9px] text-orange-400">
                  🔒 STRIPE SANDBOX READY FOR SECURE CHECKS
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* --- RENDER VIEW 2: MASTER INTERACTIVE CALENDAR VIEW --- */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: MASTER CALENDAR MONTH MATRIX (column-span 7 or 8) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            
            {/* Calendar Controls & Title */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-850/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                  {MONTH_NAMES[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                </h3>
              </div>

              {/* Navigation arrows and Today */}
              <div className="flex items-center gap-1.5 self-center">
                <button
                  onClick={handleMasterPrevMonth}
                  className="p-1 px-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleMasterResetToday}
                  className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors"
                >
                  TODAY
                </button>
                <button
                  onClick={handleMasterNextMonth}
                  className="p-1 px-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Legend indicators */}
            <div className="flex gap-4 items-center pl-1 font-mono text-[9px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500/10 border border-indigo-500/40 block" /> Available slots active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/10 border border-emerald-500/50 block" /> Your booked sessions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 block" /> Current day (Today)
              </span>
            </div>

            {/* Calendar Grid container */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                <div key={dayName} className="text-center font-bold text-slate-400 font-mono text-[10px] pb-1 uppercase tracking-wide">
                  {dayName}
                </div>
              ))}

              {/* Grid Cells */}
              {masterCells.map((cell, idx) => {
                const cellDayName = getDayNameFromDate(cell.date);
                const cellDateStr = formatDateString(cell.date);
                
                // Fetch matches
                const availableMentors = mentors.filter((m) =>
                  m.availability.some((av) => av.day === cellDayName)
                );
                const dayBookings = bookedSessions.filter((s) => s.date === cellDateStr);
                const isSelectedCell = selectedCalDate && formatDateString(selectedCalDate) === cellDateStr;
                const isToday = formatDateString(new Date(2026, 5, 14)) === cellDateStr; // locked reference mock today
                const hasSlots = availableMentors.length > 0;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedCalDate(cell.date);
                      setCalSelectedMentorId(null);
                      setCalSelectedSlot(null);
                    }}
                    className={`aspect-square p-1.5 sm:p-2 ml-0 rounded-xl flex flex-col justify-between items-start border text-left transition-all relative cursor-pointer
                      ${cell.isCurrentMonth ? "bg-slate-950/40" : "bg-slate-950/10 opacity-30"}
                      ${isSelectedCell 
                        ? "border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500/30" 
                        : isToday 
                          ? "border-amber-400/40 bg-amber-400/5"
                          : hasSlots 
                            ? "border-indigo-950/60 bg-indigo-950/10"
                            : "border-slate-850/60"
                      }
                      ${dayBookings.length > 0 ? "bg-emerald-950/10 border-emerald-500/25" : ""}
                      hover:border-indigo-500 hover:bg-slate-900/40
                    `}
                  >
                    {/* Top Row: Date Number and dot signals */}
                    <div className="flex justify-between items-center w-full">
                      <span className={`font-mono text-xs font-bold leading-none ${isToday ? "text-amber-400" : "text-slate-300"}`}>
                        {cell.dayNum}
                      </span>
                      
                      {/* Dots */}
                      <div className="flex gap-1">
                        {dayBookings.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Sessions Booked" />
                        )}
                        {hasSlots && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" title="Mentors Available" />
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Desktop Descriptive Labels */}
                    <div className="hidden sm:block w-full mt-1.5 space-y-1">
                      {dayBookings.map((bk, bIdx) => (
                        <div key={bk.id} className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/10 px-1 py-0.5 rounded truncate font-medium max-w-full leading-none">
                          📅 {bk.mentorName.split(' ')[0]} @ {bk.timeSlot}
                        </div>
                      ))}

                      {hasSlots && dayBookings.length === 0 && (
                        <div className="text-[9px] bg-indigo-950/60 text-indigo-300 border border-indigo-500/10 px-1 py-0.5 rounded truncate font-medium leading-none">
                          👥 {availableMentors.length} Mentor{availableMentors.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-snug">
                Click any highlighted grid date cells to preview the alumni scheduled that day. Monday, Wed, Thursday, and Friday align active availability matrices.
              </p>
            </div>
          </div>


          {/* RIGHT: DETAILS PANEL FOR CLICKED CELL (column-span 5 or 4) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            
            {selectedCalDate ? (
              <div className="bg-slate-905 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                
                {/* Header detail */}
                <div className="border-b border-slate-850 pb-3">
                  <span className="text-[9px] font-mono text-indigo-300 tracking-widest uppercase font-bold">Selected Schedule Date</span>
                  <h3 className="text-md font-extrabold text-white leading-snug mt-0.5">
                    {getDayNameFromDate(selectedCalDate)}, {MONTH_NAMES[selectedCalDate.getMonth()]} {selectedCalDate.getDate()}
                  </h3>
                  <span className="text-[10px] text-slate-450 font-mono">Date String: {formatDateString(selectedCalDate)}</span>
                </div>

                {/* Section A: Existing Bookings on this Day */}
                {(() => {
                  const dateStr = formatDateString(selectedCalDate);
                  const dayBookings = bookedSessions.filter((s) => s.date === dateStr);
                  if (dayBookings.length === 0) return null;

                  return (
                    <div className="bg-emerald-950/10 border border-emerald-500/15 p-3 rounded-xl space-y-2.5">
                      <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                        Your Reserved Sessions ({dayBookings.length})
                      </span>
                      {dayBookings.map((b) => (
                        <div key={b.id} className="text-xs bg-slate-950 border border-slate-900 rounded-xl p-3 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-bold text-white text-[11px] leading-snug">{b.topic}</h4>
                              <p className="text-[9px] text-indigo-305 mt-0.5 font-medium">With {b.mentorName} @ {b.timeSlot}</p>
                            </div>
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[8px] font-mono capitalize">
                              {b.status}
                            </span>
                          </div>
                          {b.meetingLink && (
                            <a 
                              href={b.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-full text-center block text-[9.5px] py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/20 text-emerald-300 rounded-md transition-colors font-bold"
                            >
                              Join Meet Link <ExternalLink className="w-2.5 h-2.5 inline" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Section B: Available Alumni hours */}
                <div className="space-y-3">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block border-l-2 border-indigo-500 pl-1.5">
                    Available Alumni & Mentors
                  </span>

                  {(() => {
                    const weekday = getDayNameFromDate(selectedCalDate);
                    const matchingAlumni = mentors.filter((m) =>
                      m.availability.some((av) => av.day === weekday)
                    );

                    if (matchingAlumni.length === 0) {
                      return (
                        <div className="text-center py-8 bg-slate-950/30 border border-slate-850 p-4 rounded-xl text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
                          <ShieldAlert className="w-7 h-7 text-slate-600" />
                          <p className="max-w-xs leading-normal">
                            No scheduled mentoring hours have been added by alumni on {weekday}s. Look for highlighted cells on other weekdays.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                        {matchingAlumni.map((mentor) => {
                          const matchedAv = mentor.availability.find((av) => av.day === weekday);
                          const slots = matchedAv?.slots || [];
                          
                          return (
                            <div key={mentor.id} className="p-3.5 bg-slate-950 border border-slate-850/60 rounded-xl space-y-3">
                              
                              {/* Mentor summary row */}
                              <div className="flex gap-2.5 items-start">
                                <img 
                                  src={mentor.avatarUrl} 
                                  alt={mentor.fullName} 
                                  className="w-8 h-8 rounded-full object-cover border border-slate-800"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0">
                                  <h4 className="font-bold text-white leading-none text-xs">{mentor.fullName}</h4>
                                  <p className="text-[10px] text-indigo-305 mt-1 font-semibold truncate leading-none">{mentor.role}</p>
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className="text-[9px] text-amber-400 font-mono font-bold">★ {mentor.rating}</span>
                                    <span className="text-[9px] text-slate-500">• {mentor.pricing}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Available Slot Badge selectors */}
                              <div className="space-y-1.5">
                                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block">Select Hour Slot:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {slots.map((sl) => {
                                    const isSelectedSlot = calSelectedMentorId === mentor.id && calSelectedSlot === sl;
                                    return (
                                      <button
                                        key={sl}
                                        type="button"
                                        onClick={() => {
                                          setCalSelectedMentorId(mentor.id);
                                          setCalSelectedSlot(sl);
                                        }}
                                        className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer border ${
                                          isSelectedSlot
                                            ? "bg-indigo-600 text-white border-indigo-400"
                                            : "bg-slate-900 border-slate-850 text-indigo-300 hover:border-slate-700"
                                        }`}
                                      >
                                        {sl}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Inline booking expansion */}
                              {calSelectedMentorId === mentor.id && calSelectedSlot && (
                                <div className="space-y-3 pt-3 border-t border-slate-850/60 animate-fade-in text-[11px] leading-relaxed">
                                  <div className="space-y-1">
                                    <label className="block text-[8px] font-mono text-slate-405 uppercase tracking-wider">
                                      Agenda / Topic
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="e.g. StudyBuddy system diagram mock audit, resume review."
                                      value={calBookingTopic}
                                      onChange={(e) => setCalBookingTopic(e.target.value)}
                                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                                      required
                                    />
                                  </div>

                                  {calBookingSuccess ? (
                                    <div className="bg-emerald-950/20 border border-emerald-500/25 text-emerald-400 p-2 text-center rounded-lg text-[10px] font-medium leading-normal animate-pulse">
                                      ✓ Consultation Confirmed! Google Meet generated.
                                    </div>
                                  ) : (
                                    <div className="flex gap-1.5 pt-0.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCalSelectedMentorId(null);
                                          setCalSelectedSlot(null);
                                        }}
                                        className="w-1/3 py-1 bg-slate-905 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleCalendarBook(mentor)}
                                        disabled={!calBookingTopic}
                                        className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Reserve {calSelectedSlot} Slot
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 py-12 flex flex-col items-center space-y-2">
                <Calendar className="w-8 h-8 text-slate-600" />
                <p className="text-xs max-w-xs leading-normal">
                  Select any active grid cells in the schedule calendar to view availability hours and book technically specialized sessions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}


      {/* 2. THE COMPACT INDIVIDUAL MENTOR BOOKING MODAL WITH INLINE MINI CALENDAR */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-5 text-slate-100 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Modal Title bar */}
            <h3 className="text-[15px] font-extrabold text-white pb-3 border-b border-slate-850 flex items-center gap-2">
              <Calendar className="text-indigo-400 w-4.5 h-4.5 shrink-0" /> Reserve Technical Session
            </h3>

            {bookingSuccess ? (
              <div className="text-center py-8 space-y-2.5 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex justify-center items-center mx-auto">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-emerald-400">Consultation Booked!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  A Google Meet invitation room link is generated. Preview details under Booked Consultations.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4 text-xs mt-3">
                
                {/* Profile card snap */}
                <div className="flex gap-2.5 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <img src={selectedMentor.avatarUrl} alt={selectedMentor.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-white leading-none text-xs">{selectedMentor.fullName}</h4>
                    <p className="text-[10px] text-indigo-300 font-medium mt-1 leading-none">{selectedMentor.role}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 font-mono text-[9px] text-slate-500 leading-none">
                      <span>★ {selectedMentor.rating}</span>
                      <span>• {selectedMentor.pricing}</span>
                    </div>
                  </div>
                </div>

                {/* Consultation Topic topic */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                    Session Agenda Topic
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mock system diagram overview, interview prep, design help." 
                    value={bookingTopic} 
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* INTERACTIVE COMPACT MINI CALENDAR SLOTS PICKOR */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-3">
                  
                  {/* Mini month selector bar */}
                  <div className="flex justify-between items-center bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800">
                    <span className="font-bold text-white text-[10px] uppercase font-mono tracking-wider">
                      {MONTH_NAMES[miniCalDate.getMonth()]} {miniCalDate.getFullYear()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleMiniPrevMonth}
                        className="p-0.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-md text-[10px] cursor-pointer"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={handleMiniNextMonth}
                        className="p-0.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded-md text-[10px] cursor-pointer"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  {/* Compact Week headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-slate-500 font-mono text-[8px] uppercase tracking-wide">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(h => <span key={h}>{h}</span>)}
                  </div>

                  {/* Cell grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarCells(miniCalDate).map((cell, cIdx) => {
                      const cellDayName = getDayNameFromDate(cell.date);
                      const isAvailableDay = selectedMentor.availability.some(av => av.day === cellDayName);
                      const cellDateStr = formatDateString(cell.date);
                      const isSelectedMini = bookingDate === cellDateStr;
                      const isMiniToday = formatDateString(new Date(2026, 5, 14)) === cellDateStr;

                      return (
                        <button
                          key={cIdx}
                          type="button"
                          disabled={!isAvailableDay}
                          onClick={() => {
                            setBookingDate(cellDateStr);
                            setSelectedDaySlot(""); // Reset
                          }}
                          className={`aspect-square p-1 rounded-md text-[10px] font-bold font-mono transition-all flex flex-col items-center justify-center relative
                            ${cell.isCurrentMonth ? "" : "opacity-20"}
                            ${isAvailableDay 
                              ? isSelectedMini 
                                ? "bg-indigo-600 text-white border border-indigo-400 cursor-pointer shadow"
                                : isMiniToday 
                                  ? "border border-amber-400/40 bg-indigo-950/30 text-indigo-200 cursor-pointer"
                                  : "border border-indigo-500/15 bg-indigo-950/20 text-indigo-300 hover:bg-indigo-900/30 hover:border-indigo-500/40 cursor-pointer"
                              : "text-slate-650 bg-transparent border-transparent cursor-not-allowed opacity-15"
                            }
                          `}
                        >
                          <span>{cell.dayNum}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mini-prompt availability label */}
                  <div className="text-[9px] text-slate-550 italic font-mono uppercase text-center mt-1">
                     💡 Selected Mentor available on: {selectedMentor.availability.map(av => av.day).join(", ")}s
                  </div>
                </div>

                {/* Render Slot Selector Badge Chips below mini calendar on date selection matches */}
                {bookingDate && (() => {
                  const matchDayName = getDayNameFromDate(new Date(bookingDate));
                  const matchAv = selectedMentor.availability.find(av => av.day === matchDayName);
                  const slots = matchAv ? matchAv.slots : [];

                  return (
                    <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                        Available slots on {matchDayName} ({bookingDate})
                      </label>
                      
                      {slots.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-1.5">
                          {slots.map((sl) => {
                            const value = `${matchDayName}: ${sl}`;
                            const isSelected = selectedDaySlot === value;

                            return (
                              <button
                                key={sl}
                                type="button"
                                onClick={() => setSelectedDaySlot(value)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer border transition-all ${
                                  isSelected
                                    ? "bg-indigo-600 border-indigo-400 text-white shadow-md font-bold"
                                    : "bg-slate-900 border-slate-850 hover:border-slate-700 text-indigo-300"
                                }`}
                              >
                                {sl}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500 italic py-1 bg-slate-900/30 rounded text-center">
                          Select one of the highlighted weekday slots on the map.
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* CTA operations bar */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-850">
                  <button 
                    type="button" 
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-850 text-slate-400 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={!selectedDaySlot}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Schedule Session
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}


      {/* 3. PEER REVIEWS MODAL */}
      {viewingReviewsMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5 border-b border-slate-850 pb-3">
              <MessageSquare className="text-indigo-400 w-4 h-4" /> Peer Reviews: {viewingReviewsMentor.fullName}
            </h3>

            <div className="space-y-4 py-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
              {viewingReviewsMentor.reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-950 border border-slate-850/60 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center leading-none">
                    <span className="font-bold text-white">{rev.reviewerName}</span>
                    <span className="text-amber-400 font-bold font-mono">★ {rev.rating}/5</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed italic">"{rev.comment}"</p>
                  <span className="text-[9px] text-slate-650 font-mono block text-right mt-1">Reviewed {rev.createdAt}</span>
                </div>
              ))}

              {viewingReviewsMentor.reviews.length === 0 && (
                <div className="text-center py-6 text-slate-500">No review ratings compiled yet. Be the first to book.</div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-850">
              <button 
                onClick={() => setViewingReviewsMentor(null)}
                className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Reviews
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
