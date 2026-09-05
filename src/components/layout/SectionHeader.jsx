import React from "react";

export default function SectionHeader({
  title,
  subtitle,
  actions,
  className = "",
  ...props
}) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3 ${className}`}
      {...props}
    >
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
