
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const faqs = [
  {
    question: 'How do I create a new task?',
    answer: 'You can create a new task from the main dashboard by clicking the "Add Task" button. This option is available to Admins and Team Leads.',
  },
  {
    question: 'How do I change my password?',
    answer: 'To change your password, go to the Settings page, and under the Profile section, you will find an option to update your password.',
  },
  {
    question: 'How does the Kanban board work?',
    answer: 'The Kanban board allows you to visualize your workflow. You can drag and drop tasks between columns (e.g., Pending, In Progress, Completed) to update their status.',
  },
  {
    question: 'Who can create new projects and teams?',
    answer: 'Only users with the "Admin" role can create new projects and teams. They can then assign teams to projects and members to teams.',
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-headline">Support</h1>
        <p className="text-muted-foreground">Find answers to your questions or contact our support team.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>If you can't find an answer in the FAQ, feel free to reach out to us directly.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Issue with payment processing" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Please describe your issue in detail..." className="min-h-[120px]" />
            </div>
            <Button type="submit">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
