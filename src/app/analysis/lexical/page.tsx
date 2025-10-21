
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileJson } from 'lucide-react';
import { stopWords } from '@/lib/stopwords';
import { SentimentCompilerLogo } from '@/components/sentiment-compiler-logo';
import { cn } from '@/lib/utils';

function LexicalAnalysisContent() {
  const searchParams = useSearchParams();
  const sentence = searchParams.get('sentence') || '';

  const tokens = sentence
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopWords.has(word));

  const allWords = sentence.toLowerCase().replace(/[.,!?;:]/g, '').split(/\s+/);

  return (
    <div className="container mx-auto p-4 sm:p-8">
       <header className="text-center mb-12">
        <Link href="/" className="inline-block">
          <SentimentCompilerLogo />
        </Link>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-headline text-primary flex items-center justify-center gap-4">
                <FileJson className="h-8 w-8" />
                Lexical Analysis Details
            </h2>
            <p className="text-muted-foreground mt-2">Breaking down the sentence into its fundamental units: tokens.</p>
        </div>


        <Card className="bg-secondary/50 border-secondary">
          <CardHeader>
            <CardTitle>Analysis Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <p>Lexical Analysis, also known as tokenization, is the first phase. It converts a sequence of characters from the input sentence into a sequence of tokens (words).</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Lowercase:</strong> The entire sentence is converted to lowercase to ensure case-insensitivity.</li>
              <li><strong>Punctuation Removal:</strong> All punctuation marks (e.g., ., !, ?, ;) are removed.</li>
              <li><strong>Tokenization:</strong> The sentence is split into individual words based on spaces.</li>
              <li><strong>Stop Word Filtering:</strong> Common words that carry little semantic weight (like 'the', 'a', 'is') are filtered out to focus on the more meaningful parts of the sentence.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50 border-secondary">
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
            <CardContent>
              <p className="text-muted-foreground mb-4">"Stop words" are greyed out and excluded from the final token list.</p>
              <div className="flex flex-wrap gap-2 items-center text-xl p-4 bg-background rounded-lg">
                {allWords.map((word, index) => (
                   <span key={index} className={cn(
                       "p-2 rounded-md transition-all duration-500",
                       stopWords.has(word) ? 'text-muted-foreground/50' : 'bg-primary/20 text-primary-foreground font-semibold'
                   )}>
                       {word}
                   </span>
                ))}
              </div>
            </CardContent>
          </CardHeader>
        </Card>

         <Card className="bg-secondary/50 border-secondary">
          <CardHeader>
            <CardTitle>Resulting Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            {tokens.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tokens.map((token, index) => (
                  <Badge
                    variant="default"
                    key={index}
                    className="text-base px-3 py-1 bg-primary/20 text-primary-foreground border-primary/40"
                  >
                    {token}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No significant keywords found after filtering.</p>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center mt-8">
            <Button asChild variant="outline" className="bg-background">
                <Link href="/"><ArrowLeft className="mr-2"/> Back to Main</Link>
            </Button>
        </div>
      </main>
    </div>
  );
}


export default function LexicalPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LexicalAnalysisContent />
        </Suspense>
    )
}
