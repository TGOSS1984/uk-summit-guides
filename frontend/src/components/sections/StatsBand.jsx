import { useEffect, useRef, useState } from "react";

function CountUpNumber({ end, suffix = "" }) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let animationFrameId;
    const duration = 1600;
    const startTime = performance.now();

    function tick(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(end * easedProgress);

      setValue(nextValue);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(tick);
      }
    }

    animationFrameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, hasStarted]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

function StatsBand() {
  const stats = [
    { value: 28, label: "Routes" },
    { value: 8, label: "Guides" },
    { value: 5, label: "Regions" },
    { value: 320, label: "Summit Days", suffix: "+" },
  ];

  return (
    <section className="stats-band">
      <div className="stats-band__mountain-edge" aria-hidden="true" />
      <div className="container">
        <div className="stats-band__inner">
          <p className="stats-band__kicker">Trusted Mountain Guiding</p>
          <h2 className="stats-band__title">
            Built around real mountain days and regional expertise
          </h2>
          <p className="stats-band__copy">
            From guided summits to seasonal route planning, UK Summit Guides is
            being shaped as a premium booking platform for mountain experiences
            across the UK.
          </p>

          <div className="stats-band__grid">
            {stats.map((item) => (
              <div key={item.label} className="stats-band__card">
                <p className="stats-band__value">
                  <CountUpNumber end={item.value} suffix={item.suffix || ""} />
                </p>
                <p className="stats-band__label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsBand;