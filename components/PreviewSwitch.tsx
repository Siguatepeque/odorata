"use client";

import { useEffect, useState } from "react";

// ponytail: temporary review tool. Open a product page with ?ver=1 to flip between treatments; delete once chosen.
const DETAILS = [
  ["table", "Tabla"],
  ["strip", "Etiquetas"],
  ["glass", "Vidrio"],
] as const;

export default function PreviewSwitch() {
  const [on, setOn] = useState(false);
  const [details, setDetails] = useState("table");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the URL once, after hydration
    setOn(new URLSearchParams(location.search).has("ver"));
  }, []);
  useEffect(() => {
    document.documentElement.dataset.details = details;
  }, [details]);

  if (!on) return null;
  return (
    <div className="preview-switch" role="group" aria-label="Variantes">
      <div>
        {DETAILS.map(([id, label]) => (
          <button key={id} type="button" aria-pressed={details === id} onClick={() => setDetails(id)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
