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
      className={`flex flex-col md:flex-row md:items-center md:justify-between mb-8 ${className}`}
      {...props}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-text">
          {title}
        </h1>

        {subtitle && (
          <p className="text-brand-muted mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="mt-4 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
