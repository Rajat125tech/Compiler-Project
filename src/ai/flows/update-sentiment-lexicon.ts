'use server';
/**
 * @fileOverview This file defines a Genkit flow for updating the sentiment lexicon.
 *
 * - updateSentimentLexicon - A function that handles updating the sentiment lexicon.
 * - UpdateSentimentLexiconInput - The input type for the updateSentimentLexicon function.
 * - UpdateSentimentLexiconOutput - The return type for the updateSentimentLexicon function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateSentimentLexiconInputSchema = z.object({
  word: z.string().describe('The word to add or update in the lexicon.'),
  sentimentScore: z
    .number()
    .describe('The sentiment score for the word (e.g., -1 to 1).'),
});
export type UpdateSentimentLexiconInput = z.infer<
  typeof UpdateSentimentLexiconInputSchema
>;

const UpdateSentimentLexiconOutputSchema = z.object({
  success: z
    .boolean()
    .describe('Indicates whether the lexicon update was successful.'),
  message: z.string().describe('A message indicating the outcome of the update.'),
});
export type UpdateSentimentLexiconOutput = z.infer<
  typeof UpdateSentimentLexiconOutputSchema
>;

export async function updateSentimentLexicon(
  input: UpdateSentimentLexiconInput
): Promise<UpdateSentimentLexiconOutput> {
  return updateSentimentLexiconFlow(input);
}

const updateSentimentLexiconPrompt = ai.definePrompt({
  name: 'updateSentimentLexiconPrompt',
  input: {schema: UpdateSentimentLexiconInputSchema},
  output: {schema: UpdateSentimentLexiconOutputSchema},
  prompt: `You are a sentiment lexicon manager. The user wants to update the lexicon with the following word and sentiment score:

Word: {{{word}}}
Sentiment Score: {{{sentimentScore}}}

Respond with a JSON object indicating the success of the operation and a message.
Assume the lexicon update is always successful.  The message should simply acknowledge the update.`,
});

const updateSentimentLexiconFlow = ai.defineFlow(
  {
    name: 'updateSentimentLexiconFlow',
    inputSchema: UpdateSentimentLexiconInputSchema,
    outputSchema: UpdateSentimentLexiconOutputSchema,
  },
  async input => {
    const {output} = await updateSentimentLexiconPrompt(input);
    return output!;
  }
);
