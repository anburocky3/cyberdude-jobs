"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Info, CircleX, X } from "lucide-react";

type AlertVariant = "success" | "warning" | "info" | "error";

export type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  dismissable?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

function getVariantStyle(variant: AlertVariant) {
  switch (variant) {
    case "success":
      return {
        container: "bg-emerald-50 border-emerald-200 text-emerald-900",
        iconWrap: "text-emerald-700",
        close: "hover:bg-emerald-100 focus-visible:ring-emerald-400",
      };
    case "warning":
      return {
        container: "bg-amber-50 border-amber-200 text-amber-900",
        iconWrap: "text-amber-700",
        close: "hover:bg-amber-100 focus-visible:ring-amber-400",
      };
    case "info":
      return {
        container: "bg-blue-50 border-blue-200 text-blue-900",
        iconWrap: "text-blue-700",
        close: "hover:bg-blue-100 focus-visible:ring-blue-400",
      };
    case "error":
    default:
      return {
        container: "bg-red-50 border-red-200 text-red-900",
        iconWrap: "text-red-700",
        close: "hover:bg-red-100 focus-visible:ring-red-400",
      };
  }
}

function getDefaultIcon(variant: AlertVariant) {
  switch (variant) {
    case "success":
      return <CheckCircle2 className="h-5 w-5" aria-hidden="true" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5" aria-hidden="true" />;
    case "info":
      return <Info className="h-5 w-5" aria-hidden="true" />;
    case "error":
    default:
      return <CircleX className="h-5 w-5" aria-hidden="true" />;
  }
}

export function Alert({
  variant = "info",
  title,
  children,
  dismissable = false,
  onDismiss,
  icon,
  className,
}: AlertProps) {
  const [visible, setVisible] = useState(true);
  const styles = getVariantStyle(variant);
  const effectiveIcon = icon ?? getDefaultIcon(variant);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={[
        "w-full border rounded-md px-4 py-3 flex items-start gap-3",
        styles.container,
        className || "",
      ].join(" ")}
    >
      <span className={["mt-0.5", styles.iconWrap].join(" ")}>
        {effectiveIcon}
      </span>
      <div className="flex-1 min-w-0">
        {title ? (
          <p className="font-medium leading-6 break-words whitespace-normal">
            {title}
          </p>
        ) : null}
        {children ? (
          <div className="text-sm leading-5 mt-0.5">{children}</div>
        ) : null}
      </div>
      {dismissable ? (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          className={[
            "ml-2 inline-flex h-7 w-7 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2",
            styles.close,
          ].join(" ")}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export default Alert;
