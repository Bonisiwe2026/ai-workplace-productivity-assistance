import { ShieldAlert } from "lucide-react";

export function ResponsibleAiNotice() {
  return (
    <div className="rounded-xl border border-action/30 bg-action/10 p-4">
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-action" />
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-foreground">Responsible AI Notice</p>
          <p className="text-muted-foreground">
            AI-generated content may contain errors or omissions. Review and verify important
            information before using it for professional, legal, financial or other high-impact
            decisions.
          </p>
          <p className="text-muted-foreground">
            Please do not enter confidential or sensitive workplace information.
          </p>
        </div>
      </div>
    </div>
  );
}
