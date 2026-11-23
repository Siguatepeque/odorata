import { useSyncExternalStore } from "react";
import { PRODUCTS } from "./products";

// Front-end bag, persisted in localStorage. Shopify's cart API replaces this later.
export type Line = { handle: string; qty: number };

const KEY = "odorata-bag";
const EMPTY: Line[] = [];
let lines: Line[] = EMPTY;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]") as Line[];
    lines = raw.filter((l) => PRODUCTS.some((p) => p.handle === l.handle) && l.qty > 0);
  } catch {
    lines = EMPTY;
  }
}

function commit(next: Line[]) {
  lines = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  subs.forEach((f) => f());
}

const stock = (handle: string) => PRODUCTS.find((p) => p.handle === handle)?.stock ?? 0;

export function setQty(handle: string, qty: number) {
  load();
  const q = Math.max(0, Math.min(qty, stock(handle)));
  const rest = lines.filter((l) => l.handle !== handle);
  const at = lines.findIndex((l) => l.handle === handle);
  if (q === 0) return commit(rest);
  const next = [...lines];
  if (at === -1) next.push({ handle, qty: q });
  else next[at] = { handle, qty: q };
  commit(next);
}

export const qtyOf = (handle: string) => (load(), lines.find((l) => l.handle === handle)?.qty ?? 0);
export const add = (handle: string, n = 1) => setQty(handle, qtyOf(handle) + n);
export const clear = () => commit(EMPTY);

export function useBag() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => (load(), lines),
    () => EMPTY,
  );
}

export function totals(ls: Line[]) {
  let count = 0;
  let subtotal = 0;
  for (const l of ls) {
    const p = PRODUCTS.find((x) => x.handle === l.handle);
    if (!p) continue;
    count += l.qty;
    subtotal += p.price * l.qty;
  }
  return { count, subtotal };
}
