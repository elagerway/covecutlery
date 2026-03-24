"use client";

import { Clock, Scissors, Star, Truck, Shield, Lock } from "lucide-react";

const services = [
  {
    title: "1 Hour Turnaround",
    icon: Clock,
    desc: "Quick drop-off turnaround service. Back in action within an hour by appointment.",
  },
  {
    title: "Ceramic & Serrated",
    icon: Scissors,
    desc: "3-step diamond grinding for ceramics. Diamond-infused wheel for serrated blades.",
  },
  {
    title: "Special Events",
    icon: Star,
    desc: "We bring sharpening to your market, block party, or business event.",
  },
  {
    title: "Mobile Service",
    icon: Truck,
    desc: "We come to you. Minimum 5 pieces. Servicing North Shore to Chilliwack.",
  },
  {
    title: "30 Day Guarantee",
    icon: Shield,
    desc: "Blades retain edge for 30 days or we fix them at no charge.",
  },
  {
    title: "Secure Drop Box",
    icon: Lock,
    desc: "24/7 secure drop box. Next-day pickup. Text for the code.",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="py-20 px-6"
      style={{ backgroundColor: "#0D1117" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "#FFFFFF" }}
          >
            What We <span style={{ color: "#D4A017" }}>Offer</span>
          </h2>
          <div
            className="mx-auto h-px w-16"
            style={{ backgroundColor: "#D4A017", opacity: 0.5 }}
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ title, icon: Icon, desc }) => (
            <div
              key={title}
              className="group rounded-xl p-6 border transition-all duration-200 cursor-default"
              style={{
                backgroundColor: "#161B22",
                borderColor: "#30363D",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "#D4A017";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "#30363D";
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-5"
                style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
              >
                <Icon className="w-6 h-6" style={{ color: "#D4A017" }} />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "#FFFFFF" }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
