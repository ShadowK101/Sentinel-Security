'use server';

/**
 * @fileOverview This file implements the passphrase generation flow.
 *
 * - generatePassphrase - A function that generates a passphrase.
 * - PassphraseGenerationInput - The input type for the generatePassphrase function.
 * - PassphraseGenerationOutput - The return type for the generatePassphrase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {isWordSequenceBlacklisted} from '@/services/word-sequence-blacklist';

const PassphraseGenerationInputSchema = z.object({
  numWords: z
    .number()
    .min(1)
    .max(10)
    .default(3)
    .describe('The number of words in the passphrase.'),
});
export type PassphraseGenerationInput = z.infer<typeof PassphraseGenerationInputSchema>;

const PassphraseGenerationOutputSchema = z.object({
  passphrase: z.string().describe('The generated passphrase.'),
});
export type PassphraseGenerationOutput = z.infer<typeof PassphraseGenerationOutputSchema>;

export async function generatePassphrase(
  input: PassphraseGenerationInput
): Promise<PassphraseGenerationOutput> {
  return passphraseGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'passphraseGenerationPrompt',
  input: {schema: PassphraseGenerationInputSchema},
  output: {schema: PassphraseGenerationOutputSchema},
  prompt: `You are a passphrase generator. Generate a passphrase with {{numWords}} words.\n`,
});

const passphraseGenerationFlow = ai.defineFlow(
  {
    name: 'passphraseGenerationFlow',
    inputSchema: PassphraseGenerationInputSchema,
    outputSchema: PassphraseGenerationOutputSchema,
  },
  async input => {
    let output = await prompt(input);

    // Apply word sequence blacklist filter.  If blacklisted, generate again.
    while (await isWordSequenceBlacklisted(output.output!.passphrase)) {
      output = await prompt(input);
    }

    return output.output!;
  }
);
