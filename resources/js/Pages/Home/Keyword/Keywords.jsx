import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faSnowflake,
  faCar,
  faKitchenSet,
  faShirt,
  faVideo,
  faShieldHalved,
  faFaucet,
  faFire,
  faTv,
  faSatelliteDish,
  faShower,
  faSnowman,
  faBlender,
  faLeaf,
  faBed,
  faTable,
  faBroom,
  faElevator,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

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
    solid: "bg-white text-gray-900 dark:bg-gray-900 dark:text-white",
    soft: "bg-gray-100 text-gray-700 dark:bg-gray-800/70 dark:text-gray-200 ring-1 ring-inset ring-black/0",
    light: "bg-white text-gray-700 ring-1 ring-inset ring-black/0",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200",
  };

  const clickableBase =
    onKeywordClick
      ? "cursor-pointer transition-transform active:scale-[0.98] hover:shadow-sm"
      : "";

  const container = `flex flex-wrap items-center gap-2 ${className}`;

  // Map keywords to FontAwesome icons
  const ICON_MAP = {
    wifi: faWifi,
    "wi-fi": faWifi,
    internet: faWifi,
    aircon: faSnowflake,
    "air con": faSnowflake,
    "air conditioning": faSnowflake,
    parking: faCar,
    kitchen: faKitchenSet,
    laundry: faShirt,
    cctv: faVideo,
    security: faShieldHalved,
    water: faFaucet,
    heater: faFire,
    tv: faTv,
    cable: faSatelliteDish,
    shower: faShower,
    fridge: faSnowman,
    microwave: faBlender,
    balcony: faLeaf,
    bed: faBed,
    desk: faTable,
    cleaning: faBroom,
    elevator: faElevator,
    gym: faDumbbell,
  };

  const renderIcon = (label) => {
    if (!showIcons) return null;
    const key = ("" + label).trim().toLowerCase();
    const match = Object.keys(ICON_MAP).find((k) => key.includes(k));
    return match ? (
      <motion.span
        aria-hidden
        className="inline-block leading-none "
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <FontAwesomeIcon icon={ICON_MAP[match]} className="text-indigo-700" />
      </motion.span>
    ) : null;
  };

  const visible = useMemo(() => {
    if (!max || expanded) return items;
    return items.slice(0, max);
  }, [items, max, expanded]);

  const hiddenCount = items.length - visible.length;

  if (items.length === 0) return null;

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
