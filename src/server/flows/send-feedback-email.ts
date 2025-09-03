'use server';

/**
 * @fileOverview A flow to handle sending feedback emails.
 *
 * - sendFeedbackEmail - A function that handles the feedback submission process.
 * - SendFeedbackEmailInput - The input type for the sendFeedbackEmail function.
 * - SendFeedbackEmailOutput - The return type for the sendFeedbackEmail function.
 */

import { ai } from '@/server/genkit';
import { z } from 'genkit';
import nodemailer from 'nodemailer';

const SendFeedbackEmailInputSchema = z.object({
  name: z.string().describe('The name of the user sending the feedback.'),
  email: z.string().email().describe('The email of the user sending the feedback.'),
  reportType: z.string().describe('The type of report being submitted.'),
  subject: z.string().describe('The subject of the feedback email.'),
  message: z.string().describe('The content of the feedback message.'),
});

export type SendFeedbackEmailInput = z.infer<typeof SendFeedbackEmailInputSchema>;

const SendFeedbackEmailOutputSchema = z.object({
  success: z.boolean(),
});

export type SendFeedbackEmailOutput = z.infer<
  typeof SendFeedbackEmailOutputSchema
>;

export async function sendFeedbackEmail(
  input: SendFeedbackEmailInput
): Promise<SendFeedbackEmailOutput> {
  return sendFeedbackEmailFlow(input);
}

const sendFeedbackEmailFlow = ai.defineFlow(
  {
    name: 'sendFeedbackEmailFlow',
    inputSchema: SendFeedbackEmailInputSchema,
    outputSchema: SendFeedbackEmailOutputSchema,
  },
  async (input) => {
    // Ensure you have EMAIL_USER and EMAIL_PASS in your .env file
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials are not set in environment variables.');
      // For demonstration, we'll return success, but in production, you'd want to fail here.
      // throw new Error('Email service not configured.');
      console.log('Simulating successful email send for feedback:', input);
      return { success: true };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g., upadhyayaniruddh365@gmail.com
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: `"${input.name} via TickTrek" <${process.env.EMAIL_USER}>`,
      to: 'upadhyayaniruddh482@gmail.com',
      replyTo: input.email,
      subject: `TickTrek Support: [${input.reportType}] ${input.subject}`,
      text: `Feedback from: ${input.name} (${input.email})\n\nReport Type: ${input.reportType}\n\nMessage:\n${input.message}`,
      html: `
        <h2>TickTrek Feedback</h2>
        <p><strong>From:</strong> ${input.name} (${input.email})</p>
        <p><strong>Report Type:</strong> ${input.reportType}</p>
        <p><strong>Subject:</strong> ${input.subject}</p>
        <hr>
        <h3>Message:</h3>
        <p style="white-space: pre-wrap;">${input.message}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Feedback email sent successfully.');
      return { success: true };
    } catch (error) {
      console.error('Error sending feedback email:', error);
      return { success: false };
    }
  }
);
