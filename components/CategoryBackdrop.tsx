export default function CategoryBackdrop({ slug }: { slug: string }) {
  const base = "pointer-events-none fixed inset-0 -z-10 overflow-hidden";

  if (slug === "landscape") {
    return (
      <div
        className={base}
        style={{
          background:
            "linear-gradient(180deg, rgba(11, 26, 43, 0.35) 0%, rgba(16, 52, 58, 0.35) 55%, rgba(11, 31, 20, 0.45) 100%)",
        }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute bottom-0 h-64 w-full"
        >
          <path
            d="M0,320 L0,200 L180,90 L320,180 L520,40 L720,190 L900,80 L1100,200 L1280,110 L1440,210 L1440,320 Z"
            fill="rgba(0,0,0,0.35)"
          />
        </svg>
      </div>
    );
  }

  if (slug === "sunset") {
    return (
      <div
        className={base}
        style={{
          background:
            "linear-gradient(180deg, rgba(43, 16, 85, 0.25) 0%, rgba(122, 31, 61, 0.25) 45%, rgba(232, 89, 12, 0.3) 100%)",
        }}
      >
        <span
          className="absolute left-1/2 top-[55%] -ml-[210px] h-[420px] w-[420px] rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,210,122,0.4) 0%, rgba(255,138,61,0.3) 45%, transparent 70%)",
            animation: "sun-rise 12s ease-in-out infinite alternate",
          }}
        />
      </div>
    );
  }

  if (slug === "nature") {
    return (
      <div className={base} style={{ background: "rgba(6, 20, 10, 0.35)" }}>
        <span
          className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"
          style={{ animation: "float 10s ease-in-out infinite" }}
        />
        <span
          className="absolute right-0 top-1/2 h-[28rem] w-[28rem] rounded-full bg-lime-500/15 blur-3xl"
          style={{ animation: "float 13s ease-in-out 1s infinite" }}
        />
        <span
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl"
          style={{ animation: "float 11s ease-in-out 2s infinite" }}
        />
      </div>
    );
  }

  if (slug === "wildlife") {
    return (
      <div
        className={base}
        style={{
          background: "linear-gradient(180deg, rgba(28,18,9,0.35), rgba(42,26,12,0.35) 60%, rgba(18,10,5,0.45))",
        }}
      />
    );
  }

  if (slug === "portrait") {
    return (
      <div
        className={base}
        style={{
          background:
            "radial-gradient(ellipse at 50% -10%, rgba(58,58,58,0.25) 0%, rgba(10,10,10,0.35) 60%)",
        }}
      />
    );
  }

  if (slug === "street") {
    return (
      <div
        className={base}
        style={{
          background: "rgba(13,13,13,0.35)",
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 4px)",
        }}
      />
    );
  }

  if (slug === "architecture") {
    return (
      <div
        className={base}
        style={{
          background: "rgba(10,28,58,0.35)",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    );
  }

  if (slug === "travel") {
    return (
      <div
        className={base}
        style={{
          background: "rgba(26,20,16,0.35)",
          backgroundImage:
            "radial-gradient(rgba(255,220,160,0.18) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />
    );
  }

  if (slug === "night") {
    return (
      <div
        className={base}
        style={{ background: "linear-gradient(180deg, rgba(2,3,13,0.3), rgba(10,15,44,0.45))" }}
      >
        {Array.from({ length: 60 }, (_, k) => (
          <span
            key={k}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(k * 37) % 100}%`,
              top: `${(k * 53) % 100}%`,
              width: 1 + (k % 3),
              height: 1 + (k % 3),
              animation: `twinkle ${2 + (k % 4)}s ease-in-out ${(k % 7) * 0.5}s infinite`,
            }}
          />
        ))}
      </div>
    );
  }

  return <div className={base} />;
}