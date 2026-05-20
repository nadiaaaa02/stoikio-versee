// Logo merek StoikioVerse.
// "Stoikio" — teks coral tebal. "Verse" — teks coral dengan sorotan pastel yellow.
type Props = { className?: string; size?: "sm" | "md" | "lg" };

const CORAL = "#FFB2A6";
const YELLOW = "#FFF89A";

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

export default function BrandLogo({ className = "", size = "md" }: Props) {
  return (
    <span className={`inline-flex items-baseline font-extrabold tracking-tight ${SIZE[size]} ${className}`}>
      <span style={{ color: CORAL }}>Stoikio</span>
      <span
        className="ml-0.5 rounded-md px-1.5 py-0.5"
        style={{ color: CORAL, backgroundColor: YELLOW }}
      >
        Verse
      </span>
    </span>
  );
}
