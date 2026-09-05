import React from "react";

export default function Card({
  children,
  className = "",
  hover = false,
  ...props
}) {
  return (
    <div
      className={`
        bg-white
        border border-border
        rounded-lg
        shadow-sm
        transition-shadow
        ${hover ? "hover:shadow-md" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
