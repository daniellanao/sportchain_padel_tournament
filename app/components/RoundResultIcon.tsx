"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

type RoundResultIconProps = {
  result: "W" | "L";
  className?: string;
};

export function RoundResultIcon({ result, className = "" }: RoundResultIconProps) {
  if (result === "W") {
    return (
      <FontAwesomeIcon
        icon={faCheck}
        className={`text-green-600 dark:text-green-400 ${className}`}
        aria-label="Victoria"
      />
    );
  }
  return (
    <FontAwesomeIcon
      icon={faXmark}
      className={`text-red-600 dark:text-red-400 ${className}`}
      aria-label="Derrota"
    />
  );
}
