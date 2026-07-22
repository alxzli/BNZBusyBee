import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <section className="rounded-none border border-slate-200 bg-white px-6 py-8 text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.06)] lg:px-8 lg:py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <Badge variant="secondary">{eyebrow}</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">{description}</p>
          </div>
        </div>
        {actions}
      </div>
    </section>
  );
}