import type { Metadata } from "next";
import { PageHead, Source } from "@/components/ui";
import { activities } from "@/lib/site";

export const metadata: Metadata = { title: "الأنشطة والشراكات" };

const tags = ["شراكة", "ريادة", "تمكين المرأة", "حوار"] as const;

export default function ActivitiesPage() {
  return (
    <>
      <PageHead kicker="الأنشطة والشراكات" title="حضور في منظومة الريادة وتمكين المرأة في الأردن">
        <p>كل بند هنا منشور في صفحة Our Activities، مصنّف في أربع فئات لتسهيل القراءة.</p>
      </PageHead>
      <div className="grid gap-10">
        {tags.map((tag) => (
          <section key={tag}>
            <h2 className="mb-4 flex items-center gap-3 text-xl font-bold">
              <span className="h-6 w-1 rounded-full bg-gold" aria-hidden />
              {tag}
            </h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {activities
                .filter((a) => a.tag === tag)
                .map((a) => (
                  <li key={a.text} data-reveal data-spotlight className="card card-hover p-5 leading-8">
                    {a.text}
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
      <Source page="Our Activities" />
    </>
  );
}
