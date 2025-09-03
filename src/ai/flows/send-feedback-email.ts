'use server';

/**
 * @fileOverview A flow to handle sending feedback emails.
 *
 * - sendFeedbackEmail - A function that handles the feedback submission process.
 * - SendFeedbackEmailInput - The input type for the sendFeedbackEmail function.
 * - SendFeedbackEmailOutput - The return type for the sendFeedbackEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
    console.log('New feedback received:', input);

    // In a real application, you would integrate an email sending service here.
    // For example, using a library like Nodemailer.
    //
    // IMPORTANT: Store your email credentials securely in environment variables (.env file)
    // and never expose them in the client-side code.
    //
    // Example with Nodemailer (you would need to install it: npm install nodemailer):
    /*
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // 'upadhyayaniruddh365@gmail.com'
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
      },
    });

    const mailOptions = {
      from: `"${input.name}" <${process.env.EMAIL_USER}>`,
      to: 'upadhyayaniruddh482@gmail.com',
      replyTo: input.email,
      subject: `TickTrek Support: [${input.reportType}] ${input.subject}`,
      text: `Feedback from: ${input.name} (${input.email})\n\n${input.message}`,
      html: `<p><b>Feedback from:</b> ${input.name} (${input.email})</p><p>${input.message}</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Feedback email sent successfully.');
      return { success: true };
    } catch (error) {
      console.error('Error sending feedback email:', error);
      return { success: false };
    }
    */

    // For this demo, we will just simulate a successful email send.
    return { success: true };
  }
);
