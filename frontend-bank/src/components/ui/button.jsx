import React from "react";

export function Button({ children, variant, className = "", ...props }) {
  let baseClasses =
    "px-4 py-2 rounded text-white cursor-pointer transition-colors duration-200";

  if (variant === "secondary") {
    baseClasses = "px-4 py-2 rounded text-gray-700 bg-gray-300 cursor-pointer";
  } else {
    baseClasses = "px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 cursor-pointer";
  }

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}