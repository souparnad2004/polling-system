interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "mx-auto items-center text-center" : "items-start";

  return (
    <div
      className={`flex max-w-2xl flex-col gap-4 ${alignment} ${className ?? ""}`}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}