
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { SentimentCompilerLogo } from '@/components/sentiment-compiler-logo';

function SyntaxAnalysisContent() {
  const searchParams = useSearchParams();
  const sentence = searchParams.get('sentence') || '';
  
  const words = sentence.trim().split(/\s+/);
  const syntaxValid = words.length > 2 && /[.!?]$/.test(sentence.trim());

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
                {syntaxValid ? <CheckCircle2 className="h-8 w-8 text-green-400" /> : <XCircle className="h-8 w-8 text-red-400" />}
                Syntax Analysis Details
            </h2>
            <p className="text-muted-foreground mt-2">Checking the grammatical structure of the sentence.</p>
        </div>


        <Card className="bg-secondary/50 border-secondary">
          <CardHeader>
            <CardTitle>Analysis Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <p>Syntax Analysis checks if the sentence follows basic grammatical rules. For this tool, the check is simplified but effective for identifying potentially malformed sentences.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Minimum Length:</strong> The sentence must contain more than two words.</li>
              <li><strong>Ending Punctuation:</strong> The sentence must end with a period (.), question mark (?), or exclamation mark (!).</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50 border-secondary">
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Rule 1: Word Count</h3>
              <div className="flex items-center gap-2 mt-2">
                {words.length > 2 ? <CheckCircle2 className="h-6 w-6 text-green-400" /> : <XCircle className="h-6 w-6 text-red-400" />}
                <span>Sentence has {words.length} words (must be &gt; 2).</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Rule 2: Ending Punctuation</h3>
              <div className="flex items-center gap-2 mt-2">
                {/[.!?]$/.test(sentence.trim()) ? <CheckCircle2 className="h-6 w-6 text-green-400" /> : <XCircle className="h-6 w-6 text-red-400" />}
                <span>Sentence ends with valid punctuation.</span>
              </div>
            </div>
             <div className="mt-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-xl">Overall Result:</h3>
                <div className="flex items-center gap-2 mt-2 text-2xl">
                    {syntaxValid ? (
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-400" />
                    )}
                    <span className="font-medium">{syntaxValid ? 'Structure: Valid' : 'Structure: Potentially Invalid'}</span>
                </div>
            </div>
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

export default function SyntaxPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SyntaxAnalysisContent/>
        </Suspense>
    )
}
