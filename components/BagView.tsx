"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { clear, setQty, totals, useBag, type Line } from "@/lib/bag";
import { DELIVERY_FROM, DEPARTMENTS, delivery, lempiras, note, product, type Lang } from "@/lib/catalog";
import { dict } from "@/lib/dict";
import GlyphTile from "./GlyphTile";
import Icon from "./Icon";

type Pay = "cod" | "transfer" | "card";
type Form = { name: string; phone: string; email: string; dept: string; city: string; address: string; ref: string; pay: Pay };
const BLANK: Form = { name: "", phone: "", email: "", dept: "", city: "", address: "", ref: "", pay: "cod" };
type Errors = Partial<Record<keyof Form, string>>;
// ponytail: mock order number; Shopify returns the real one.
const orderNo = () => `MRG-${Math.floor(10000 + Math.random() * 89999)}`;

// One sheet: the bag unfolds into the order steps in place, with a step row that never wraps.
export default function BagView({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const c = t.checkout;
  const bag = useBag();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(BLANK);
  const [errors, setErrors] = useState<Errors>({});
  const [order, setOrder] = useState<{ no: string; lines: Line[]; form: Form } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const labels = [t.nav.bag, ...c.steps];

  useEffect(() => {
    if (first.current) return void (first.current = false);
    heading.current?.focus();
  }, [step, order]);

  if (order) return <Done lang={lang} order={order} />;

  const { count, subtotal } = totals(bag);
  const fee = form.dept ? delivery(form.dept).fee : null;

  if (count === 0)
    return (
      <section className="section sheet">
        <h1 className="sheet-title">{t.bag.title}</h1>
        <div className="empty">
          <p>{t.bag.empty}</p>
          <Link href={`/${lang}/shop`} className="btn btn-ink">
            {t.bag.emptyCta} <Icon name="arrow" />
          </Link>
        </div>
      </section>
    );

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = c.required;
      const digits = form.phone.replace(/\D/g, "");
      if (!digits) e.phone = c.required;
      else if (digits.length !== 8) e.phone = c.badPhone;
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = c.badEmail;
    }
    if (s === 2) {
      if (!form.dept) e.dept = c.required;
      if (!form.city.trim()) e.city = c.required;
      if (!form.address.trim()) e.address = c.required;
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    const bad = Object.keys(e)[0];
    if (bad) return document.getElementById(`f-${bad}`)?.focus();
    if (step < 4) return setStep(step + 1);
    setOrder({ no: orderNo(), lines: bag, form });
    clear();
  };

  const field = (k: keyof Form, label: string, opts: { help?: string; type?: string; auto?: string; optional?: boolean; inputMode?: "tel" | "email" | "text" } = {}) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      {opts.help && (
        <p className="help" id={`h-${k}`}>
          {opts.help}
        </p>
      )}
      <input
        id={`f-${k}`}
        type={opts.type ?? "text"}
        inputMode={opts.inputMode}
        autoComplete={opts.auto}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={[opts.help && `h-${k}`, errors[k] && `e-${k}`].filter(Boolean).join(" ") || undefined}
        required={!opts.optional}
      />
      {errors[k] && (
        <p className="error" id={`e-${k}`}>
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <section className="section sheet">
      <ol className="steprow" aria-label={c.step(step + 1, labels.length)}>
        {labels.map((l, i) => (
          <li key={l} aria-current={i === step ? "step" : undefined} className={i < step ? "done" : undefined}>
            <span className="mono">{i + 1}</span>
            {l}
          </li>
        ))}
      </ol>

      <div className="sheet-body">
        <div className="sheet-main">
          <h1 className="sheet-title" ref={heading} tabIndex={-1}>
            {step === 0 ? t.bag.title : labels[step]}
            <span className="sheet-step">{c.step(step + 1, labels.length)}</span>
          </h1>

          {step === 0 && (
            <ul className="lines">
              {bag.map((l) => {
                const p = product(l.handle)!;
                return (
                  <li key={l.handle} className="line">
                    <Link href={`/${lang}/p/${p.handle}`} className="line-tile" tabIndex={-1} aria-hidden="true">
                      <GlyphTile note={note(p.face.note)} x={p.face.x} y={p.face.y} z={p.face.z} cell={5} />
                    </Link>
                    <div className="line-info">
                      <Link href={`/${lang}/p/${p.handle}`} className="line-name">
                        {p.name}
                      </Link>
                      <p>
                        {p.house} · {p.type} · {p.ml} ml
                      </p>
                      <p className="mono">{lempiras(p.price)} {lang === "es" ? "c/u" : "each"}</p>
                    </div>
                    <div className="line-qty">
                      <div className="qty" role="group" aria-label={`${t.qty}: ${p.name}`}>
                        <button type="button" onClick={() => setQty(p.handle, l.qty - 1)} aria-label={t.less}>
                          <Icon name="minus" />
                        </button>
                        <output className="mono" aria-live="polite">
                          {l.qty}
                        </output>
                        <button type="button" onClick={() => setQty(p.handle, l.qty + 1)} disabled={l.qty >= p.stock} aria-label={t.more}>
                          <Icon name="plus" />
                        </button>
                      </div>
                      <button type="button" className="link-btn" onClick={() => setQty(p.handle, 0)}>
                        {t.bag.remove}
                      </button>
                    </div>
                    <p className="line-total mono">{lempiras(p.price * l.qty)}</p>
                  </li>
                );
              })}
            </ul>
          )}

          {step === 1 && (
            <div className="fields">
              {field("name", c.name, { auto: "name" })}
              {field("phone", c.phone, { help: c.phoneHelp, type: "tel", auto: "tel-national", inputMode: "tel" })}
              {field("email", c.email, { type: "email", auto: "email", optional: true, inputMode: "email" })}
            </div>
          )}

          {step === 2 && (
            <div className="fields">
              <div className="field">
                <label htmlFor="f-dept">{c.dept}</label>
                <select id="f-dept" value={form.dept} onChange={set("dept")} aria-invalid={errors.dept ? true : undefined} aria-describedby={errors.dept ? "e-dept" : "h-dept"} required>
                  <option value="">{c.deptPick}</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                {errors.dept ? (
                  <p className="error" id="e-dept">
                    {errors.dept}
                  </p>
                ) : (
                  <p className="help" id="h-dept">
                    {form.dept ? `${t.bag.delivery} ${lempiras(delivery(form.dept).fee)} · ${c.arrives(delivery(form.dept).days[lang])}` : `${t.bag.delivery} ${t.bag.deliveryFrom(lempiras(DELIVERY_FROM))}`}
                  </p>
                )}
              </div>
              {field("city", c.city, { auto: "address-level2" })}
              {field("address", c.address, { help: c.addressHelp, auto: "street-address" })}
              {field("ref", c.ref, { help: c.refHelp, optional: true })}
            </div>
          )}

          {step === 3 && (
            <fieldset className="pay">
              <legend className="sr-only">{c.payWith}</legend>
              {(["cod", "transfer", "card"] as Pay[]).map((k) => (
                <label key={k} className="pay-option">
                  <input type="radio" name="pay" value={k} checked={form.pay === k} onChange={() => setForm({ ...form, pay: k })} />
                  <span>
                    <strong>{c.pay[k][0]}</strong>
                    <span>{c.pay[k][1]}</span>
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          {step === 4 && (
            <dl className="review">
              <div>
                <dt>{c.steps[0]}</dt>
                <dd>
                  {form.name}
                  <br />
                  +504 {form.phone}
                  {form.email && (
                    <>
                      <br />
                      {form.email}
                    </>
                  )}
                </dd>
                <button type="button" className="link-btn" onClick={() => setStep(1)}>
                  {c.edit}
                </button>
              </div>
              <div>
                <dt>{c.deliverTo}</dt>
                <dd>
                  {form.address}, {form.city}, {form.dept}
                  {form.ref && (
                    <>
                      <br />
                      {form.ref}
                    </>
                  )}
                  <br />
                  {c.arrives(delivery(form.dept).days[lang])}
                </dd>
                <button type="button" className="link-btn" onClick={() => setStep(2)}>
                  {c.edit}
                </button>
              </div>
              <div>
                <dt>{c.payWith}</dt>
                <dd>{c.pay[form.pay][0]}</dd>
                <button type="button" className="link-btn" onClick={() => setStep(3)}>
                  {c.edit}
                </button>
              </div>
            </dl>
          )}

          <div className="sheet-nav">
            {step > 0 && (
              <button type="button" className="btn btn-outline" onClick={() => setStep(step - 1)}>
                <Icon name="back" /> {c.back}
              </button>
            )}
            <button type="button" className="btn btn-ink btn-grow" onClick={next}>
              {step === 0 ? t.bag.checkout : step === 4 ? `${c.place} · ${lempiras(subtotal + (fee ?? 0))}` : c.next}
              {step < 4 && <Icon name="arrow" />}
            </button>
          </div>
        </div>

        <aside className="summary" aria-labelledby="sum-h">
          <h2 id="sum-h">{c.summary}</h2>
          <ul>
            {bag.map((l) => {
              const p = product(l.handle)!;
              return (
                <li key={l.handle}>
                  <span>
                    {l.qty} × {p.name}
                  </span>
                  <span className="mono">{lempiras(p.price * l.qty)}</span>
                </li>
              );
            })}
          </ul>
          <dl>
            <div>
              <dt>{t.bag.subtotal}</dt>
              <dd className="mono">{lempiras(subtotal)}</dd>
            </div>
            <div>
              <dt>{t.bag.delivery}</dt>
              <dd className="mono">{fee === null ? t.bag.deliveryFrom(lempiras(DELIVERY_FROM)) : lempiras(fee)}</dd>
            </div>
            <div className="sum-total" key={fee ?? "none"} data-changed={fee !== null || undefined}>
              <dt>{fee === null ? t.bag.totalEst : t.bag.total}</dt>
              <dd className="mono">{lempiras(subtotal + (fee ?? DELIVERY_FROM))}</dd>
            </div>
          </dl>
          <p className="sum-note" aria-live="polite">
            {fee === null ? t.bag.deliveryNext : c.newTotal(lempiras(fee))}
          </p>
        </aside>
      </div>
    </section>
  );
}

function Done({ lang, order }: { lang: Lang; order: { no: string; lines: Line[]; form: Form } }) {
  const t = dict(lang);
  const c = t.checkout;
  const { subtotal } = totals(order.lines);
  const fee = delivery(order.form.dept).fee;
  return (
    <section className="section sheet done">
      <div className="done-mark">
        <Icon name="check" size={32} />
      </div>
      <h1 className="sheet-title" tabIndex={-1} ref={(el) => el?.focus()}>
        {c.doneTitle}
      </h1>
      <p className="done-lead">{c.doneLead(order.no)}</p>
      <dl className="review">
        <div>
          <dt>{t.bag.total}</dt>
          <dd className="mono">{lempiras(subtotal + fee)}</dd>
        </div>
        <div>
          <dt>{c.payWith}</dt>
          <dd>{c.pay[order.form.pay][0]}</dd>
        </div>
        <div>
          <dt>{c.deliverTo}</dt>
          <dd>
            {order.form.address}, {order.form.city}, {order.form.dept} · {c.arrives(delivery(order.form.dept).days[lang])}
          </dd>
        </div>
      </dl>
      <p className="footer-mock">{c.doneMock}</p>
      <Link href={`/${lang}/shop`} className="btn btn-outline">
        {t.keepShopping}
      </Link>
    </section>
  );
}
