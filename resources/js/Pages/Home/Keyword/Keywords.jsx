import React, { useMemo, useState } from "react";

/**
 * Keywords – display a list of amenity/feature keywords (e.g., "Aircon", "Wi‑Fi").
 *
 * Props:
 * - keywords: string[]                      // list of keywords to render
 * - className?: string                      // extra wrapper classes
 * - size?: "sm" | "md" | "lg"              // pill size (default: "md")
 * - variant?: "solid" | "soft" | "outline" // style variant (default: "soft")
 * - rounded?: "full" | "xl" | "lg"          // corner radius (default: "full")
 * - max?: number                            // show only first N; adds a "+X more" expander
 * - showIcons?: boolean                     // show built‑in emoji icons for common amenities (default: true)
 * - onKeywordClick?: (kw: string) => void   // click handler; makes pills clickable if provided
 * - dedupe?: boolean                        // remove duplicate keywords (default: true)
 *
 * Usage:
 *   <Keywords keywords={["Aircon", "Wi‑Fi", "Parking"]} />
 */
export default function Keywords({
  keywords = [],
  className = "",
  size = "md",
  variant = "soft",
  rounded = "full",
  max,
  showIcons = true,
  onKeywordClick,
  dedupe = true,
}) {
  const [expanded, setExpanded] = useState(false);

  const items = useMemo(() => {
    const arr = Array.isArray(keywords) ? keywords.filter(Boolean) : [];
    if (!dedupe) return arr;
    const seen = new Set();
    return arr.filter((k) => {
      const key = ("" + k).trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [keywords, dedupe]);

  const sizes = {
    sm: "text-[11px] px-2 py-1 gap-1",
    md: "text-xs px-2.5 py-1.5 gap-1.5",
    lg: "text-sm px-3 py-2 gap-2",
  };

  const radii = {
    full: "rounded-full",
    xl: "rounded-2xl",
    lg: "rounded-lg",
  };

  const variants = {
    solid: "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
    soft:
      "bg-gray-100 text-gray-700 dark:bg-gray-800/70 dark:text-gray-200 ring-1 ring-inset ring-black/0",
    outline:
      "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200",
  };

  const clickableBase =
    onKeywordClick ?
      "cursor-pointer transition-transform active:scale-[0.98] hover:shadow-sm" :
      "";

  const container = `flex flex-wrap items-center gap-2 ${className}`;

  const DEFAULT_ICONS = {
    "wi-fi": "📶",
    wifi: "📶",
    internet: "📶",
    aircon: "❄️",
    "air con": "❄️",
    "air conditioning": "❄️",
    parking: "🅿️",
    kitchen: "🍳",
    laundry: "🧺",
    cctv: "🎥",
    security: "🛡️",
    water: "🚰",
    heater: "🔥",
    tv: "📺",
    cable: "📡",
    shower: "🚿",
    fridge: "🧊",
    microwave: "🍲",
    balcony: "🌿",
    bed: "🛏️",
    desk: "🪑",
    cleaning: "🧹",
    elevator: "🛗",
    gym: "🏋️",
  };

  const renderIcon = (label) => {
    if (!showIcons) return null;
    const key = ("" + label).trim().toLowerCase();
    const match = Object.keys(DEFAULT_ICONS).find((k) => key.includes(k));
    return match ? (
      <span aria-hidden className="inline-block leading-none">
        {DEFAULT_ICONS[match]}
      </span>
    ) : null;
  };

  const visible = useMemo(() => {
    if (!max || expanded) return items;
    return items.slice(0, max);
  }, [items, max, expanded]);

  const hiddenCount = items.length - visible.length;

  if (items.length === 0) {
    return null; // nothing to render
  }

  return (
    <div className={container}>
      {visible.map((label, i) => (
        <span
          key={`${label}-${i}`}
          className={`inline-flex items-center ${sizes[size]} ${radii[rounded]} ${variants[variant]} ${clickableBase}`}
          role={onKeywordClick ? "button" : undefined}
          tabIndex={onKeywordClick ? 0 : undefined}
          onClick={() => onKeywordClick?.(String(label))}
          onKeyDown={(e) => {
            if (!onKeywordClick) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onKeywordClick(String(label));
            }
          }}
          aria-label={onKeywordClick ? `Keyword: ${label}` : undefined}
        >
          {renderIcon(label)}
          <span className="leading-none">{label}</span>
        </span>
      ))}

      {hiddenCount > 0 && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={`inline-flex items-center ${sizes[size]} ${radii[rounded]} ${variants[variant]} ${clickableBase}`}
          aria-expanded={expanded}
        >
          +{hiddenCount} more
        </button>
      )}

      {expanded && max && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className={`inline-flex items-center ${sizes[size]} ${radii[rounded]} ${variants[variant]} ${clickableBase}`}
          aria-expanded={expanded}
        >
          Show less
        </button>
      )}
    </div>
  );
}
