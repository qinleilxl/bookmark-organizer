import { Loader2, CheckCircle } from "lucide-react";

export function StatusMessage({ status }) {
  if (!status) return null;

  const className = `mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
    status.type === "loading"
      ? "bg-yellow-50 text-yellow-700"
      : status.type === "success"
      ? "bg-green-50 text-green-700"
      : status.type === "warning"
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-700"
  }`;

  return (
    <div className={className}>
      {status.type === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
      {status.type === "success" && <CheckCircle className="w-4 h-4" />}
      {status.message}
    </div>
  );
}
