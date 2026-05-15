import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const WEB3FORMS_ACCESS_KEY = "62a2c696-0222-48ca-be15-214a5e8c732e";

type Sponsor = { tierName: string; price: string; perks?: string[] };

export function SponsorDialog({ open, onOpenChange, sponsor }: { open: boolean; onOpenChange: (v: boolean) => void; sponsor: Sponsor | null }) {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFormStep(1);
      setPaymentSuccess(false);
      setPaymentError(null);
    }
  }, [open]);

  useEffect(() => {
    if (formStep === 2 && !paymentSuccess) {
      if (card) return;
      const script = document.createElement("script");
      script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
      script.onload = async () => {
        try {
          if (!(window as any).Square) return;
          const sqPayments = (window as any).Square.payments(
            import.meta.env.VITE_SQUARE_APP_ID,
            import.meta.env.VITE_SQUARE_LOCATION_ID
          );
          setPayments(sqPayments);
          const cardObj = await sqPayments.card();
          await cardObj.attach('#square-card-container-sponsor');
          setCard(cardObj);
        } catch (e) {
          console.error("Square init failed:", e);
        }
      };
      document.body.appendChild(script);

      return () => {
        if (card) card.destroy();
      };
    }
  }, [formStep, paymentSuccess]);

  const sendEmail = async () => {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "Sponsor Inquiry - SMG Cares",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Sponsor: ${sponsor?.tierName}\nAmount: ${sponsor?.price}`,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Email failed");
  };

  const handlePayment = async () => {
    if (!card) return;
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const result = await card.tokenize();
      if (result.status === "OK") {
        const amount = parseInt((sponsor?.price || "$0").replace(/[^0-9]/g, "")) * 100;
        const resp = await fetch("/api/payments/square", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: result.token, amount, registrantEmail: formData.email, packageName: sponsor?.tierName }),
        });
        const text = await resp.text();
        let data: any = {};
        try { data = JSON.parse(text); } catch { console.error("Non-JSON resp", text.slice(0, 300)); }
        if (resp.ok && data.success) {
          try { await sendEmail(); } catch (e: any) { console.warn("Email send failed", e); }
          setPaymentSuccess(true);
        } else {
          setPaymentError(data.error || `Payment failed (${resp.status})`);
        }
      } else {
        setPaymentError(result.errors?.[0]?.message || "Tokenization failed");
      }
    } catch (e: any) {
      setPaymentError(e.message || "Unexpected error");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#fdfdfd] border-white/20 p-0 overflow-hidden shadow-2xl">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary">{paymentSuccess ? "Sponsor Complete" : formStep === 1 ? "Contact Information" : "Secure Payment"}</DialogTitle>
            <DialogDescription className="text-muted-foreground">{paymentSuccess ? "" : formStep === 1 ? "Please provide billing info." : "Enter payment details to complete sponsorship."}</DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6">
          {formStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
              </div>
            </div>
          )}

          {formStep === 2 && !paymentSuccess && (
            <div className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-sm text-muted-foreground font-semibold mb-1">Total Due:</p>
                <p className="text-3xl font-display text-primary">{sponsor?.price}</p>
                <p className="text-sm font-medium mt-1">{sponsor?.tierName}</p>
              </div>
              <div id="square-card-container-sponsor" className="min-h-[80px]"></div>
              {paymentError && <div className="text-red-500 text-sm font-medium mt-2 p-3 bg-red-50 rounded-md border border-red-100">{paymentError}</div>}
            </div>
          )}

          {paymentSuccess && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"><Check className="w-8 h-8" /></div>
              <h3 className="text-2xl font-display text-primary">Thank you!</h3>
              <p className="text-muted-foreground max-w-sm">Your sponsorship for {sponsor?.tierName} has been received. A confirmation email will be sent to {formData.email}.</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-muted/50 border-t flex justify-between">
          {paymentSuccess ? (
            <div className="w-full flex justify-center"><Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto bg-primary">Close</Button></div>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={paymentLoading}>Cancel</Button>
              {formStep < 2 ? (
                <Button onClick={() => {
                  if (!formData.name || !formData.email) return toast.error('Name and email required');
                  setFormStep(2);
                }} className="bg-primary text-primary-foreground">Next</Button>
              ) : (
                <Button onClick={handlePayment} disabled={paymentLoading || !card} className="bg-gradient-gold text-accent-foreground">
                  {paymentLoading ? 'Processing...' : 'Pay Now'}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SponsorDialog;
