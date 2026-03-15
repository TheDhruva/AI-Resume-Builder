import React from "react";

export default function PageContainer({
  children,
  className = "",
  width = "max-w-7xl",
  paddingY = "py-8",
  ...props
}) {
  return (
    <div
      className={`
        mx-auto
        ${width}
        px-4 sm:px-6 lg:px-8
        ${paddingY}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
