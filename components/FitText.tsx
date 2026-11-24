"use client";

import { useLayoutEffect, useRef } from "react";

// Sets one line of display type to exactly the width of its column.
// Reacts to width changes only: the height it causes must not refit it.
export default function FitText({ children, className, id, as: Tag = "h1" }: { children: string; className?: string; id?: string; as?: "h1" | "h2" | "p" }) {
  const box = useRef<HTMLHeadingElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const h = box.current!;
    let last = -1;
    const fit = (force = false) => {
      const w = h.clientWidth;
      if (!w || (w === last && !force)) return;
      last = w;
      h.style.fontSize = "100px";
      h.style.fontSize = `${(100 * w) / text.current!.getBoundingClientRect().width}px`;
    };
    fit();
    const ro = new ResizeObserver(() => fit());
    ro.observe(h);
    document.fonts?.ready.then(() => fit(true));
    return () => ro.disconnect();
  }, [children]);

  return (
    <Tag ref={box} id={id} className={`fit ${className ?? ""}`}>
      <span ref={text}>{children}</span>
    </Tag>
  );
}
