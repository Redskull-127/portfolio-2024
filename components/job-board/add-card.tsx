import { Button } from '../ui/button';
import { addJob } from '@/lib/server/functions/job-board';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { DatePicker } from '../date-picker';
import { useState } from 'react';
import { useMutationJobs } from './hooks/useJobs';
import { toast } from 'sonner';

export default function AddCard() {
  const { mutate } = useMutationJobs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof jobFormSchema>) => {
    setIsSubmitting(true);
    const response = await addJob(values);
    if (response.status === 'success') {
      setIsSubmitting(false);
      setIsDialogOpen(false);
      form.reset();
      toast.promise(Promise.all([mutate()]), {
        loading: 'Adding job...',
        success: 'Job added successfully',
        error: 'Failed to add job',
      });
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setIsSubmitting(false);
        }
        setIsDialogOpen(open);
      }}
    >
      <DialogTrigger>
        <Button
          onClick={() => setIsDialogOpen(true)}
          type="submit"
          className="flex items-center justify-center h-fit bg-white border border-gray-300 rounded-md cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Job</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new job to the board.
          </DialogDescription>
        </DialogHeader>
        {isSubmitting && (
          <div className="absolute py-24 z-50 size-full flex flex-col items-center justify-center bg-primary-foreground bg-opacity-10">
            <div className="animate-spin rounded-full size-10 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-5 text-primary">Submitting...</p>
          </div>
        )}
        <div className="max-h-[450px] p-2 overflow-y-auto mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex w-full justify-between items-stretch gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="frontend developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex w-full justify-between items-stretch gap-4">
                <FormField
                  control={form.control}
                  name="companyURL"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Company URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://google.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Job Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Job Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Job Types</SelectLabel>
                              <SelectItem value="internship">
                                Internship
                              </SelectItem>
                              <SelectItem value="full-time">
                                Full Time
                              </SelectItem>
                              <SelectItem value="part-time">
                                Part Time
                              </SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="temporary">
                                Temporary
                              </SelectItem>
                              <SelectItem value="freelancer">
                                Freelance
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Job description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full justify-between items-stretch gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Remote or San Francisco, CA"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input placeholder="100k" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="applyLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://google.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applied On</FormLabel>
                    <FormControl>
                      <DatePicker
                        className="w-full"
                        asFormField={true}
                        field={field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full justify-between items-stretch gap-4">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Meer Tarbani" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@meertarbani.in" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contactLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Social Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.linkedin.com/in/meertarbani"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isSubmitting} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const jobFormSchema = z.object({
  title: z.string(),
  company: z.string(),
  companyURL: z.string().url(),
  jobType: z.string(),
  description: z.string(),
  location: z.string(),
  salary: z.string().optional(),
  applyLink: z.string().url(),
  date: z.date().transform((val) => val.toISOString()),
  contactEmail: z.string().email().optional(),
  contactName: z.string().optional(),
  contactLink: z.string().url().optional(),
});
