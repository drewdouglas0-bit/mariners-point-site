"use client";

import Image from "next/image";
import { useState } from "react";

interface PartnerInstructorAvatarProps {
  name: string;
  initials: string;
  photo: string;
}

export function PartnerInstructorAvatar({
  name,
  initials,
  photo,
}: PartnerInstructorAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showPhoto = !!photo && !failed;

  return (
    <div className="mx-auto w-16 h-16 rounded-full overflow-hidden relative">
      <div className="absolute inset-0 bg-[#1c2b3a] flex items-center justify-center">
        <span className="text-gold font-semibold tracking-wider select-none">
          {initials}
        </span>
      </div>

      {showPhoto && (
        <Image
          src={photo}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
