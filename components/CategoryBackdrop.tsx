export default function CategoryBackdrop({ slug }: { slug: string }) {
  const base = "pointer-events-none fixed inset-0 -z-10 overflow-hidden";

  if (slug === "landscape") {
    return (
      <div
        className={base}
        style={{
          background:
            "linear-gradient(180deg,#0b1a2b 0%,#10343a 55%,#0b1f14 100%)",
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
            "linear-gradient(180deg,#2b1055 0%,#7a1f3d 45%,#e8590c 100%)",
        }}
      >
        <span
          className="absolute left-1/2 top-[55%] -ml-[210px] h-[420px] w-[420px] rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle,#ffd27a 0%,#ff8a3d 45%,transparent 70%)",
            animation: "sun-rise 12s ease-in-out infinite alternate",
          }}
        />
      </div>
    );
  }

  if (slug === "nature") {
    return (
      <div className={base} style={{ background: "#06140a" }}>
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
          background: "linear-gradient(180deg,#1c1209,#2a1a0c 60%,#120a05)",
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
            "radial-gradient(ellipse at 50% -10%, #3a3a3a 0%, #0a0a0a 60%)",
        }}
      />
    );
  }

  if (slug === "street") {
    return (
      <div
        className={base}
        style={{
          background: "#0d0d0d",
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
          background: "#0a1c3a",
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
          background: "#1a1410",
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
        style={{ background: "linear-gradient(180deg,#02030d,#0a0f2c)" }}
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