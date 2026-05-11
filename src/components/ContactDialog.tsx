import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ContactDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onOpenChange(false);
      toast.success("Message sent — we'll be in touch soon.");
    }, 700);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-surface-elev border-border rounded-3xl">
        <DialogHeader>
          <span className="eyebrow mb-2">Get in touch</span>
          <DialogTitle className="font-display text-3xl text-primary">Send us a message</DialogTitle>
          <DialogDescription>We'd love to hear from you. Drop us a note and we'll respond shortly.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <Input required maxLength={100} placeholder="Your name" className="h-12 rounded-xl" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input required type="email" maxLength={255} placeholder="Email address" className="h-12 rounded-xl" />
            <Input required maxLength={20} placeholder="Phone number" className="h-12 rounded-xl" />
          </div>
          <Textarea required maxLength={1000} placeholder="How can we help?" rows={5} className="rounded-xl resize-none" />
          <Button type="submit" disabled={submitting} className="w-full h-12 bg-gradient-navy text-primary-foreground rounded-xl font-semibold shadow-soft">
            {submitting ? "Sending…" : "Send message"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
