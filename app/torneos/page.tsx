import { createClient } from "@/app/lib/supabase/server";
import Link from "next/link";

type Tournament = {
  id: number;
  name: string;
  slug: string | null;
  format: string | null;
  status: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  max_teams: number | null;
  total_rounds: number | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusBadgeClass(status: string | null): string {
  switch (status) {
    case "published":
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    case "draft":
      return "bg-foreground/10 text-foreground/80";
    case "completed":
      return "bg-muted text-foreground/80";
    default:
      return "bg-muted text-foreground/70";
  }
}

export default async function TorneosPage() {
  const supabase = await createClient();
  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false, nullsFirst: false });

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Torneos
          </h1>
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
            <p className="font-medium">Error al cargar torneos</p>
            <p className="mt-1 text-sm opacity-90">{error.message}</p>
          </div>
        </div>
      </main>
    );
  }

  const list = (tournaments ?? []) as Tournament[];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Torneos
          </h1>
          <p className="mt-1 text-sm text-foreground/70">
            {list.length === 0
              ? "No hay torneos en la base de datos."
              : `${list.length} torneo${list.length === 1 ? "" : "s"}`}
          </p>
        </header>

        {list.length === 0 ? (
          <div className="rounded-xl border border-foreground/10 bg-surface p-8 text-center text-foreground/70">
            Aún no hay torneos. Crea uno en Supabase para verlo aquí.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <li key={t.id}>
                <Link
                  href={t.slug ? `/torneos/${t.slug}` : `#`}
                  className="block rounded-xl border border-foreground/10 bg-surface p-5 shadow-sm transition-colors hover:border-primary/30 hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-primary">{t.name}</h2>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(t.status)}`}
                    >
                      {t.status ?? "draft"}
                    </span>
                  </div>
                  {t.slug && (
                    <p className="mt-1 text-xs text-foreground/50">{t.slug}</p>
                  )}
                  {t.location && (
                    <p className="mt-2 text-sm text-foreground/80">
                      📍 {t.location}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/60">
                    <span>
                      Inicio: {formatDate(t.start_date)}
                    </span>
                    <span>
                      Fin: {formatDate(t.end_date)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-foreground/50">
                    {t.format && (
                      <span className="rounded bg-muted px-2 py-0.5">
                        {t.format}
                      </span>
                    )}
                    {t.max_teams != null && (
                      <span>Máx. {t.max_teams} equipos</span>
                    )}
                    {t.total_rounds != null && (
                      <span>{t.total_rounds} rondas</span>
                    )}
                  </div>
                  {t.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-foreground/70">
                      {t.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
