import Link from "next/link";

export function PageHead({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="rise mb-10 max-w-3xl">
      <p className="text-sm font-bold text-gold">{kicker}</p>
      <h1 className="mt-2 text-3xl font-bold leading-snug md:text-4xl">{title}</h1>
      {children && <div className="mt-4 leading-8 text-muted">{children}</div>}
    </header>
  );
}

export function Source({ page }: { page: string }) {
  return (
    <p className="mt-8 text-xs text-muted">
      المصدر: صفحة «{page}» على{" "}
      <a className="underline hover:text-gold-strong" href="https://ghinamedia.com" target="_blank" rel="noopener noreferrer">
        ghinamedia.com
      </a>
    </p>
  );
}

export function CtaLink({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) {
  const cls = ghost
    ? "inline-flex items-center gap-2 rounded-full border border-gold/60 px-6 py-3 font-bold text-gold-strong transition hover:bg-gold-soft"
    : "inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-bg transition hover:bg-gold-strong";
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
