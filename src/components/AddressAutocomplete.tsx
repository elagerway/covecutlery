"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";

type Suggestion = {
  place_id: string;
  description: string;
};

type Props = {
  id?: string;
  label: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  onChange: (address: string, validated: boolean) => void;
};

const inputClass =
  "w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#6B7280] border outline-none transition-all duration-200 focus:border-[#D4A017]";
const inputStyle = {
  backgroundColor: "#161B22",
  borderColor: "#30363D",
  color: "#FFFFFF",
};
const labelClass = "block text-xs font-medium uppercase tracking-wide mb-1.5";
const labelStyle = { color: "#6B7280" };

export default function AddressAutocomplete({
  id = "address",
  label,
  value,
  required = false,
  placeholder = "Start typing your address...",
  onChange,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInput(input: string) {
    // User is editing — current value is no longer a validated autocomplete pick
    onChange(input, false);
    setShowSuggestions(true);
    if (debounce.current) clearTimeout(debounce.current);
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(input)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }

  async function handlePick(s: Suggestion) {
    // Confirm the place exists by fetching details (proves it's a real Google Places entry)
    setShowSuggestions(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode?place_id=${encodeURIComponent(s.place_id)}`);
      const data = await res.json();
      if (data && data.geometry) {
        onChange(s.description, true);
      } else {
        // Fallback — accept the description but mark unvalidated
        onChange(s.description, false);
      }
    } catch {
      onChange(s.description, false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <label htmlFor={id} className={labelClass} style={labelStyle}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type="text"
          required={required}
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => value.length >= 3 && setShowSuggestions(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={inputClass}
          style={inputStyle}
        />
        {loading && (
          <Loader2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin"
            style={{ color: "#6B7280" }}
          />
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="absolute z-20 left-0 right-0 mt-1 rounded-lg border max-h-72 overflow-y-auto shadow-xl"
          style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
        >
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                onClick={() => handlePick(s)}
                className="w-full text-left px-4 py-3 text-sm flex items-start gap-2 hover:bg-[#161B22] transition-colors"
                style={{ color: "#9CA3AF" }}
              >
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#D4A017" }} />
                <span>{s.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs mt-1.5" style={{ color: "#6B7280" }}>
        Pick from the suggestions to confirm a real, validated address.
      </p>
    </div>
  );
}
