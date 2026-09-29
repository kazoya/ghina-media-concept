import type { Metadata } from "next";
import { Planner } from "@/components/planner";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "خطّط حملتك" };

export default function PlannerPage() {
  return (
    <>
      <PageHead kicker="مخطِّط الحملة" title="خمسة أسئلة، وتوصيات أولية جاهزة للنقاش">
        <p>
          أجب بصدق عن وضع مشروعك الآن. ستحصل على توصيات أولية (بقواعد ثابتة) بالخدمات المناسبة والفجوات الظاهرة، ورسالة واتساب مرتّبة تُرسلها لغنى ميديا
          بنقرة. لا تُحفظ إجاباتك في أي مكان.
        </p>
      </PageHead>
      <Planner />
    </>
  );
}
