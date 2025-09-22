interface RowProps {
  label: string;
  value: string;
  badge?: boolean;
  status?: "open" | "expired";
}

export default function Row({ label, value, badge, status }: RowProps) {
  const isBadge = badge || typeof status !== "undefined";
  const badgeClass =
    status === "expired"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-gray-500">{label}</span>
      {isBadge ? (
        <span className={`px-2 py-1 rounded text-xs ${badgeClass}`}>
          {value}
        </span>
      ) : (
        <span className="text-gray-800">{value}</span>
      )}
    </div>
  );
}
