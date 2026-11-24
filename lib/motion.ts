// prefers-reduced-motion as a useSyncExternalStore source. Lives here, not in AccordStage, so pages
// without the glyph field don't pull three.js in just to read a media query.
export const motionQuery = () => matchMedia("(prefers-reduced-motion: reduce)");
export const subscribeMotion = (cb: () => void) => {
  const mq = motionQuery();
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
