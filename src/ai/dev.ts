import { config } from 'dotenv';
config();

import '@/ai/flows/generate-routes.ts';
import '@/ai/flows/summarize-task-data.ts';
import '@/ai/flows/send-feedback-email.ts';
