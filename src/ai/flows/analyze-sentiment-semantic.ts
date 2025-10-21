'use server';

/**
 * @fileOverview Determines the sentiment polarity of the input sentence using GenAI.
 *
 * - analyzeSentimentSemantic - A function that handles the sentiment analysis process.
 * - AnalyzeSentimentSemanticInput - The input type for the analyzeSentimentSemantic function.
 * - AnalyzeSentimentSemanticOutput - The return type for the analyzeSentimentSemantic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSentimentSemanticInputSchema = z.object({
  tokens: z.array(z.string()).describe('The array of lexical tokens extracted from the input sentence.'),
});
export type AnalyzeSentimentSemanticInput = z.infer<typeof AnalyzeSentimentSemanticInputSchema>;

const AnalyzeSentimentSemanticOutputSchema = z.object({
  sentimentPolarity: z
    .enum(['Positive', 'Negative', 'Neutral'])
    .describe('The sentiment polarity of the input sentence.'),
  sentimentScore: z.number().min(-1).max(1).describe('The overall sentiment score of the input sentence.'),
});
export type AnalyzeSentimentSemanticOutput = z.infer<typeof AnalyzeSentimentSemanticOutputSchema>;

export async function analyzeSentimentSemantic(input: AnalyzeSentimentSemanticInput): Promise<AnalyzeSentimentSemanticOutput> {
  return analyzeSentimentSemanticFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSentimentSemanticPrompt',
  input: {schema: AnalyzeSentimentSemanticInputSchema},
  output: {schema: AnalyzeSentimentSemanticOutputSchema},
  prompt: `You are a sentiment analysis expert. Your task is to determine the sentiment polarity of a sentence based on the provided lexical tokens.

  Given the following tokens: {{{tokens}}}

  Determine the sentiment polarity (Positive, Negative, or Neutral) and calculate an overall sentiment score between -1 and 1.
  - A score greater than 0.3 should be considered "Positive".
  - A score less than -0.3 should be considered "Negative".
  - Any score between -0.3 and 0.3 (inclusive) should be considered "Neutral".
  
  Please provide your analysis in the requested JSON format.`,
});

const analyzeSentimentSemanticFlow = ai.defineFlow(
  {
    name: 'analyzeSentimentSemanticFlow',
    inputSchema: AnalyzeSentimentSemanticInputSchema,
    outputSchema: AnalyzeSentimentSemanticOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
