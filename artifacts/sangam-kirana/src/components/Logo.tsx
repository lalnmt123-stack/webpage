import logoImg from "@assets/photo_2026-04-04_16-02-45_1775299015202.jpg";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const heights = { sm: "h-8", md: "h-10", lg: "h-14" };

  return (
    <img
      src={logoImg}
      alt="Sangam Kirana Store"
      className={`${heights[size]} w-auto object-contain`}
    />
  );
}
