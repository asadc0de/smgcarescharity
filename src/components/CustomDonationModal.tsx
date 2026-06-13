import { useEffect, useState, useRef } from "react";
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

const WEB3FORMS_ACCESS_KEY = "a3cdab0e-c130-42ed-a2f3-107436af5a8a";

export function CustomDonationModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void; }) {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", amount: "" });
  const [amountError, setAmountError] = useState("");
  const [payments, setPayments] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const cardRef = useRef<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFormStep(1);
      setPaymentSuccess(false);
      setPaymentError(null);
      setAmountError("");
      setFormData({ name: "", email: "", phone: "", address: "", amount: "" });
    }
  }, [open]);

  useEffect(() => {
    if (formStep === 2 && !paymentSuccess) {
      if (card) return;

      const appId = import.meta.env.VITE_SQUARE_APP_ID;
      const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

      if (!appId || !locationId || appId === "YOUR_SQUARE_APP_ID" || locationId === "YOUR_SQUARE_LOCATION_ID" || appId.includes("YOUR_") || locationId.includes("YOUR_")) {
        setPaymentError("Square Payment is not configured. Please define VITE_SQUARE_APP_ID and VITE_SQUARE_LOCATION_ID in your .env file.");
        return;
      }

      const isSandbox = appId.startsWith("sandbox-");
      const scriptUrl = isSandbox
        ? "https://sandbox.web.squarecdn.com/v1/square.js"
        : "https://web.squarecdn.com/v1/square.js";

      const initializeSquare = async () => {
        try {
          if (!(window as any).Square) return;
          const sqPayments = (window as any).Square.payments(appId, locationId);
          setPayments(sqPayments);
          const cardObj = await sqPayments.card();
          const container = document.getElementById('square-card-container-custom');
          if (!container) return; // container removed before load finished, bail safely
          await cardObj.attach('#square-card-container-custom');
          cardRef.current = cardObj;
          setCard(cardObj);
        } catch (e: any) {
          console.error("Square initialization failed:", e);
          setPaymentError(e.message || "Failed to initialize payment form. Please refresh and try again.");
        }
      };

      const existingScript = document.getElementById('square-js');
      if (existingScript) {
        initializeSquare();
      } else {
        const script = document.createElement("script");
        script.id = 'square-js';
        script.src = scriptUrl;
        script.onload = () => initializeSquare();
        document.body.appendChild(script);
      }

      return () => {
        if (cardRef.current) {
          cardRef.current.destroy();
          cardRef.current = null;
        }
      };
    }
  }, [formStep, paymentSuccess]);

  const sendEmail = async () => {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "Custom Donation - SMG Cares",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Type: Custom Donation\nAmount: $${formData.amount}`,
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
        const amountInCents = Math.floor(parseFloat(formData.amount) * 100);
        const resp = await fetch("/api/payments/square", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: result.token,
            amount: amountInCents,
            registrantEmail: formData.email,
            packageName: "Custom Donation",
          }),
        });
        const text = await resp.text();
        let data: any = {};
        try { data = JSON.parse(text); } catch { console.error("Non-JSON resp", text.slice(0, 300)); }
        if (resp.ok && data.success) {
          console.log("[CustomDonationModal] Transaction successful:", data);
          try { await sendEmail(); } catch (e: any) { console.warn("Email send failed", e); }
          setPaymentSuccess(true);
        } else {
          console.error("[CustomDonationModal] Transaction failed:", data.error || resp.status);
          setPaymentError(data.error || `Payment failed (${resp.status})`);
        }
      } else {
        console.error("[CustomDonationModal] Card tokenization failed:", result.errors);
        setPaymentError(result.errors?.[0]?.message || "Tokenization failed");
      }
    } catch (e: any) {
      console.error("[CustomDonationModal] Transaction unexpected error:", e);
      setPaymentError(e.message || "Unexpected error");
    } finally {
      setPaymentLoading(false);
    }
  };

  const validateAndProceed = () => {
    setAmountError("");
    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount < 10) {
      setAmountError("Minimum donation is $10");
      return;
    }
    if (!formData.name || !formData.email) {
      toast.error('Name and email required');
      return;
    }
    setFormStep(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#fdfdfd] border-white/20 p-0 overflow-hidden shadow-2xl">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary">
              {paymentSuccess ? "Donation Complete" : "Donate to SMG Cares"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {paymentSuccess ? "" : formStep === 1 ? "Every dollar makes a difference." : "Enter payment details to complete your donation."}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6">
          {formStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Donation Amount ($) *</Label>
                <Input 
                  type="number" 
                  min="10" 
                  placeholder="Enter amount (min. $10)" 
                  value={formData.amount} 
                  onChange={e => {
                    setFormData({ ...formData, amount: e.target.value });
                    if (amountError && parseFloat(e.target.value) >= 10) setAmountError("");
                  }} 
                />
                {amountError && <p className="text-red-500 text-sm font-medium">{amountError}</p>}
              </div>
              <div className="space-y-2 mt-4">
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
                <p className="text-sm text-muted-foreground font-semibold mb-1">Total Donation:</p>
                <p className="text-3xl font-display text-primary">${parseFloat(formData.amount).toFixed(2)}</p>
              </div>
              <div id="square-card-container-custom" className="min-h-[80px]"></div>
              {paymentError && <div className="text-red-500 text-sm font-medium mt-2 p-3 bg-red-50 rounded-md border border-red-100">{paymentError}</div>}
            </div>
          )}

          {paymentSuccess && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"><Check className="w-8 h-8" /></div>
              <h3 className="text-2xl font-display text-primary">Thank you!</h3>
              <p className="text-muted-foreground max-w-sm">Your generous donation of ${parseFloat(formData.amount).toFixed(2)} has been received. A confirmation email will be sent to {formData.email}.</p>
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
                <Button onClick={validateAndProceed} className="bg-primary text-primary-foreground">Next</Button>
              ) : (
                <Button onClick={handlePayment} disabled={paymentLoading || !card} className="bg-gradient-gold text-accent-foreground">
                  {paymentLoading ? 'Processing...' : 'Donate Now'}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomDonationModal;
