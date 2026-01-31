"use client";

import { TypeAnimation } from "react-type-animation";

export function TypingUsername() {
  return (
    <TypeAnimation
      sequence={[
        "yourname", 2000,
        "johndoe", 2000,
        "sarah", 2000,
        "alex.design", 2000,
        "mike-dev", 2000,
        "emma", 2000,
        "creator", 2000,
      ]}
      wrapper="span"
      speed={20}
      deletionSpeed={35}
      repeat={Infinity}
      className="text-primary font-semibold"
    />
  );
}
