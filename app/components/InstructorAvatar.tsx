"use client";

import { useState } from "react";

const sizes = {
  sm: { outer: "w-16 h-16", text: "text-base" },
  md: { outer: "w-20 h-20", text: "text-xl" },
  lg: { outer: "w-28 h-28", text: "text-2xl" },
  xl: { outer: "w-36 h-36", text: "text-3xl" },
} as const;

interface Props {
  photo?: string;       // filename in /public, e.g. "joby-2020.jpg"
  name: string;
  initials: string;
  size?: keyof typeof sizes;
}

export function InstructorAvatar({ photo, name, initials, size = "md" }: Props) {
  const [failed, setFailed] = useState(false);
  const { outer, text } = sizes[size];
  const showPhoto = photo && !failed;

  return (
    <div className={`${outer} rounded-full flex-shrink-0 overflow-hidden relative`}>
      {/* Initials layer — always present, photo sits on top when available */}
      <div className="absolute inset-0 bg-[#1c2b3a] flex items-center justify-center">
        <span className={`${text} font-semibold text-gold tracking-wider select-none`}>
          {initials}
        </span>
      </div>

      {showPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/${photo}`}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
