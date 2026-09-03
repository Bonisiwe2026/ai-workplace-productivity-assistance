import { Copy, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  onRegenerate: () => void;
  onClear: () => void;
  emptyState: string;
  canRegenerate: boolean;
};

export function AiOutput({
  value,
  onChange,
  loading,
  error,
  onRegenerate,
  onClear,
  emptyState,
  canRegenerate,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        AI is thinking...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
          <div className="space-y-3">
            <p className="text-sm text-foreground">{error}</p>
            <Button size="sm" variant="accent" onClick={onRegenerate} disabled={!canRegenerate}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[320px] resize-y border-0 bg-transparent p-0 text-sm leading-relaxed shadow-none focus-visible:ring-0"
      />
      <div className="flex flex-wrap gap-2 border-t border-border pt-3">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            void navigator.clipboard.writeText(value);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="h-4 w-4" /> Copy
        </Button>
        <Button size="sm" variant="secondary" onClick={onRegenerate} disabled={!canRegenerate}>
          <RefreshCw className="h-4 w-4" /> Regenerate
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear}>
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  );
}
