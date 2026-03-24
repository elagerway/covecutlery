import { Star, MapPin, Shield, Award } from "lucide-react";

interface TrustItem {
  icon: React.ReactNode;
  label: string;
}

export default function TrustBar() {
  const items: TrustItem[] = [
    {
      icon: (
        <span className="flex items-center gap-0.5" aria-label="5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-current"
              style={{ color: "#D4A017" }}
            />
          ))}
        </span>
      ),
      label: "5-Star Google Rated",
    },
    {
      icon: <Award className="w-5 h-5 flex-shrink-0" style={{ color: "#D4A017" }} />,
      label: "6+ Years in Business",
    },
    {
      icon: <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: "#D4A017" }} />,
      label: "North Shore to Chilliwack",
    },
    {
      icon: <Shield className="w-5 h-5 flex-shrink-0" style={{ color: "#D4A017" }} />,
      label: "30-Day Sharpness Guarantee",
    },
  ];

  return (
    <div
      className="w-full py-5 px-6"
      style={{ backgroundColor: "#161B22", borderBottom: "1px solid #30363D" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Desktop: horizontal row with dividers */}
        <div className="hidden sm:flex items-center justify-center divide-x"
          style={{ "--tw-divide-opacity": "1" } as React.CSSProperties}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-8 first:pl-0 last:pr-0"
              style={{ borderColor: "#30363D" }}
            >
              {item.icon}
              <span
                className="text-sm font-medium whitespace-nowrap"
                style={{ color: "#FFFFFF" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 gap-4 sm:hidden">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-3 rounded-lg text-center"
              style={{ backgroundColor: "#0D1117" }}
            >
              {item.icon}
              <span
                className="text-xs font-medium leading-tight"
                style={{ color: "#FFFFFF" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
