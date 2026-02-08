"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function Input({ label, type = "text", placeholder, id, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
        {...props}
      />
    </div>
  );
}

export function PasswordInput({ label = "Password", id, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="w-full rounded-lg border border-stone-200 px-4 py-2.5 pr-10 text-sm outline-none transition-all placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
          placeholder="Enter your password"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export function AuthCard({ children }) {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-stone-100">
      {children}
    </div>
  );
}

export function SocialButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white py-2.5 text-sm font-medium text-stone-700 transition-all hover:bg-stone-50 hover:border-stone-300 focus:outline-none focus:ring-4 focus:ring-stone-100"
    >
      {Icon && <Icon size={18} />}
      {label}
    </button>
  );
}

export function NameFields({ firstName, setFirstName, lastName, setLastName }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Input
        id="firstName"
        label="First name"
        placeholder="John"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <Input
        id="lastName"
        label="Last name (optional)"
        placeholder="Doe"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
    </div>
  );
}

function getStrength(password) {
  if (password.length < 8) return "weak";
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return "strong";
  return "medium";
}

export function PasswordStrength({ password, setPassword }) {
  const strength = getStrength(password);

  const color =
    strength === "strong"
      ? "bg-green-500"
      : strength === "medium"
        ? "bg-yellow-500"
        : "bg-red-500";

  const width =
    strength === "strong"
      ? "w-full"
      : strength === "medium"
        ? "w-2/3"
        : "w-1/3";

  return (
    <div className="flex flex-col gap-1.5">
      <PasswordInput
        id="password-strength"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Minimum 8 characters"
      />

      <div className="h-1 w-full rounded-full bg-stone-100 overflow-hidden mt-1">
        <div
          className={`h-full rounded-full ${color} ${width} transition-all duration-300`}
        />
      </div>

      <div className="flex justify-between items-center px-1">
        <p className="text-xs text-stone-500">
          Strength:{" "}
          <span className="capitalize font-medium text-stone-700">
            {strength}
          </span>
        </p>
        <div className="flex gap-3 text-[10px] text-stone-400">
          <span className={password.length >= 8 ? "text-green-600" : ""}>
            8+ chars
          </span>
          <span className={/[0-9]/.test(password) ? "text-green-600" : ""}>
            Number
          </span>
          <span
            className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}
          >
            Symbol
          </span>
        </div>
      </div>
    </div>
  );
}
