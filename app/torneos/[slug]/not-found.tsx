import Link from "next/link";

export default function TorneoNotFound() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-foreground/10 bg-surface p-8 text-center">
          <h1 className="text-xl font-bold text-foreground">
            Torneo no encontrado
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            No existe un torneo con ese slug en la base de datos.
          </p>
          <p className="mt-6">
            <Link
              href="/torneos"
              className="text-primary underline hover:no-underline"
            >
              ← Volver a Torneos
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
