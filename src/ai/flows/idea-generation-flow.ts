'use server';
/**
 * @fileOverview An AI flow for expanding on a user's content idea.
 *
 * - expandOnIdea - A function that takes a brief idea and generates a more detailed social media post.
 * - ExpandOnIdeaInput - The input type for the expandOnIdea function.
 * - ExpandOnIdeaOutput - The return type for the expandOnIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpandOnIdeaInputSchema = z.object({
  idea: z.string().describe('The user\'s initial, brief content idea.'),
});
export type ExpandOnIdeaInput = z.infer<typeof ExpandOnIdeaInputSchema>;

const ExpandOnIdeaOutputSchema = z.object({
  expandedPost: z
    .string()
    .describe('A fully-formed social media post based on the user\'s idea, ready to be scheduled.'),
});
export type ExpandOnIdeaOutput = z.infer<typeof ExpandOnIdeaOutputSchema>;


export async function expandOnIdea(input: ExpandOnIdeaInput): Promise<ExpandOnIdeaOutput> {
    return expandOnIdeaFlow(input);
}


const prompt = ai.definePrompt({
    name: 'expandOnIdeaPrompt',
    input: { schema: ExpandOnIdeaInputSchema },
    output: { schema: ExpandOnIdeaOutputSchema },
    prompt: `You are a creative social media strategist. A user will provide you with a brief content idea. Your task is to expand that idea into a compelling and engaging social media post.

The post should be well-written, engaging, and include relevant hashtags.

User's Idea: {{{idea}}}`,
});

const expandOnIdeaFlow = ai.defineFlow(
    {
        name: 'expandOnIdeaFlow',
        inputSchema: ExpandOnIdeaInputSchema,
        outputSchema: ExpandOnIdeaOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
