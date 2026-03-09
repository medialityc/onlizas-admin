import { cn } from "@/lib/utils";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

type RatingStarsProps = {
  value: number;
  max?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
};

const iconSizeByVariant = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
};

const normalize = (value: number, max: number) => {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > max) return max;

  return value;
};

export function RatingStars({
  value,
  max = 5,
  size = "sm",
  showValue = false,
  className,
}: RatingStarsProps) {
  const safeValue = normalize(Number(value ?? 0), max);
  const roundedValue = Math.round(safeValue);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, index) =>
          index < roundedValue ? (
            <StarIconSolid
              key={`rating-solid-${index}`}
              className={cn(iconSizeByVariant[size], "text-yellow-400")}
            />
          ) : (
            <StarIcon
              key={`rating-outline-${index}`}
              className={cn(
                iconSizeByVariant[size],
                "text-gray-300 dark:text-gray-600"
              )}
            />
          )
        )}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-muted-foreground">
          {safeValue.toFixed(1)}/{max}
        </span>
      )}
    </div>
  );
}
