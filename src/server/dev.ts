import { config } from 'dotenv';
config();

import '@/server/flows/route-generator.ts';
import '@/server/flows/summarize-task-data.ts';
import '@/server/flows/send-feedback-email.ts';
