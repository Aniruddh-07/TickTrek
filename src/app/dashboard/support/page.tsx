
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useUser } from '@/context/user-context';
import { sendFeedbackEmail } from '@/ai/flows/send-feedback-email';


const feedbackFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  reportType: z.enum(['bug', 'feature', 'feedback', 'other']),
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;


export default function SupportPage() {
  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user ? `${user.name.toLowerCase().replace(' ', '.')}@example.com` : '',
      reportType: 'bug',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    const result = await sendFeedbackEmail(data);

    if (result.success) {
        toast({
            title: 'Feedback Submitted',
            description: 'Thank you for your feedback! We have received your message.',
        });
        form.reset();
        // re-populate name and email after reset
        form.setValue('name', user?.name || '');
        form.setValue('email', user ? `${user.name.toLowerCase().replace(' ', '.')}@example.com` : '');
    } else {
        toast({
            title: 'Submission Failed',
            description: 'Something went wrong. Please try again later.',
            variant: 'destructive',
        });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-headline">Feedback & Support</h1>
        <p className="text-muted-foreground">
          Have a suggestion or found a bug? Let us know!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a Report</CardTitle>
          <CardDescription>
            Use the form below to submit bug reports or feature requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Name</Label>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Email</Label>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="reportType"
                    render={({ field }) => (
                    <FormItem>
                        <Label>Report Type</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a report type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="bug">Bug Report</SelectItem>
                                <SelectItem value="feature">Feature Request</SelectItem>
                                <SelectItem value="feedback">General Feedback</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                        <Label>Subject</Label>
                         <FormControl>
                            <Input placeholder="e.g., Kanban board drag-and-drop issue" {...field} />
                         </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                        <Label>Message</Label>
                         <FormControl>
                            <Textarea
                                id="message"
                                placeholder="Please describe the issue or your suggestion in detail..."
                                className="min-h-[120px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </form>
           </Form>
        </CardContent>
      </Card>
    </div>
  );
}
