'use server';

/**
 * @fileOverview Generates a set of website routes.
 *
 * - generateRoutes - A function that generates website routes.
 * - GenerateRoutesInput - The input type for the generateRoutes function.
 * - GenerateRoutesOutput - The return type for the generateRoutes function.
 */

import {ai} from '@/server/genkit';
import {z} from 'genkit';

const GenerateRoutesInputSchema = z.object({
  appDescription: z
    .string()
    .describe('A description of the task management application.'),
});

export type GenerateRoutesInput = z.infer<typeof GenerateRoutesInputSchema>;

const GenerateRoutesOutputSchema = z.object({
  routes: z
    .array(z.string())
    .describe('An array of website routes for the application.'),
});

export type GenerateRoutesOutput = z.infer<typeof GenerateRoutesOutputSchema>;

export async function generateRoutes(input: GenerateRoutesInput): Promise<GenerateRoutesOutput> {
  return generateRoutesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoutesPrompt',
  input: {schema: GenerateRoutesInputSchema},
  output: {schema: GenerateRoutesOutputSchema},
  prompt: `You are a website architect. Generate a comprehensive set of website routes for a task management application described as follows:

{{{appDescription}}}

Return a JSON array of routes.  Each route should begin with a slash.  Example: ['/', '/about', '/contact'].  Do not include the base URL.  Omit routes for static assets.`,
});

const generateRoutesFlow = ai.defineFlow(
  {
    name: 'generateRoutesFlow',
    inputSchema: GenerateRoutesInputSchema,
    outputSchema: GenerateRoutesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
