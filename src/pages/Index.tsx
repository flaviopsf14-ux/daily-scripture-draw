import { useState, useCallback, useMemo } from "react";
import { Book, Copy, Share2, Sparkles, Heart, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import { verses, type Verse, type Testament } from "@/data/verses";
import { useFavorites } from "@/hooks/useFavorites";

type FilterOption = "all" | Testament;
type View = "home" | "verse" | "favorites";

const Index = () => {
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [view, setView] = useState<View>("home");
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();

  const favoriteVerses = useMemo(
    () => verses.filter((v) => favoriteIds.includes(v.id)),
    [favoriteIds]
  );

  const drawVerse = useCallback(
    (filter: FilterOption) => {
      const filtered =
        filter === "all" ? verses : verses.filter((v) => v.testament === filter);
      if (filtered.length === 0) return;
      setIsAnimating(true);
      setTimeout(() => {
        let newVerse: Verse;
        do {
          newVerse = filtered[Math.floor(Math.random() * filtered.length)];
        } while (newVerse === currentVerse && filtered.length > 1);
        setCurrentVerse(newVerse);
        setView("verse");
        setIsAnimating(false);
      }, 300);
    },
    [currentVerse]
  );

  const copyVerse = useCallback(() => {
    if (!currentVerse) return;
    navigator.clipboard.writeText(`"${currentVerse.text}" — ${currentVerse.reference}`);
    toast.success("Versículo copiado!");
  }, [currentVerse]);

  const shareVerse = useCallback(async () => {
    if (!currentVerse) return;
    const text = `"${currentVerse.text}" — ${currentVerse.reference}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Versículo Bíblico", text });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Versículo copiado para compartilhar!");
    }
  }, [currentVerse]);

  // Home view
  if (view === "home") {
    return (
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[hsl(255,65%,55%)] via-[hsl(240,60%,50%)] to-[hsl(270,70%,40%)] px-6 py-12 text-white">
        <div className="flex w-full max-w-md flex-col items-center gap-8 pt-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2">
              <Book className="h-7 w-7" />
              <h1 className="text-3xl font-bold tracking-tight">Palavra Divina</h1>
            </div>
            <p className="text-white/80 text-lg">
              Receba uma mensagem de fé e inspiração
            </p>
          </div>

          {/* Sparkle icon */}
          <div className="flex items-center justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* CTA text */}
          <div className="text-center">
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
              Deixe a Palavra de<br />Deus guiar seu dia
            </h2>
            <p className="mt-2 text-white/70 text-sm">
              Escolha de onde sortear o versículo
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-3">
            <button
              onClick={() => drawVerse("all")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-lg font-semibold text-[hsl(255,65%,55%)] shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" />
              Sortear em Toda a Bíblia
            </button>
            <button
              onClick={() => drawVerse("old")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/90 px-6 py-3.5 text-base font-semibold text-[hsl(255,65%,55%)] shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-white hover:shadow-lg active:scale-[0.98]"
            >
              <Book className="h-5 w-5" />
              Antigo Testamento
            </button>
            <button
              onClick={() => drawVerse("new")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/90 px-6 py-3.5 text-base font-semibold text-[hsl(255,65%,55%)] shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-white hover:shadow-lg active:scale-[0.98]"
            >
              <Book className="h-5 w-5" />
              Novo Testamento
            </button>
          </div>

          {/* Favorites button */}
          <button
            onClick={() => setView("favorites")}
            className="flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25"
          >
            <Heart className="h-4 w-4" />
            Ver Versículos Favoritos
            {favoriteIds.length > 0 && (
              <span className="ml-1 rounded-full bg-white/30 px-2 py-0.5 text-xs">
                {favoriteIds.length}
              </span>
            )}
          </button>

          <p className="text-xs text-white/40">{verses.length} versículos disponíveis</p>
        </div>
      </div>
    );
  }

  // Favorites view
  if (view === "favorites") {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-[hsl(255,65%,55%)] via-[hsl(240,60%,50%)] to-[hsl(270,70%,40%)] px-6 py-8 text-white">
        <div className="mx-auto w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => setView("home")}
            className="mb-6 flex items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>

          <div className="mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Versículos Favoritos</h2>
          </div>

          {favoriteVerses.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/10 p-8 text-center backdrop-blur-sm">
              <Heart className="h-12 w-12 text-white/40" />
              <p className="text-white/60">
                Você ainda não tem versículos favoritos.<br />
                Sorteie um versículo e toque no coração para salvar!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {favoriteVerses.map((verse) => (
                <div
                  key={verse.id}
                  className="relative rounded-2xl bg-white/15 p-5 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <button
                    onClick={() => toggleFavorite(verse.id)}
                    className="absolute right-3 top-3 rounded-full p-1 text-white/60 transition-colors hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="font-verse pr-6 text-base italic leading-relaxed">
                    "{verse.text}"
                  </p>
                  <span className="mt-2 block text-xs font-semibold text-white/60">
                    — {verse.reference}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Verse view
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(240,60%,50%)] to-[hsl(270,70%,40%)] px-6 py-8 text-white">
      <div className="flex w-full max-w-md flex-col items-center gap-6 pt-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-2">
            <Book className="h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">Palavra Divina</h1>
          </div>
          <p className="text-sm text-white/80">Receba uma mensagem de fé e inspiração</p>
        </div>

        {/* Verse card */}
        <div
          className={`w-full rounded-3xl bg-white p-8 shadow-xl transition-all duration-300 ${
            isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          {currentVerse && (
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))]/15">
                <Sparkles className="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>
              <p className="font-verse text-2xl leading-relaxed italic text-gray-800 sm:text-3xl">
                "{currentVerse.text}"
              </p>
              <span className="text-base font-semibold tracking-wide text-[hsl(var(--primary))]">
                — {currentVerse.reference}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {currentVerse && (
          <div className="flex w-full flex-col gap-2.5">
            <button
              onClick={() => setView("home")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Início
            </button>

            <button
              onClick={() => toggleFavorite(currentVerse.id)}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Heart
                className={`h-4 w-4 transition-all ${
                  isFavorite(currentVerse.id)
                    ? "fill-red-400 text-red-400"
                    : ""
                }`}
              />
              {isFavorite(currentVerse.id) ? "Salvo" : "Salvar"}
            </button>

            <button
              onClick={shareVerse}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar
            </button>

            <button
              onClick={() => drawVerse("all")}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[hsl(var(--primary))] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              Sortear Outro
            </button>
          </div>
        )}

        {/* Favorites link */}
        <button
          onClick={() => setView("favorites")}
          className="flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25"
        >
          <Heart className="h-4 w-4" />
          Ver Versículos Favoritos
          {favoriteIds.length > 0 && (
            <span className="ml-1 rounded-full bg-white/30 px-2 py-0.5 text-xs">
              {favoriteIds.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Index;
