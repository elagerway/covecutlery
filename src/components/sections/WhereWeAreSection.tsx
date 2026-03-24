import { MapPin, Home } from "lucide-react";
import { getWeekSchedule } from "@/lib/calSchedule";
import ScheduleDayCard from "@/components/ScheduleDayCard";

export default async function WhereWeAreSection() {
  const days = await getWeekSchedule();

  return (
    <section
      id="schedule"
      className="py-16 px-6"
      style={{ backgroundColor: "#0D1117", borderTop: "1px solid #30363D" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ color: "#FFFFFF" }}
          >
            Where We&apos;ll{" "}
            <span style={{ color: "#D4A017" }}>Be This Week</span>
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: "#6B7280" }}>
            Our location updates automatically based on bookings. Find us near you.
          </p>
        </div>

        {/* 7-day strip */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 md:grid md:grid-cols-7 md:gap-3 min-w-max md:min-w-0">
            {days.map((day) => (
              <ScheduleDayCard key={day.date} day={day} />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-1.5">
            <MapPin size={12} style={{ color: "#D4A017" }} />
            <span className="text-xs" style={{ color: "#6B7280" }}>
              On the road
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Home size={12} style={{ color: "#6B7280" }} />
            <span className="text-xs" style={{ color: "#6B7280" }}>
              Home shop
            </span>
          </div>
        </div>

        {/* General note */}
        <p className="text-center text-xs mt-3" style={{ color: "#6B7280", opacity: 0.6 }}>
          Drop-off available 24/7 at the home shop regardless of schedule.
        </p>
      </div>
    </section>
  );
}
