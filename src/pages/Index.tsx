import { useState, useCallback } from "react";
import { Book, Copy, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { verses, type Verse } from "@/data/verses";

const Index = () => {
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const drawVerse = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      let newVerse: Verse;
      do {
        newVerse = verses[Math.floor(Math.random() * verses.length)];
      } while (newVerse === currentVerse && verses.length > 1);
      setCurrentVerse(newVerse);
      setIsAnimating(false);
    }, 300);
  }, [currentVerse]);

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

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/15" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Book className="h-4 w-4" />
            Versículo Bíblico
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Palavra de Deus
          </h1>
          <p className="text-muted-foreground">
            Clique para receber uma palavra de inspiração
          </p>
        </div>

        {/* Verse Card */}
        <Card className="w-full border-border/60 bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-300">
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
            {currentVerse ? (
              <div
                className={`flex flex-col gap-4 transition-all duration-300 ${
                  isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
                }`}
              >
                <p className="font-verse text-xl leading-relaxed text-foreground sm:text-2xl italic">
                  "{currentVerse.text}"
                </p>
                <span className="text-sm font-semibold tracking-wide text-accent-foreground/70">
                  — {currentVerse.reference}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Sparkles className="h-10 w-10 text-accent" />
                <p className="text-lg">Clique no botão para sortear um versículo</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 w-full">
          <Button
            onClick={drawVerse}
            size="lg"
            className="w-full gap-2 bg-primary text-primary-foreground text-base font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Book className="h-5 w-5" />
            Sortear Versículo
          </Button>

          {currentVerse && (
            <div className="flex gap-2 animate-fade-in">
              <Button
                variant="outline"
                size="sm"
                onClick={copyVerse}
                className="gap-1.5"
              >
                <Copy className="h-4 w-4" />
                Copiar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareVerse}
                className="gap-1.5"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground/60">
          {verses.length} versículos disponíveis
        </p>
      </div>
    </div>
  );
};

export default Index;
