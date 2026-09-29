import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BrandQr } from "@/components/qr";
import { PageHead, Source } from "@/components/ui";
import { brand } from "@/lib/site";

export const metadata: Metadata = { title: "تواصل" };

export default function ContactPage() {
  const rows = [
    { icon: MessageCircle, l: "واتساب", v: brand.phoneDisplay, href: brand.whatsappUrl, ltr: true },
    { icon: Phone, l: "هاتف", v: brand.phoneDisplay, href: brand.tel, ltr: true },
    { icon: Mail, l: "البريد", v: brand.email, href: `mailto:${brand.email}`, ltr: true },
    {
      icon: MapPin,
      l: "العنوان",
      v: brand.addressAr,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.addressEn)}`,
      ltr: false,
    },
  ];
  return (
    <>
      <PageHead kicker="تواصل" title="تحدّث مع غنى ميديا مباشرة">
        <p>ساعات الدوام: {brand.hours}.</p>
      </PageHead>
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <ul className="grid gap-3">
          {rows.map((r) => (
            <li key={r.l}>
              <a
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-spotlight className="card card-hover flex min-h-16 items-center gap-4 p-5"
              >
                <r.icon className="text-gold" aria-hidden />
                <span className="text-sm text-muted">{r.l}</span>
                <span className="ms-auto font-bold" dir={r.ltr ? "ltr" : undefined}>
                  {r.v}
                </span>
              </a>
            </li>
          ))}
          <li className="flex flex-wrap gap-2 pt-2">
            {brand.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost py-2 text-sm"
              >
                {s.label}
              </a>
            ))}
          </li>
        </ul>
        <div className="card grid place-items-center p-8">
          <BrandQr />
        </div>
      </div>
      <Source page="Contact" />
    </>
  );
}
