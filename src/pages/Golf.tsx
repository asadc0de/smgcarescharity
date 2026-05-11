import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Trophy } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
import golfHero from "@/assets/golf-hero.jpg";
import g2 from "@/assets/gallery-2.jpg";
import e1 from "@/assets/event-2025.jpg";
import g3 from "@/assets/gallery-3.jpg";

const sponsorships = [
  { tierName: "Title Sponsor", price: "$25,000", isFeatured: true, perks: ["Naming rights", "Premium hole signage", "Foursome included", "Banner placement", "Social recognition"] },
  { tierName: "Eagle Sponsor", price: "$10,000", isFeatured: false, perks: ["Foursome included", "Hole signage", "Dinner table for 8", "Program recognition"] },
  { tierName: "Birdie Sponsor", price: "$5,000", isFeatured: false, perks: ["Twosome included", "Hole signage", "Program recognition"] },
  { tierName: "Hole Sponsor", price: "$1,500", isFeatured: false, perks: ["Custom hole signage", "Program recognition"] },
];

const stats = [{ number: "120+", label: "Players" }, { number: "$250K", label: "Goal Raised" }, { number: "20+", label: "Sponsors" }];
const gallery = [g2, e1, g3, golfHero];

const Golf = () => {
  const [contact, setContact] = useState(false);

  return (
    <PageShell>
      <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img src={golfHero} alt="Golf Hero" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-primary/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0 floral-pattern opacity-[0.05] mix-blend-overlay" />
        <div className="container-x relative z-10 py-32 mt-20">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-8 xl:col-span-7">
              <div className="relative p-1 md:p-12 lg:p-0">
                <div className="relative">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-soft">2026 Annual Fundraiser</span>
                  </div>
                  <h1 className="font-display text-7xl sm:text-5xl md:text-6xl lg:text-[5rem] leading-[0.75] tracking-tighter mb-12 text-white drop-shadow-2xl">
                    The <span className="italic text-[#72a8ff]">Charity</span><br />Golf Outing
                  </h1>
                  <p className="max-w-xl text-sm md:text-lg text-white/70 leading-relaxed font-medium mb-12 drop-shadow-lg">
                    A signature day of golf, fellowship, and fundraising in support of the causes we care about most.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-6 md:gap-10 py-10 border-y border-white/10 mb-12">
                    {[
                      { icon: Calendar, label: "Date", val: "September 28th" },
                      { icon: MapPin, label: "Location", val: "Elite Golf Club" },
                      { icon: Trophy, label: "Goal", val: "Awards & Impact" }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold">
                          <item.icon className="text-accent-foreground" size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black mb-1 leading-none">{item.label}</p>
                          <p className="text-lg font-bold text-white leading-none tracking-tight">{item.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-5">
                    <Button asChild size="lg" className="bg-gradient-gold text-accent-foreground rounded-full px-8 md:px-14 h-14 md:h-18 text-lg md:text-xl font-black shadow-gold hover:scale-105 transition-transform w-full sm:w-auto">
                      <Link to="/golf-register">Register Now <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" /></Link>
                    </Button>
                    <Button onClick={() => setContact(true)} size="lg" variant="outline" className="bg-white/5 border-white/20 text-white backdrop-blur-md hover:bg-white/10 rounded-full px-8 md:px-14 h-14 md:h-18 text-lg md:text-xl font-black transition-all w-full sm:w-auto">
                      Contact Us
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.4 }} className="lg:col-span-4 xl:col-span-5 hidden lg:flex flex-col items-center gap-12">
              <div className="relative">
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -inset-10 border-2 border-white/5 rounded-[4rem] rotate-12" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -inset-16 border border-accent/20 rounded-[5rem] -rotate-12" />
                <div className="relative z-10 w-72 h-72 bg-gradient-navy rounded-[3.5rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                  <div className="absolute inset-0 floral-pattern opacity-10" />
                  <Trophy className="text-accent-soft mb-6 relative z-10" size={64} />
                  <p className="text-[10px] uppercase tracking-[0.5em] font-black text-accent-soft relative z-10 mb-2">Annual</p>
                  <h3 className="font-display text-4xl text-white relative z-10 leading-none">Prestige</h3>
                  <div className="h-px w-10 bg-accent/30 my-4 relative z-10" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-28 grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className="lg:col-span-5">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant">
            <img src={e1} alt="Event" loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <span className="eyebrow">About the Event</span>
          <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl text-primary leading-[1.05]">A day on the green, a year of <span className="italic text-[#72a8ff]">impact.</span></h2>
          <div className="mt-8 text-lg text-muted-foreground leading-relaxed">
            <p>Join us for a full day of golf, networking, and giving. From tee-off to dinner reception, every moment is designed to connect our community while raising essential funds for the charities we support.</p>
          </div>
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {stats.map(s => (
              <div key={s.label} className="border-l-2 border-accent pl-4">
                <div className="font-display text-4xl gold-text">{s.number}</div>
                <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-cream py-16 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="container-x relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow justify-center">Sponsorship</span>
            <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl text-primary leading-[1.05]">Become a <span className="italic text-[#72a8ff]">sponsor.</span></h2>
            <p className="mt-6 text-muted-foreground text-lg">Choose the level that's right for your organization. Every sponsor makes our mission possible.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorships.map((s, i) => (
              <motion.div key={s.tierName} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`relative rounded-3xl p-8 border hover-lift flex flex-col ${s.isFeatured ? "bg-primary text-primary-foreground border-primary shadow-elegant" : "bg-[#dcdcdc] border-border"}`}>
                {s.isFeatured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-accent-foreground text-xs uppercase tracking-[0.2em] font-semibold px-4 py-1 rounded-full">Featured</span>}
                <p className="text-xs uppercase tracking-[0.25em] text-accent">{s.tierName}</p>
                <div className={`mt-3 font-display text-4xl ${s.isFeatured ? "text-primary-foreground" : "gold-text"}`}>{s.price}</div>
                <ul className={`mt-6 mb-8 space-y-2 text-sm flex-grow ${s.isFeatured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {s.perks.map(p => <li key={p} className="flex gap-2"><span className="text-accent">→</span>{p}</li>)}
                </ul>
                <Button asChild className={`mt-auto w-full rounded-full ${s.isFeatured ? "bg-gradient-gold text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                  <Link to="/golf-register">Become a Sponsor</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16 md:py-28">
        <div className="mb-12">
          <span className="eyebrow">Gallery</span>
          <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl text-primary">From <span className="italic text-[#72a8ff]">past outings.</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`overflow-hidden rounded-2xl ${i % 2 ? "aspect-[3/4] mt-8" : "aspect-square"}`}>
              <img src={p} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <div className="relative py-16 md:py-24 bg-primary text-primary-foreground overflow-hidden rounded-[2rem] md:rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--accent)/0.6),transparent_60%)]" />
          <div className="absolute inset-0 floral-pattern opacity-[0.03]" />
          <div className="relative text-center px-6">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">Ready to <span className="italic text-[#72a8ff]">tee off?</span></h2>
            <p className="mt-6 max-w-xl mx-auto text-primary-foreground/80 text-lg">Reserve your spot or join us as a sponsor. Spaces fill quickly each year.</p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center flex-wrap gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-gold text-accent-foreground rounded-full px-8 md:px-10 h-14 md:h-16 font-black shadow-gold hover:scale-105 transition-transform">
                <Link to="/golf-register">Register Now</Link>
              </Button>
              <Button onClick={() => setContact(true)} size="lg" variant="outline" className="w-full sm:w-auto bg-white/5 border-white/20 text-white backdrop-blur-md hover:bg-white/10 rounded-full px-8 md:px-10 h-14 md:h-16 font-black transition-all">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ContactDialog open={contact} onOpenChange={setContact} />
    </PageShell>
  );
};

export default Golf;
