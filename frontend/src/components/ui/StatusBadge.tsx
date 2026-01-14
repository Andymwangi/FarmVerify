import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { CertificationStatus } from "@/types";

interface StatusBadgeProps {
  status: CertificationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    PENDING: {
      label: "Pending Review",
      icon: "solar:clock-circle-bold",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    CERTIFIED: {
      label: "Certified",
      icon: "solar:verified-check-bold",
      className: "bg-primary/10 text-primary border-primary/20",
    },
    DECLINED: {
      label: "Declined",
      icon: "solar:close-circle-bold",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const { label, icon, className: statusClassName } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
        statusClassName,
        className
      )}
    >
      <Icon icon={icon} className="h-4 w-4" />
      {label}
    </span>
  );
}
