import React, { useContext } from "react";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  className = "",
  required = false,
  placeholder = "",
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="text-sm font-medium text-foreground block mb-1.5"
      >
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        className="field-input"
        autoComplete="on"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function PersonalDetail() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const details = resumeInfo?.personalDetails || {};

  const onChange = (e) => {
    const { name, value } = e.target;
    setResumeInfo((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [name]: value,
      },
    }));
  };

  return (
    <div className="editor-panel">
      <h2 className="editor-panel-title">Basics</h2>
      <p className="editor-panel-desc">
        Contact details appear at the top of your resume. Location can be city
        or region — no full street address required.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        <Field
          label="First name"
          name="firstName"
          value={details.firstName}
          onChange={onChange}
          required
        />
        <Field
          label="Last name"
          name="lastName"
          value={details.lastName}
          onChange={onChange}
          required
        />
        <Field
          label="Headline / job title"
          name="jobTitle"
          value={details.jobTitle}
          onChange={onChange}
          className="sm:col-span-2"
          placeholder="Software Engineer"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={details.email}
          onChange={onChange}
          required
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          value={details.phone}
          onChange={onChange}
        />
        <Field
          label="Location"
          name="address"
          value={details.address}
          onChange={onChange}
          className="sm:col-span-2"
          placeholder="City, Country"
        />
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground">Online presence</h3>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          Optional links for recruiters (shown on the resume when filled).
        </p>
        <div className="grid grid-cols-1 gap-4">
          <Field
            label="LinkedIn"
            name="linkedin"
            type="url"
            value={details.linkedin}
            onChange={onChange}
            placeholder="https://linkedin.com/in/..."
          />
          <Field
            label="GitHub"
            name="github"
            type="url"
            value={details.github}
            onChange={onChange}
            placeholder="https://github.com/..."
          />
          <Field
            label="Portfolio"
            name="portfolio"
            type="url"
            value={details.portfolio}
            onChange={onChange}
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
}
