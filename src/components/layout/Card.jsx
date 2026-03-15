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
        border border-brand-border
        rounded-xl
        shadow-sm
        transition-all
        ${hover ? "hover:shadow-md" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
