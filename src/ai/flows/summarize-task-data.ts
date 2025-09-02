'use server';
/**
 * @fileOverview A task data summarization AI agent.
 *
 * - summarizeTaskData - A function that handles the task data summarization process.
 * - SummarizeTaskDataInput - The input type for the summarizeTaskData function.
 * - SummarizeTaskDataOutput - The return type for the summarizeTaskData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTaskDataInputSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      dueDate: z.string(),
      status: z.string(),
      priority: z.string(),
    })
  ).describe('An array of task objects.'),
});
export type SummarizeTaskDataInput = z.infer<typeof SummarizeTaskDataInputSchema>;

const SummarizeTaskDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the task data.'),
});
export type SummarizeTaskDataOutput = z.infer<typeof SummarizeTaskDataOutputSchema>;

export async function summarizeTaskData(input: SummarizeTaskDataInput): Promise<SummarizeTaskDataOutput> {
  return summarizeTaskDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTaskDataPrompt',
  input: {schema: SummarizeTaskDataInputSchema},
  output: {schema: SummarizeTaskDataOutputSchema},
  prompt: `You are an expert task manager specializing in summarizing task lists.

You will use this information to create a concise summary of all tasks.

Tasks: {{JSON.stringify tasks}}`,
});

const summarizeTaskDataFlow = ai.defineFlow(
  {
    name: 'summarizeTaskDataFlow',
    inputSchema: SummarizeTaskDataInputSchema,
    outputSchema: SummarizeTaskDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
