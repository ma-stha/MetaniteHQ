import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const h = { sm: 20, md: 28, lg: 40 }[size];
  return (
    <Image
      src="/brand/metanite-logo.png"
      alt="Metanite"
      width={Math.round(h * 3.53)}
      height={h}
      priority
      style={{ height: h, width: "auto" }}
    />
  );
}

export function Mark({ size = 24 }: { size?: number }) {
  return <Image src="/brand/metanite-icon.png" alt="" width={size} height={size} />;
}
