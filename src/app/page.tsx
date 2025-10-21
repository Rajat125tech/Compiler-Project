
'use client';

import React, { useState, useTransition, FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { analyzeSentimentSemantic, AnalyzeSentimentSemanticOutput } from '@/ai/flows/analyze-sentiment-semantic';
import { updateSentimentLexicon } from '@/ai/flows/update-sentiment-lexicon';
import { stopWords } from '@/lib/stopwords';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit, CheckCircle2, FileJson, Frown, Loader2, Meh, Smile, Sparkles, Wand2, XCircle } from 'lucide-react';
import { SentimentCompilerLogo } from '@/components/sentiment-compiler-logo';

type AnalysisResult = {
  tokens: string[];
  syntaxValid: boolean;
  polarity: AnalyzeSentimentSemanticOutput['sentimentPolarity'] | null;
  score: number;
};

const lexiconFormSchema = z.object({
  word: z.string().min(2, { message: 'Word must be at least 2 characters.' }).regex(/^[a-zA-Z]+$/, { message: 'Word must contain only letters.' }),
  score: z.coerce.number().min(-1, { message: 'Score must be at least -1.' }).max(1, { message: 'Score must be at most 1.' }),
});

const ResultCard: FC<React.PropsWithChildren<{ title: string; icon: React.ReactNode; description?: string; className?: string }>> = ({ title, icon, description, children, className }) => (
  <Card className={cn("bg-secondary/50 border-secondary transition-all hover:bg-secondary/70 hover:border-accent", className)}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
        {icon}
        <span>{title}</span>
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const SentimentIcon: FC<{ polarity: AnalysisResult['polarity'] }> = ({ polarity }) => {
  switch (polarity) {
    case 'Positive': return <Smile className="h-12 w-12 text-green-400" />;
    case 'Negative': return <Frown className="h-12 w-12 text-red-400" />;
    case 'Neutral': return <Meh className="h-12 w-12 text-yellow-400" />;
    default: return null;
  }
};

const LexiconUpdaterForm = () => {
  const { toast } = useToast();
  const [isUpdating, startUpdating] = useTransition();
  const form = useForm<z.infer<typeof lexiconFormSchema>>({
    resolver: zodResolver(lexiconFormSchema),
    defaultValues: { word: '', score: 0 },
  });

  async function onSubmit(values: z.infer<typeof lexiconFormSchema>) {
    startUpdating(async () => {
      try {
        const result = await updateSentimentLexicon({ word: values.word, sentimentScore: values.score });
        toast({
          title: 'Lexicon Updated',
          description: result.message,
        });
        form.reset();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: 'Could not update the sentiment lexicon.',
        });
      }
    });
  }

  return (
    <Card className="bg-secondary/50 border-secondary h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Lexicon Tool</CardTitle>
        <CardDescription>Add or modify words and their sentiment scores to personalize the analyzer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Word</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., awesome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sentiment Score (-1 to 1)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="e.g., 0.9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="outline" className="w-full bg-background" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUpdating ? 'Updating...' : 'Update Lexicon'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default function SentimentCompilerPage() {
  const [inputText, setInputText] = useState("The movie was extremely good and inspiring.");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, startAnalyzing] = useTransition();

  const handleAnalyze = () => {
    if (!inputText.trim()) return;

    startAnalyzing(async () => {
      setResults(null);

      // Phase 1: Lexical Analysis
      const tokens = inputText
        .toLowerCase()
        .replace(/[.,!?;:]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 1 && !stopWords.has(word));

      // Phase 2: Syntax Check (Simplified)
      const words = inputText.trim().split(/\s+/);
      const syntaxValid = words.length > 2 && /[.!?]$/.test(inputText.trim());

      let semanticResult: AnalyzeSentimentSemanticOutput = { sentimentPolarity: 'Neutral', sentimentScore: 0 };
      if (tokens.length > 0) {
        // Phase 3: Semantic Analysis
        semanticResult = await analyzeSentimentSemantic({ tokens });
      }

      setResults({
        tokens,
        syntaxValid,
        polarity: semanticResult.sentimentPolarity,
        score: semanticResult.sentimentScore,
      });
    });
  };

  const scorePercentage = results?.score ? Math.abs(results.score) * 100 : 0;
  
  const getPolarityColor = (polarity: AnalysisResult['polarity']) => {
    switch(polarity) {
      case 'Positive': return 'bg-green-500';
      case 'Negative': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  }

  return (
    <div className="min-h-screen bg-grid-slate-900/[0.04]">
    <div className="container mx-auto p-4 sm:p-8">
      <header className="text-center mb-12">
        <div className="inline-block">
          <SentimentCompilerLogo />
        </div>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Inspired by compiler design, this tool applies Lexical and Semantic Analysis to detect sentiment in sentences.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-secondary/50 border-secondary">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">1. Input Sentence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter a sentence to analyze..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[100px] text-base"
              />
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !inputText.trim()} size="lg" className="w-full sm:w-auto">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Sentiment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {isAnalyzing && (
            <div className="space-y-6">
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-6 animate-in fade-in-0 duration-500">
              <Separator />
              <h2 className="font-headline text-3xl text-center text-primary">2. Analysis Results</h2>

              <Link href={`/analysis/lexical?sentence=${encodeURIComponent(inputText)}`}>
                  <ResultCard title="Lexical Analysis" icon={<FileJson className="h-6 w-6" />} description="Relevant keywords (tokens) extracted from the sentence.">
                    {results.tokens.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {results.tokens.map((token, index) => (
                          <Badge
                            variant="default"
                            key={index}
                            className="text-base px-3 py-1 animate-in fade-in bg-primary/20 text-primary-foreground border-primary/40"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {token}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No significant keywords found.</p>
                    )}
                  </ResultCard>
              </Link>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Link href={`/analysis/syntax?sentence=${encodeURIComponent(inputText)}`}>
                    <ResultCard title="Syntax Check" icon={results.syntaxValid ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />} description="A basic validation of the sentence structure.">
                      <div className="flex items-center gap-2">
                        {results.syntaxValid ? (
                          <CheckCircle2 className="h-8 w-8 text-green-400" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-400" />
                        )}
                        <span className="text-lg font-medium">{results.syntaxValid ? 'Structure: Valid' : 'Structure: Potentially Invalid'}</span>
                      </div>
                    </ResultCard>
                 </Link>

                 <Link href={`/analysis/semantic?polarity=${results.polarity}&score=${results.score}`}>
                    <ResultCard title="Semantic Analysis" icon={<BrainCircuit className="h-6 w-6" />} description="Overall sentiment determined by the meaning of the tokens.">
                      <div className="flex items-center gap-4">
                        <SentimentIcon polarity={results.polarity} />
                        <div>
                          <p className="text-xl font-bold font-headline">{results.polarity}</p>
                          <p className="text-muted-foreground">
                            Score: {results.score.toFixed(2)} ({scorePercentage.toFixed(0)}%)
                          </p>
                        </div>
                      </div>
                      <Progress value={scorePercentage} className="mt-4 h-3 bg-slate-700" indicatorClassName={cn(getPolarityColor(results.polarity))} />
                    </ResultCard>
                 </Link>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <LexiconUpdaterForm />
        </div>
      </main>

      <footer className="text-center mt-16 text-sm text-muted-foreground">
        <p>Built by Rajat and Aditya Jha</p>
        <p>Sentiment Compiler &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
    </div>
  );
}
