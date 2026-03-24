"use client";

import { MapPin, Home } from "lucide-react";
import { useBooking } from "@/components/BookingProvider";
import type { DaySchedule } from "@/lib/calSchedule";

const HOME_CITY = "North Vancouver";

export default function ScheduleDayCard({ day }: { day: DaySchedule }) {
  const { openWithDate } = useBooking();
  const hasBookings = day.cities.length > 0;
  const isHome = !hasBookings;

  return (
    <div className="flex-shrink-0 flex flex-col min-w-[110px] w-full">
      {/* Book Mobile tab */}
      <div className="flex justify-center mb-1">
        <span
          className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm"
          style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
        >
          Book Mobile
        </span>
      </div>

    <button
      onClick={() => openWithDate(day.date)}
      className="flex flex-col items-center gap-2 rounded-xl px-4 py-5 border w-full text-left transition-all duration-200 hover:brightness-110 active:scale-95 cursor-pointer"
      style={{
        backgroundColor: day.isToday ? "rgba(212,160,23,0.08)" : "#161B22",
        borderColor: day.isToday ? "#D4A017" : "#30363D",
        borderWidth: day.isToday ? 2 : 1,
      }}
    >
      {/* Day + date */}
      <div className="text-center">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: day.isToday ? "#D4A017" : "#6B7280" }}
        >
          {day.dayLabel}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
          {day.dateLabel}
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ backgroundColor: "#30363D" }} />

      {/* Location */}
      <div className="flex flex-col items-center gap-1 text-center">
        {isHome ? (
          <>
            <Home size={14} style={{ color: "#6B7280" }} />
            <p className="text-xs leading-tight" style={{ color: "#6B7280" }}>
              Home Shop
            </p>
            <p className="text-xs" style={{ color: "#6B7280", opacity: 0.6 }}>
              {HOME_CITY}
            </p>
          </>
        ) : (
          <>
            <MapPin size={14} style={{ color: "#D4A017" }} />
            {day.cities.map((city) => (
              <p
                key={city}
                className="text-xs font-semibold leading-tight"
                style={{ color: "#FFFFFF" }}
              >
                {city}
              </p>
            ))}
          </>
        )}
      </div>
    </button>
    </div>
  );
}
