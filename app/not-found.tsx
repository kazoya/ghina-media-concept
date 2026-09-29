import { CtaLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="grid place-items-center py-24 text-center">
      <p className="gold-text text-6xl font-bold">404</p>
      <p className="mt-4 text-muted">هذه الصفحة غير موجودة.</p>
      <div className="mt-6">
        <CtaLink href="/">العودة للرئيسية</CtaLink>
      </div>
    </div>
  );
}
