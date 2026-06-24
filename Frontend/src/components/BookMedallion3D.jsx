import { useRef, useEffect } from "react";
import "./BookMedallion3D.css";

/**
 * Medalion 3D BookRental — pur CSS + JS (fără three.js, fără logo2.svg).
 * Se rotește automat, plutește, și poate fi rotit cu mouse-ul / degetul.
 *
 * Props:
 *   size  – diametrul în px (default 300)
 */
function BookMedallion3D({ size = 300 }) {
  const spinRef = useRef(null);

  useEffect(() => {
    const el = spinRef.current;
    if (!el) return;

    let rotX = 0;
    let rotY = 0;
    let velX = 0; // inerție pe verticală
    let dragging = false;
    let px = 0;
    let py = 0;
    let raf;

    const point = (e) => (e.touches ? e.touches[0] : e);

    const tick = () => {
      if (!dragging) {
        rotY += 0.35; // rotație lentă continuă
        velX *= 0.95; // frânare inerție
        rotX += velX;
        if (rotX > 22) {
          rotX = 22;
          velX = 0;
        }
        if (rotX < -22) {
          rotX = -22;
          velX = 0;
        }
      }
      el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const onDown = (e) => {
      dragging = true;
      const p = point(e);
      px = p.clientX;
      py = p.clientY;
      velX = 0;
    };
    const onMove = (e) => {
      if (!dragging) return;
      const p = point(e);
      const dx = p.clientX - px;
      const dy = p.clientY - py;
      rotY += dx * 0.4;
      rotX = Math.max(-22, Math.min(22, rotX + dy * 0.4));
      velX = dy * 0.4;
      px = p.clientX;
      py = p.clientY;
    };
    const onUp = () => {
      dragging = false;
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  // 14 straturi suprapuse → coin solid cu grosime când se rotește
  const N = 14;
  const layers = [];
  for (let i = 0; i < N; i++) {
    const z = (i - (N - 1) / 2) * (18 / (N - 1));
    const front = i === N - 1;
    const back = i === 0;
    const edge = !front && !back;
    layers.push(
      <div
        key={i}
        className="medallion-layer"
        style={{
          background: edge ? "#E7D6C2" : "#FBF4EB",
          transform: `translateZ(${z}px)`,
          boxShadow: front ? "inset 0 0 0 1px rgba(61,35,20,.06)" : "none",
        }}
      >
        {front && <Face />}
        {back && <Face mirror />}
      </div>,
    );
  }

  return (
    <div className="medallion-scene" style={{ width: size, height: size }}>
      <div className="medallion-float">
        <div className="medallion-spin" ref={spinRef}>
          {layers}
        </div>
      </div>
    </div>
  );
}

function Face({ mirror }) {
  return (
    <div
      className="medallion-face"
      style={{ transform: mirror ? "rotateY(180deg)" : "none" }}
    >
      <svg
        width="30%"
        height="30%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C45C3A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 6c-2.2-1.5-5.3-1.5-8 0v12c2.7-1.5 5.8-1.5 8 0M12 6c2.2-1.5 5.3-1.5 8 0v12c-2.7-1.5-5.8-1.5-8 0M12 6v12" />
      </svg>
      <div className="medallion-wordmark">BookRental</div>
      <div className="medallion-est">EST · 2026</div>
    </div>
  );
}

export default BookMedallion3D;
