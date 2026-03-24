"use client";

import { Check } from "lucide-react";

interface PricingTier {
  name: string;
  quantity: string;
  price: number;
  features: string[];
  featured?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Residential",
    quantity: "1–5 pieces",
    price: 12,
    features: [
      "Sharpen",
      "Hone",
      "Sanitize",
      "Sharpness Test",
      "30 Day Guarantee",
    ],
  },
  {
    name: "Home Pro",
    quantity: "6–20 pieces",
    price: 10,
    features: [
      "Sharpen",
      "Hone",
      "Sanitize",
      "Sharpness Test",
      "30 Day Guarantee",
    ],
    featured: true,
  },
  {
    name: "Commercial",
    quantity: "21+ pieces",
    price: 8,
    features: ["Sharpen", "Hone", "Sanitize", "Sharpness Test"],
  },
  {
    name: "Mobile Service",
    quantity: "5+ pieces",
    price: 12,
    features: [
      "Sharpen",
      "Hone",
      "Sanitize",
      "Sharpness Test",
      "30 Day Guarantee",
    ],
  },
];

const additionalServices = [
  { name: "Lawnmower Blades", price: "$20" },
  { name: "Serrated Cutlery Regrind", price: "$20" },
  { name: "Ceramic Knives", price: "$12" },
  { name: "Mandoline Blade", price: "$20" },
  { name: "Machete", price: "$30" },
  { name: "Small Garden Shears", price: "$12" },
  { name: "Large Garden Shears", price: "$20" },
  { name: "Bone Cleaver or Hatchet", price: "$20" },
  { name: "Axe", price: "$30" },
  { name: "Buffing – rust & tarnish removal", price: "$20" },
  { name: "Paper Trimmer/Guillotine", price: "$40" },
  { name: "Disassembly", price: "$20" },
  { name: "Shawarma/Rotary Blades", price: "$20" },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
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
            Simple, <span style={{ color: "#D4A017" }}>Transparent</span> Pricing
          </h2>
          <div
            className="mx-auto h-px w-16"
            style={{ backgroundColor: "#D4A017", opacity: 0.5 }}
          />
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="relative rounded-xl p-6 border flex flex-col"
              style={{
                backgroundColor: "#161B22",
                borderColor: tier.featured ? "#D4A017" : "#30363D",
                transform: tier.featured ? "scale(1.03)" : "scale(1)",
                boxShadow: tier.featured
                  ? "0 0 24px rgba(212,160,23,0.15)"
                  : "none",
              }}
            >
              {/* Most Popular Badge */}
              {tier.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
                  style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                >
                  Most Popular
                </div>
              )}

              {/* Tier Name */}
              <h3
                className="text-base font-semibold mb-1"
                style={{ color: tier.featured ? "#D4A017" : "#FFFFFF" }}
              >
                {tier.name}
              </h3>

              {/* Quantity label */}
              <p className="text-xs mb-4" style={{ color: "#6B7280" }}>
                {tier.quantity}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span
                  className="text-4xl font-bold"
                  style={{ color: "#FFFFFF" }}
                >
                  ${tier.price}
                </span>
                <span
                  className="text-sm ml-1"
                  style={{ color: "#6B7280" }}
                >
                  /cutlery
                </span>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2 mt-auto">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "#D4A017" }}
                    />
                    <span className="text-sm" style={{ color: "#FFFFFF" }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div
          className="rounded-xl p-8 border"
          style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
        >
          <h3
            className="text-xl font-semibold mb-6"
            style={{ color: "#FFFFFF" }}
          >
            Additional <span style={{ color: "#D4A017" }}>Services</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {additionalServices.map(({ name, price }) => (
              <div
                key={name}
                className="flex items-center justify-between py-2 border-b"
                style={{ borderColor: "#30363D" }}
              >
                <span className="text-sm" style={{ color: "#FFFFFF" }}>
                  {name}
                </span>
                <span
                  className="text-sm font-semibold ml-4 flex-shrink-0"
                  style={{ color: "#D4A017" }}
                >
                  {price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
