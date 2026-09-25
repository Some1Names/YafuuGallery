interface StorageUsageBarProps {
  bytesUsed: number;
  objectCount: number;
}

// R2's free tier includes 10 GB-month of storage — used as the bar's
// reference point since there's no billing-plan field anywhere to read an
// actual cap from. Once usage crosses it the bar just keeps filling past
// 100% in the "over" color instead of clamping, so it stays honest about
// being an estimate rather than a hard limit.
const FREE_TIER_BYTES = 10 * 1024 * 1024 * 1024;

function formatGB(bytes: number): string {
  return (bytes / (1024 * 1024 * 1024)).toFixed(2);
}

export default function StorageUsageBar({ bytesUsed, objectCount }: StorageUsageBarProps) {
  const percent = (bytesUsed / FREE_TIER_BYTES) * 100;
  const barWidth = Math.min(percent, 100);
  const isOver = percent > 100;
  const isNear = percent > 80 && !isOver;

  return (
    <div className="border border-border rounded-md p-4 bg-surface/60 mb-10">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <div className="text-sm text-fg">
          <span className="font-(family-name:--font-display) text-base">{formatGB(bytesUsed)} GB</span>{" "}
          <span className="text-fg-secondary">of {formatGB(FREE_TIER_BYTES)} GB used</span>
        </div>
        <div className="text-xs text-fg-muted whitespace-nowrap">
          {objectCount.toLocaleString()} objects · R2 storage
        </div>
      </div>

      <div className="h-2 rounded-full bg-bg overflow-hidden">
        <div
          className={
            "h-full rounded-full transition-[width] duration-300 " +
            (isOver ? "bg-danger" : isNear ? "bg-warning" : "bg-fg")
          }
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {isOver && (
        <p className="text-xs text-danger-text mt-2">
          Over the free tier&apos;s 10 GB — R2 usage is now billed.
        </p>
      )}
    </div>
  );
}
