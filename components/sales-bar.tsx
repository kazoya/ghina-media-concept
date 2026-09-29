import { MessageCircle, Phone } from "lucide-react";
import { brand, waLink } from "@/lib/site";

export function SalesBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <p className="hidden text-sm text-muted md:block">جاهز لخطة تسويق واضحة؟ غنى ميديا على بُعد رسالة.</p>
        <div className="flex w-full gap-2 md:w-auto">
          <a
            href={waLink("مرحباً غنى ميديا، أرغب بمكالمة قصيرة حول التسويق الرقمي لمشروعي.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-bg md:flex-none"
          >
            <MessageCircle size={16} aria-hidden /> واتساب
          </a>
          <a
            href={brand.tel}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gold/60 px-5 py-2 text-sm font-bold text-gold-strong md:flex-none"
          >
            <Phone size={16} aria-hidden /> <span className="md:hidden">اتصال</span><span className="hidden md:inline" dir="ltr">{brand.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
