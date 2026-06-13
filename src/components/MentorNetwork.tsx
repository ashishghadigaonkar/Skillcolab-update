/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Mentor, MentorshipSession } from "../types";
import { 
  User, Star, Calendar, MessageSquare, Plus, Clock, ExternalLink, ShieldAlert, CreditCard 
} from "lucide-react";

export default function MentorNetwork() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [bookedSessions, setBookedSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingTopic, setBookingTopic] = useState("");
  const [selectedDaySlot, setSelectedDaySlot] = useState("");
  const [bookingDate, setBookingDate] = useState("2026-06-22");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Review states
  const [viewingReviewsMentor, setViewingReviewsMentor] = useState<Mentor | null>(null);

  useEffect(() => {
    fetchMentorsAndSessions();
  }, []);

  const fetchMentorsAndSessions = async () => {
    setLoading(true);
    try {
      const [resMents, resSess] = await Promise.all([
        fetch("/api/mentors"),
        fetch("/api/mentors/booked")
      ]);
      if (resMents.ok && resSess.ok) {
        const mentsData = await resMents.json();
        const sessData = await resSess.json();
        setMentors(mentsData);
        setBookedSessions(sessData);
      }
    } catch (e) {
      console.error("Failed to load mentors framework:", e);
    } finally {
      setLoading(false);
    }
  };

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
      console.error("Error booking consultation session:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-slate-100">
      {/* LEFT & CENTER: Mentors Search & Cards Roster */}
      <div className="lg:col-span-2 space-y-6">
        
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between text-slate-100">
          <div>
            <h4 className="text-md font-bold text-white leading-tight">Verified Alumni & Industry Mentors</h4>
            <p className="text-slate-400 text-xs">Connect with engineers, architects, and business officers from Google, Stripe, Meta, and more.</p>
          </div>
          <span className="px-2.5 py-1 bg-slate-950 border border-indigo-500/25 text-indigo-300 font-mono text-[10px] uppercase rounded-md font-bold tracking-wider">
            PRE-VENTED ALUMNI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((m) => (
            <div key={m.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all text-xs">
              
              <div className="space-y-3.5">
                {/* Header branding */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <img src={m.avatarUrl} alt={m.fullName} className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-800" />
                    <div>
                      <h4 className="text-sm font-extrabold text-white leading-snug">{m.fullName}</h4>
                      <p className="text-indigo-305 font-semibold text-[11px] leading-tight">{m.role}</p>
                      <p className="text-[10px] text-slate-500 mt-1">📍 {m.company || "University alumni network"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-850/60 px-1.5 py-0.5 rounded text-amber-400 font-bold font-mono text-[10px]">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" /> {m.rating}
                  </div>
                </div>

                {/* Expertise tags */}
                <div className="flex flex-wrap gap-1">
                  {m.expertise.map((exp, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-slate-950 border border-slate-850 rounded text-[10px] text-slate-300 font-medium">
                      {exp}
                    </span>
                  ))}
                </div>

                <p className="text-slate-450 leading-relaxed text-[11px] h-14 overflow-hidden text-ellipsis italic">
                  "{m.biography}"
                </p>

                <div className="flex justify-between items-center text-slate-400 font-mono text-[10px] pt-1.5 leading-none">
                  <span>💵 {m.pricing}</span>
                  <button 
                    onClick={() => setViewingReviewsMentor(m)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold cursor-pointer font-sans"
                  >
                    Read {m.reviewCount} reviews
                  </button>
                </div>
              </div>

              {/* Action trigger */}
              <button 
                onClick={() => setSelectedMentor(m)}
                className="w-full mt-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-705 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                Book Session <Calendar className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR: Upcoming Booked Sessions & Payment Ready details */}
      <div className="space-y-6">
        
        <div className="bg-slate-905 border border-slate-800 rounded-2xl p-6 shadow-xl bg-gradient-to-br from-slate-900 to-slate-950">
          <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-805 pb-3 mb-4">
            <Clock className="text-indigo-400" /> Booked Consultations
          </h3>

          <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {bookedSessions.map((sess) => (
              <div key={sess.id} className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-white block">{sess.topic}</span>
                    <span className="text-[9px] text-indigo-305 font-sans">Mentor: {sess.mentorName}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[9px] font-mono leading-none capitalize font-semibold">
                    {sess.status}
                  </span>
                </div>

                <p className="text-slate-450 text-[10px] font-mono">Date: {sess.date} @ {sess.timeSlot}</p>
                
                {sess.meetingLink && (
                  <a 
                    href={sess.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-1 px-2.5 bg-indigo-950/30 border border-indigo-900/30 text-indigo-300 text-[10px] font-bold rounded-md flex items-center justify-center gap-1 hover:bg-indigo-650 transition-colors w-full text-center mt-1"
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

        {/* Payments ready box architecture card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
          <div className="flex border-b border-slate-800/60 pb-2.5 mb-3 justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">Payments Integration</span>
            <CreditCard className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            SkillCollab acts as a marketplace. Free booking handles GDSC mentors, while commercial slots bridge using Stripe Connect. Direct API web endpoints are established under <code>/api/payment/*</code>.
          </p>
          <div className="mt-3.5 p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center gap-1.5 font-mono text-[9px] text-orange-400">
            🔒 STRIPE SANDBOX READY FOR CREDIT CAPTURES
          </div>
        </div>
      </div>

      {/* BOOK SESSION MODAL popup */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-slate-905 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-1.5 border-b border-slate-850 pb-3">
              <Calendar className="text-indigo-400 w-4.5 h-4.5" /> Reserve Technical Session
            </h3>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-2 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex justify-center items-center mx-auto">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-emerald-400">Session Scheduled!</h4>
                <p className="text-xs text-slate-400">Google Meet invitation has been generated. Check Booked Consultations.</p>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4 text-xs">
                <div className="flex gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <img src={selectedMentor.avatarUrl} alt={selectedMentor.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white leading-normal">{selectedMentor.fullName}</h4>
                    <p className="text-[10px] text-indigo-300 font-medium leading-none mt-0.5">{selectedMentor.role}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Consultation Topic</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Design review for StudyBuddy, interview CV prep" 
                    value={bookingTopic} 
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Session Date</label>
                    <input 
                      type="text" 
                      placeholder="2026-06-22" 
                      value={bookingDate} 
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Choose Available Slot</label>
                    <select 
                      value={selectedDaySlot} 
                      onChange={(e) => setSelectedDaySlot(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-350 focus:outline-none"
                      required
                    >
                      <option value="">-- Choose Slot --</option>
                      {selectedMentor.availability.map((day, dIdx) => (
                        day.slots.map((sl, sIdx) => (
                          <option key={`${dIdx}-${sIdx}`} value={`${day.day}: ${sl}`}>{day.day} @ {sl}</option>
                        ))
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-850">
                  <button 
                    type="button" 
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-850 text-slate-350 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Schedule Slot
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REVIEWS DRAWER / MODAL */}
      {viewingReviewsMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-1.5 border-b border-slate-850 pb-3">
              <MessageSquare className="text-indigo-400" /> Peer Reviews: {viewingReviewsMentor.fullName}
            </h3>

            <div className="space-y-4 py-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
              {viewingReviewsMentor.reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center leading-none">
                    <span className="font-bold text-white">{rev.reviewerName}</span>
                    <span className="text-amber-400 font-bold font-mono">★ {rev.rating}/5</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed italic">"{rev.comment}"</p>
                  <span className="text-[9px] text-slate-600 font-mono block text-right mt-1">Reviewed {rev.createdAt}</span>
                </div>
              ))}

              {viewingReviewsMentor.reviews.length === 0 && (
                <div className="text-center py-6 text-slate-500">No review ratings compiled yet. Be the first to book.</div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-850">
              <button 
                onClick={() => setViewingReviewsMentor(null)}
                className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Reviews Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
