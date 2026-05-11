import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Trophy, Users, Star, Flag, ChevronRight, ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
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
import golfHero from "@/assets/golf-hero.jpg";

const WEB3FORMS_ACCESS_KEY = "62a2c696-0222-48ca-be15-214a5e8c732e";

const registrationPackages = [
  {
    id: "individual",
    title: "Individual Player",
    price: "$725",
    icon: Flag,
    includes: [
      "Single golfer entry",
      "Lunch included",
      "Dinner reception included",
    ],
  },
  {
    id: "foursome",
    title: "Foursome",
    price: "$2,800",
    icon: Users,
    featured: true,
    includes: [
      "4 golfer entries",
      "Lunch included",
      "Dinner reception included",
      "Hole signage",
    ],
  },
  {
    id: "cocktail",
    title: "Cocktail Reception Only",
    price: "$250",
    icon: Star,
    includes: [
      "Reception access only",
      "No golf included",
    ],
  },
];

const sponsorshipTiers = [
  { id: "event", tier: "Event Sponsor", price: "$10,000", featured: true, perks: ["2 Foursomes", "Logo on ALL Signage", "2 Tee Signs"] },
  { id: "signature", tier: "Signature Cocktail Sponsor", price: "$7,500", perks: ["1 Foursome", "Logo on ALL Cocktail Tables", "Specialty Drink named after sponsor", "Tee Sign"] },
  { id: "caddie", tier: "Caddie Sponsor", price: "$5,500", perks: ["1 Foursome", "Logo on Caddie Bibs", "2 Available"] },
  { id: "barbecue", tier: "Barbecue Sponsor", price: "$5,000", perks: ["1 Foursome", "Logo at BBQ Station", "Tee Sign"] },
  { id: "refreshment", tier: "Refreshment Sponsor", price: "$5,000", perks: ["1 Foursome", "Logo at Refreshment Station", "Tee Sign"] },
  { id: "cart", tier: "Golf Cart Sponsor", price: "$5,000", perks: ["1 Foursome", "Logo on ALL Golf Carts"] },
  { id: "tee-marker", tier: "Tee Marker Sponsor", price: "$4,000", perks: ["1 Foursome", "Logo on ALL 36 Tee Markers", "4 Available"] },
  { id: "pin-flag", tier: "Pin Flag Sponsor", price: "$4,000", perks: ["1 Foursome", "Logo on ALL 18 Pin Flags", "Exclusive"] },
  { id: "raffle", tier: "Raffle Sponsor", price: "$2,500", perks: ["Logo on Signage at Raffle Tables"] },
  { id: "av", tier: "AV Sponsor", price: "$2,250", perks: [] },
  { id: "photography", tier: "Photography Sponsor", price: "$1,500", perks: [] },
  { id: "locker", tier: "Locker Room Bar Sponsor", price: "$1,250", perks: [] },
  { id: "closest-pin", tier: "Closest to the Pin Sponsor", price: "$1,000", perks: [] },
  { id: "closest-line", tier: "Closest to the Line Sponsor", price: "$750", perks: [] },
  { id: "longest-drive", tier: "Longest Drive Sponsor", price: "$750", perks: [] },
  { id: "driving-range", tier: "Driving Range Sponsor", price: "$750", perks: [] },
  { id: "putting-green", tier: "Putting Green Sponsor", price: "$500", perks: [] },
  { id: "tee-sign", tier: "Tee Sign", price: "$275", perks: [] },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } },
};

const GolfRegister = () => {
  const [activeTab, setActiveTab] = useState<"register" | "sponsor">("register");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [contact, setContact] = useState(false);
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    golfers: [{ name: "", email: "" }, { name: "", email: "" }, { name: "", email: "" }, { name: "", email: "" }],
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [emailNotificationStatus, setEmailNotificationStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [emailNotificationError, setEmailNotificationError] = useState<string | null>(null);
  const [card, setCard] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);

  const [packages] = useState<any[]>(registrationPackages);
  const [tiers] = useState<any[]>(sponsorshipTiers);

  const resetRegistrationForm = () => {
    setRegisterFormOpen(false);
    setPaymentSuccess(false);
    setPaymentError(null);
    setEmailNotificationStatus("idle");
    setEmailNotificationError(null);
    setFormStep(1);
  };

  const handleRegisterFormOpenChange = (open: boolean) => {
    setRegisterFormOpen(open);

    if (!open) {
      setPaymentSuccess(false);
      setPaymentError(null);
      setEmailNotificationStatus("idle");
      setEmailNotificationError(null);
      setFormStep(1);
    }
  };

  const getSelectionLabel = () => {
    if (selectedPackage) {
      return packages.find((pkg) => pkg.id === selectedPackage)?.title || "";
    }

    if (selectedTier) {
      return tiers.find((tier) => tier.id === selectedTier)?.tier || "";
    }

    return "";
  };

  const getSelectionPrice = () => {
    if (selectedPackage) {
      return packages.find((pkg) => pkg.id === selectedPackage)?.price || "";
    }

    if (selectedTier) {
      return tiers.find((tier) => tier.id === selectedTier)?.price || "";
    }

    return "";
  };

  const getSelectedRecipientType = () => (selectedTier ? "Sponsorship" : "Registration");

  const getGolfersSummary = () => {
    const golfers = formData.golfers
      .filter((golfer) => golfer.name.trim() || golfer.email.trim())
      .map((golfer, index) => `Golfer ${index + 1}: ${golfer.name || "N/A"} | ${golfer.email || "N/A"}`);

    return golfers.length ? golfers.join("\n") : "None";
  };

  const sendRegistrationEmail = async () => {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "Thank you for your registration - SMG Cares",
        from_name: "SMG Cares Golf Registration",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        registration_type: getSelectedRecipientType(),
        package_or_tier: getSelectionLabel(),
        amount: getSelectionPrice(),
        golfers: getGolfersSummary(),
        message: [
          `Registration Type: ${getSelectedRecipientType()}`,
          `Selection: ${getSelectionLabel()}`,
          `Amount Paid: ${getSelectionPrice()}`,
          "",
          "Contact Information",
          `Name: ${formData.name}`,
          `Email: ${formData.email}`,
          `Phone: ${formData.phone || "N/A"}`,
          `Address: ${formData.address || "N/A"}`,
          `City: ${formData.city || "N/A"}`,
          `State: ${formData.state || "N/A"}`,
          `Zip: ${formData.zip || "N/A"}`,
          "",
          "Golfer Details",
          getGolfersSummary(),
        ].join("\n"),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Web3Forms email delivery failed.");
    }
  };

  useEffect(() => {
    if (formStep === 3 && !paymentSuccess) {
      // Clean up previous instance if exists
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
          await cardObj.attach('#square-card-container');
          setCard(cardObj);
        } catch (e) {
          console.error("Square initialization failed:", e);
        }
      };
      document.body.appendChild(script);

      return () => {
        if (card) {
          card.destroy();
        }
      };
    }
  }, [formStep, paymentSuccess]);

  const handleRegisterCTA = () => {
    if (!selectedPackage) {
      toast.error("Please select a registration package first.");
      return;
    }
    setFormStep(1);
    setRegisterFormOpen(true);
  };

  const handleNextStep = () => {
    if (formStep === 1) {
      if (!formData.name || !formData.email) {
        toast.error("Name and email are required to continue.");
        return;
      }
      if (selectedPackage === "cocktail" || selectedTier) {
        setFormStep(3);
      } else {
        setFormStep(2);
      }
    } else if (formStep === 2) {
      setFormStep(3);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!card) return;
    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const result = await card.tokenize();
      if (result.status === "OK") {
        let amount = 0;
        let pName = "";

        if (selectedPackage) {
          const pkg = packages.find(p => p.id === selectedPackage);
          amount = parseInt((pkg?.price || "0").replace(/[^0-9]/g, "")) * 100;
          pName = pkg?.title || "";
        } else if (selectedTier) {
          const tier = tiers.find(t => t.id === selectedTier);
          amount = parseInt((tier?.price || "0").replace(/[^0-9]/g, "")) * 100;
          pName = tier?.tier || "";
        }

        const response = await fetch("/api/payments/square", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: result.token,
            amount,
            registrantEmail: formData.email,
            packageName: pName,
            golferDetails: formData.golfers,
          })
        });

        // Read as text first so we can always inspect the body,
        // even if it's not valid JSON (e.g. HTML error page from proxy)
        const rawText = await response.text();
        let data: any = {};
        try {
          data = JSON.parse(rawText);
        } catch {
          // Server returned something that's not JSON (HTML error page, empty body, etc.)
          console.error(`[Payment] Non-JSON response — HTTP ${response.status}:`, rawText.slice(0, 300));
          if (response.status === 503 || response.status === 502) {
            setPaymentError("API server is not running. Run: npm run dev");
          } else if (response.status === 404) {
            setPaymentError("Payment endpoint not found (404). Check your deployment config.");
          } else {
            setPaymentError(`Payment server error (${response.status}). Please try again.`);
          }
          return;
        }

        if (response.ok && data.success) {
          setEmailNotificationStatus("sending");
          setEmailNotificationError(null);

          try {
            await sendRegistrationEmail();
            setEmailNotificationStatus("sent");
          } catch (emailError: any) {
            const errorMessage = emailError?.message || "Payment succeeded, but the confirmation email could not be sent.";
            setEmailNotificationStatus("failed");
            setEmailNotificationError(errorMessage);
            toast.error(errorMessage);
          }

          setPaymentSuccess(true);
        } else {
          setPaymentError(data.error || "Payment failed. Please try again.");
        }
      } else {
        setPaymentError(result.errors?.[0]?.message || "Failed to tokenize card");
      }
    } catch (e: any) {
      setPaymentError(e.message || "An unexpected error occurred");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSponsorCTA = () => {
    if (!selectedTier) {
      toast.error("Please select a sponsorship tier first.");
      return;
    }
    setSelectedPackage(null);
    setFormStep(1);
    setRegisterFormOpen(true);
  };

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative min-h-[55svh] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img src={golfHero} alt="" className="w-full h-full object-cover scale-105 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0 floral-pattern opacity-[0.05] mix-blend-overlay" />

        <div className="container-x relative z-10 py-24 md:py-36 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-soft">2026 Annual Fundraiser</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.85] tracking-tighter mb-6 text-white">
              2026 Charity Golf Outing<br />
              <span className="italic text-[#72a8ff]">Join Us.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl leading-relaxed font-medium">
              Reserve your spot or become a sponsor for our annual outing. All proceeds support charitable organizations in our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TAB TOGGLE */}
      <section className="container-x py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Tab Switcher */}
          <motion.div variants={fadeUp} className="flex justify-center mb-14">
            <div className="inline-flex bg-[#f0f2f5] rounded-2xl p-1.5 gap-1">
              {(["register", "sponsor"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-8 py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  {tab === "register" ? "Register" : "Become a Sponsor"}
                </button>
              ))}
            </div>
          </motion.div>

          {/* REGISTER SECTION */}
          {activeTab === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <span className="eyebrow justify-center mx-auto flex">Registration</span>
                <h2 className="mt-4 font-display text-3xl md:text-5xl text-primary leading-[1.05]">
                  Choose your <span className="italic text-[#72a8ff]">package.</span>
                </h2>
                <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                  Select the option that works best for you or your team. All packages include access to the full day of events.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {packages.map((pkg, i) => {
                  const isSelected = selectedPackage === pkg.id;
                  let Icon = Flag;
                  if (pkg.id === "foursome") Icon = Users;
                  if (pkg.id === "cocktail") Icon = Star;

                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative rounded-3xl p-8 border-2 cursor-pointer transition-all duration-300 hover-lift ${isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-elegant"
                          : pkg.featured
                            ? "bg-[#dcdcdc] border-accent/30 shadow-md"
                            : "bg-[#dcdcdc] border-border hover:border-accent/40"
                        }`}
                    >
                      {pkg.featured && !isSelected && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-accent-foreground text-xs uppercase tracking-[0.2em] font-semibold px-4 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isSelected ? "bg-white/15" : "bg-gradient-gold shadow-gold"}`}>
                        <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-accent-foreground"}`} strokeWidth={1.5} />
                      </div>
                      <p className={`text-xs uppercase tracking-[0.25em] font-black mb-2 ${isSelected ? "text-white/60" : "text-accent"}`}>{pkg.title}</p>
                      <div className={`font-display text-5xl leading-none mb-6 ${isSelected ? "text-white" : "text-primary"}`}>{pkg.price}</div>
                      <ul className={`space-y-2.5 text-sm ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                        {pkg.includes?.map((item: string) => (
                          <li key={item} className="flex items-center gap-2">
                            <Check className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? "text-white/60" : "text-accent"}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row justify-center mt-12 gap-4">
                <Button
                  onClick={handleRegisterCTA}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-gold text-accent-foreground rounded-full px-8 md:px-16 h-14 md:h-16 text-lg md:text-xl font-black shadow-gold hover:scale-105 transition-transform"
                >
                  Reserve Your Spot <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
                </Button>
              </div>
              <p className="text-center text-muted-foreground text-sm mt-4">
                Questions? Email us at <a href="mailto:info@smgcares.org" className="text-primary font-semibold underline">info@smgcares.org</a>
              </p>
            </motion.div>
          )}

          {/* SPONSOR SECTION */}
          {activeTab === "sponsor" && (
            <motion.div
              key="sponsor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <span className="eyebrow justify-center mx-auto flex">Sponsorship</span>
                <h2 className="mt-4 font-display text-3xl md:text-5xl text-primary leading-[1.05]">
                  Become a <span className="italic text-[#72a8ff]">sponsor.</span>
                </h2>
                <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                  Your organization's support directly funds the causes we champion. Choose the tier that reflects your commitment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto max-h-[600px] overflow-y-auto p-2 pr-4 custom-scrollbar">
                {tiers.map((s, i) => {
                  const isSelected = selectedTier === s.id;
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      onClick={() => setSelectedTier(s.id)}
                      className={`relative rounded-3xl p-8 border-2 cursor-pointer transition-all duration-300 hover-lift ${isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-elegant"
                          : s.featured
                            ? "bg-[#dcdcdc] border-accent/30 shadow-md"
                            : "bg-[#dcdcdc] border-border hover:border-accent/40"
                        }`}
                    >
                      {s.featured && !isSelected && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-accent-foreground text-xs uppercase tracking-[0.2em] font-semibold px-4 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isSelected ? "bg-white/15" : "bg-gradient-gold shadow-gold"}`}>
                        <Trophy className={`w-6 h-6 ${isSelected ? "text-white" : "text-accent-foreground"}`} strokeWidth={1.5} />
                      </div>
                      <p className={`text-xs uppercase tracking-[0.25em] font-black mb-2 ${isSelected ? "text-white/60" : "text-accent"}`}>{s.tier}</p>
                      <div className={`font-display text-4xl leading-none mb-6 ${isSelected ? "text-white" : "text-[#72a8ff]"}`}>{s.price}</div>
                      <ul className={`space-y-2 text-sm ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                        {s.perks?.map((p: string) => (
                          <li key={p} className="flex items-center gap-2">
                            <span className={`flex-shrink-0 ${isSelected ? "text-white/60" : "text-accent"}`}>→</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row justify-center mt-12 gap-4">
                <Button
                  onClick={handleSponsorCTA}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-gold text-accent-foreground rounded-full px-8 md:px-16 h-14 md:h-16 text-lg md:text-xl font-black shadow-gold hover:scale-105 transition-transform"
                >
                  Become a Sponsor <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
                </Button>
              </div>
              <p className="text-center text-muted-foreground text-sm mt-4">
                Questions? Email us at <a href="mailto:info@smgcares.org" className="text-primary font-semibold underline">info@smgcares.org</a>
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* REGISTRATION FORM DIALOG */}
      <Dialog open={registerFormOpen} onOpenChange={handleRegisterFormOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-[#fdfdfd] border-white/20 p-0 overflow-hidden shadow-2xl">
          <div className="bg-primary/5 p-6 border-b border-primary/10">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-primary flex items-center gap-2">
                {paymentSuccess ? "Registration Complete" : formStep === 1 ? "Contact Information" : formStep === 2 ? "Golfer Details" : "Secure Payment"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {paymentSuccess ? "" : formStep === 1 ? "Please provide your billing and contact info." : formStep === 2 ? "Please provide the names and emails of your golfers." : "Enter your payment details to complete registration."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6">
            {formStep === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="bg-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input id="zip" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} className="bg-white" />
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {formStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {selectedPackage === "individual" && (
                  <div className="space-y-4 p-4 border rounded-xl bg-white">
                    <h4 className="font-semibold">Golfer 1</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={formData.golfers[0].name} onChange={e => {
                          const newGolfers = [...formData.golfers];
                          newGolfers[0].name = e.target.value;
                          setFormData({ ...formData, golfers: newGolfers });
                        }} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" value={formData.golfers[0].email} onChange={e => {
                          const newGolfers = [...formData.golfers];
                          newGolfers[0].email = e.target.value;
                          setFormData({ ...formData, golfers: newGolfers });
                        }} />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPackage === "foursome" && (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="space-y-4 p-4 border rounded-xl bg-white">
                        <h4 className="font-semibold">Golfer {i + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={formData.golfers[i].name} onChange={e => {
                              const newGolfers = [...formData.golfers];
                              newGolfers[i].name = e.target.value;
                              setFormData({ ...formData, golfers: newGolfers });
                            }} />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={formData.golfers[i].email} onChange={e => {
                              const newGolfers = [...formData.golfers];
                              newGolfers[i].email = e.target.value;
                              setFormData({ ...formData, golfers: newGolfers });
                            }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {formStep === 3 && !paymentSuccess && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <p className="text-sm text-muted-foreground font-semibold mb-1">Total Due:</p>
                  <p className="text-3xl font-display text-primary">
                    {selectedPackage ? packages.find(p => p.id === selectedPackage)?.price : tiers.find(t => t.id === selectedTier)?.price}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {selectedPackage ? packages.find(p => p.id === selectedPackage)?.title : tiers.find(t => t.id === selectedTier)?.tier}
                  </p>
                </div>

                <div className="min-h-[80px]">
                  <div id="square-card-container"></div>
                </div>

                {paymentError && (
                  <div className="text-red-500 text-sm font-medium mt-2 p-3 bg-red-50 rounded-md border border-red-100">
                    {paymentError}
                  </div>
                )}
              </motion.div>
            )}

            {paymentSuccess && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display text-primary">You're registered!</h3>
                <p className="text-muted-foreground max-w-sm">
                  {emailNotificationStatus === "sent"
                    ? `Thank you, ${formData.name}. A confirmation email with your payment and registration details has been sent to ${formData.email}. We look forward to seeing you on the course.`
                    : `Thank you, ${formData.name}. Your payment was successful and your registration has been recorded.`}
                </p>
                {emailNotificationStatus === "failed" && emailNotificationError && (
                  <p className="text-sm text-red-500 max-w-sm">{emailNotificationError}</p>
                )}
              </motion.div>
            )}
          </div>

          <div className="p-4 bg-muted/50 border-t flex justify-between">
            {paymentSuccess ? (
              <div className="w-full flex justify-center">
                <Button onClick={resetRegistrationForm} className="w-full sm:w-auto bg-primary">Return Home</Button>
              </div>
            ) : (
              <>
                {formStep > 1 && formStep < 4 ? (
                  <Button variant="outline" onClick={() => {
                    if (formStep === 3 && (selectedPackage === "cocktail" || selectedTier)) {
                      setFormStep(1);
                    } else {
                      setFormStep(formStep - 1);
                    }
                  }} disabled={paymentLoading}><ChevronLeft className="mr-2 h-4 w-4" /> Back</Button>
                ) : (
                  <Button variant="outline" onClick={() => setRegisterFormOpen(false)} disabled={paymentLoading}>Cancel</Button>
                )}

                {formStep < 3 ? (
                  <Button onClick={handleNextStep} className="bg-primary text-primary-foreground hover:bg-primary/90">Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                ) : (
                  <Button onClick={handlePaymentSubmit} disabled={paymentLoading || !card} className="bg-gradient-gold text-accent-foreground font-bold hover:scale-105 transition-transform flex items-center">
                    {paymentLoading ? (
                      <span className="flex items-center"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground mr-2"></span> Processing...</span>
                    ) : "Pay Now"}
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ContactDialog open={contact} onOpenChange={setContact} />
    </PageShell>
  );
};

export default GolfRegister;
