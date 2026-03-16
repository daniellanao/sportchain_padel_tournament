import { createClient } from "@/app/lib/supabase/server";
import { RoundResultIcon } from "@/app/components/RoundResultIcon";
import Link from "next/link";
import { notFound } from "next/navigation";

const STANDINGS_COLUMNS = [
  "#",
  "Team Name",
  "Players",
  "R1",
  "R2",
  "R3",
  "R4",
  "MP",
  "W",
  "L",
  "GW",
  "GL",
  "Diff",
  "Wins",
] as const;

type StandingRow = {
  position: number;
  teamName: string;
  players: string;
  r1: string;
  r2: string;
  r3: string;
  r4: string;
  mp: number;
  w: number;
  l: number;
  gw: number;
  gl: number;
  diff: number;
  wins: number;
};

const MOCK_STANDINGS: StandingRow[] = [
  { position: 1, teamName: "Smash Brothers", players: "López / García", r1: "W", r2: "W", r3: "W", r4: "W", mp: 4, w: 4, l: 0, gw: 32, gl: 18, diff: 14, wins: 4 },
  { position: 2, teamName: "Padel Masters", players: "Martínez / Sánchez", r1: "W", r2: "W", r3: "W", r4: "L", mp: 4, w: 3, l: 1, gw: 28, gl: 22, diff: 6, wins: 3 },
  { position: 3, teamName: "Net Rulers", players: "Fernández / Ruiz", r1: "W", r2: "L", r3: "W", r4: "W", mp: 4, w: 3, l: 1, gw: 26, gl: 24, diff: 2, wins: 3 },
  { position: 4, teamName: "Court Kings", players: "Díaz / Álvarez", r1: "L", r2: "W", r3: "L", r4: "W", mp: 4, w: 2, l: 2, gw: 22, gl: 26, diff: -4, wins: 2 },
  { position: 5, teamName: "Lob & Drop", players: "Romero / Torres", r1: "L", r2: "L", r3: "W", r4: "L", mp: 4, w: 1, l: 3, gw: 18, gl: 28, diff: -10, wins: 1 },
];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type TournamentRow = {
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
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("tournaments").select("name").eq("slug", slug).single();
  const title = data?.name ? `${data.name} | Torneos` : "Torneo | Sportchain";
  return { title };
}

export default async function TorneoSlugPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: tournament, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !tournament) {
    notFound();
  }

  const t = tournament as TournamentRow;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-4 text-sm text-foreground/70">
          <Link href="/torneos" className="text-primary hover:underline">
            ← Torneos
          </Link>
        </p>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/70">
            {t.location && <span>📍 {t.location}</span>}
            <span>Inicio: {formatDate(t.start_date)}</span>
            <span>Fin: {formatDate(t.end_date)}</span>
            {t.format && (
              <span className="rounded bg-muted px-2 py-0.5">{t.format}</span>
            )}
            {t.status && (
              <span className="capitalize text-foreground/60">{t.status}</span>
            )}
            {t.max_teams != null && (
              <span>Máx. {t.max_teams} equipos</span>
            )}
            {t.total_rounds != null && (
              <span>{t.total_rounds} rondas</span>
            )}
          </div>
          {t.description && (
            <p className="mt-3 max-w-2xl text-foreground/80">{t.description}</p>
          )}
        </header>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Clasificación
          </h2>
          <div className="overflow-hidden rounded-xl border border-foreground/10 bg-surface shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-foreground/10 bg-muted/80">
                    {STANDINGS_COLUMNS.map((col, i) => (
                      <th
                        key={col}
                        className={`whitespace-nowrap px-4 py-3 font-semibold text-foreground ${
                          i === 0 ? "w-10 text-center" : ""
                        } ${i >= 3 && i <= 6 ? "text-center" : ""} ${
                          i >= 7 ? "text-center tabular-nums" : ""
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STANDINGS.map((row, idx) => (
                    <tr
                      key={row.teamName}
                      className={`border-b border-foreground/5 transition-colors hover:bg-muted/50 ${
                        idx % 2 === 0 ? "bg-surface" : "bg-muted/30"
                      } ${row.position === 1 ? "bg-accent-gold/15" : ""}`}
                    >
                      <td className="px-4 py-3 text-center font-medium text-foreground">
                        {row.position}
                      </td>
                      <td className="px-4 py-3 font-medium text-primary">
                        {row.teamName}
                      </td>
                      <td className="px-4 py-3 text-foreground/90">
                        {row.players}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <RoundResultIcon result={row.r1 as "W" | "L"} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <RoundResultIcon result={row.r2 as "W" | "L"} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <RoundResultIcon result={row.r3 as "W" | "L"} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <RoundResultIcon result={row.r4 as "W" | "L"} />
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums text-foreground">
                        {row.mp}
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums font-medium text-foreground">
                        {row.w}
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums text-foreground/70">
                        {row.l}
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums text-foreground">
                        {row.gw}
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums text-foreground">
                        {row.gl}
                      </td>
                      <td
                        className={`px-4 py-3 text-center tabular-nums font-medium ${
                          row.diff > 0
                            ? "text-green-600 dark:text-green-400"
                            : row.diff < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-foreground/70"
                        }`}
                      >
                        {row.diff > 0 ? `+${row.diff}` : row.diff}
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums font-semibold text-primary">
                        {row.wins}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-xs text-foreground/50">
            MP: partidos jugados · W: victorias · L: derrotas · GW/GL: games
            won/lost · Diff: diferencia · R1–R4: resultados por ronda
          </p>
        </section>
      </div>
    </main>
  );
}
