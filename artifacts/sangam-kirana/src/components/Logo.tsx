export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: 28, md: 36, lg: 48 };
  const textSizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="hsl(15 75% 45%)" />
        <path
          d="M24 8 C24 8, 14 16, 14 26 C14 33 18.5 38 24 38 C29.5 38 34 33 34 26 C34 16 24 8 24 8Z"
          fill="hsl(38 70% 75%)"
          opacity="0.9"
        />
        <path
          d="M24 14 C24 14, 17 20, 17 27 C17 32 20 35.5 24 35.5"
          fill="hsl(15 65% 35%)"
          opacity="0.6"
        />
        <path
          d="M24 22 L24 36"
          stroke="hsl(15 65% 35%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        <circle cx="24" cy="18" r="2" fill="white" opacity="0.7" />
        <path
          d="M18 28 Q21 25 24 27 Q27 25 30 28"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className={`font-bold ${textSizes[size]} text-primary tracking-tight`}>Sangam</span>
        <span className={`font-medium ${size === "lg" ? "text-sm" : "text-xs"} text-muted-foreground tracking-widest uppercase`}>Kirana Store</span>
      </div>
    </div>
  );
}
