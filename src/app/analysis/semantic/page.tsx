
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { SentimentCompilerLogo } from '@/components/sentiment-compiler-logo';

function SemanticAnalysisContent() {
  const searchParams = useSearchParams();
  const polarity = searchParams.get('polarity');
  const score = searchParams.get('score');

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
                <BrainCircuit className="h-8 w-8" />
                Semantic Analysis Details
            </h2>
            <p className="text-muted-foreground mt-2">Understanding the meaning and sentiment behind the words.</p>
        </div>

        <Card className="bg-secondary/50 border-secondary">
          <CardHeader>
            <CardTitle>Analysis Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <p>Semantic Analysis is where the meaning and sentiment are interpreted. This phase uses a Generative AI model to understand the context and emotional tone of the extracted tokens.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>AI-Powered Analysis:</strong> The list of tokens is sent to a powerful AI model (Gemini).</li>
              <li><strong>Sentiment Polarity:</strong> The model determines if the overall sentiment is 'Positive', 'Negative', or 'Neutral'.</li>
              <li><strong>Sentiment Score:</strong> The model calculates a precise sentiment score ranging from -1.0 (most negative) to 1.0 (most positive).</li>
               <li><strong>Classification Thresholds:</strong>
                <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                    <li>A score &gt; 0.3 is classified as "Positive".</li>
                    <li>A score &lt; -0.3 is classified as "Negative".</li>
                    <li>A score between -0.3 and 0.3 is "Neutral".</li>
                </ul>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50 border-secondary">
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">The AI model outputs a structured JSON object containing its analysis.</p>
            <pre className="bg-background p-4 rounded-lg text-sm text-left overflow-auto">
                <code className="text-primary-foreground">
{`{
  "sentimentPolarity": "${polarity || 'N/A'}",
  "sentimentScore": ${score || 'N/A'}
}`}
                </code>
            </pre>
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

export default function SemanticPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SemanticAnalysisContent />
        </Suspense>
    )
}
