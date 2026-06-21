"use client"

import * as React from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    showLockIcon?: boolean;
  }

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showLockIcon = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative">
        {showLockIcon && (
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 z-10" />
        )}
        <Input
          type={showPassword ? "text" : "password"}
          className={cn(
            "text-[#4169E1] font-semibold dark:text-[#4169E1]",
            showLockIcon && "pl-10",
            "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
