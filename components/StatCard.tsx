import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-clinical-line bg-white p-5 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-clinical-navy">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-clinical-mist text-clinical-teal">
          <Icon size={22} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
