import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, HandHeart, Users, Sparkles, HeartHandshake, Search, Heart, LifeBuoy, ChevronLeft, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";

import { RotatingWords } from "@/components/RotatingWords";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
import heroImg from "@/assets/hero-bg.png";
import img1 from "@/assets/Gallery pages images/A7R00958.jpg";
import img2 from "@/assets/Gallery pages images/_JP_0067.jpg";
import img3 from "@/assets/Gallery pages images/_JP_4444.jpg";
import img4 from "@/assets/Gallery pages images/_JP_9743.jpg";
import golfOutingImg from "@/assets/golf-outing.png";
import dinnerImg from "@/assets/dinner.png";
import smgLogo from "@/assets/logo.webp";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const initialEventsData = [
  {
    id: "static-2026",
    year: "2026",
    tag: "Upcoming",
    title: "Annual Charity Golf Outing",
    body: "Join us on Month Day, Year for our annual outing — a day of community, competition, and impact.",
    cta: "Register Now",
    to: "/golf",
    image: golfOutingImg
  },
  {
    id: "static-2025",
    year: "2025",
    tag: "Past Event",
    title: "Annual Charity Golf Outing",
    body: "A successful event raising $XXX,XXX for Charity Name — thank you to every participant and sponsor.",
    cta: "View Event",
    to: "/events/static-2025",
    image: dinnerImg,
    secondary: true
  }
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } },
};

const Index = () => {
  const [contact, setContact] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [eventsData, setEventsData] = useState(initialEventsData);
  const carouselImages = [img1, img2, img3, img4];
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fetchedEvents = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as any[];
          // Merge fetched events with initial static events
          setEventsData([...fetchedEvents, ...initialEventsData]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <PageShell>
      {/* HERO: Cinematic Signature Layout */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#1a3052]">
        <img 
          src={heroImg} 
          alt="" 
          fetchpriority="high" 
          loading="eager" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" 
        />
        <div className="absolute inset-0 " />

        {/* Brand Layers & Cinematic Filters */}
        <div className="absolute inset-0 floral-pattern opacity-[0.25] mix-blend-overlay" />

        <div className="container-x relative pt-32 pb-20 text-center z-10">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.15 } } }} className="max-w-4xl mx-auto flex flex-col items-center">

            <motion.div variants={fadeUp} className="mb-10 px-6 py-2 rounded-full border border-white/20 bg-transparent flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-white/80" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white">SMG CARES · CHARITABLE FOUNDATION</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[7.5rem] leading-[0.95] tracking-tighter text-white mb-6 text-balance">
              Giving Back &amp; <br />
              <span className="italic text-[#72a8ff]">Changing Lives.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-3xl text-[14px] md:text-[16px] text-white/80 leading-relaxed mb-12 font-medium">
              SMG Cares raises funds for charitable organizations and gives back to our communities. We provide financial assistance to families, employees, and local charities during difficult times.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center">
              {/* Card 1: Donate Now */}
              <Link to="/donate" className="group w-full sm:w-auto flex items-center gap-4 bg-[#1C61D1] rounded-[1.25rem] p-3 pr-20 border border-white/5 hover:scale-105 transition-transform shadow-lg">
                <div className="bg-white/10 p-3 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Make a Donation</span>
                  <span className="block text-white font-bold text-[17px] leading-tight mt-0.5">Donate Now</span>
                </div>
              </Link>

              {/* Card 2: Register */}
              <Link to="/golf" className="group w-full sm:w-auto flex items-center gap-4 bg-white rounded-[1.25rem] p-3 pr-16 hover:scale-105 transition-transform shadow-lg text-left">
                <div className="bg-[#eff3f9] p-3 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-[#1a3052]" />
                </div>
                <div className="text-left">
                  <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-[#888]">Annual Event</span>
                  <span className="block text-[#1a3052] font-bold text-[17px] leading-tight mt-0.5">Register Now</span>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section className="container-x py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:col-span-7">
            <span className="eyebrow">Our Mission</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-primary">
              Three pillars,<br />
              <span className="italic gold-text">one purpose.</span>
            </h2>
          </motion.div>
          <p className="lg:col-span-5 text-muted-foreground text-lg leading-relaxed font-medium">
            Every dollar raised channels generosity into lasting change where it's needed most.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: HandHeart, title: "Raise Funds for Charities", body: "Raising money to provide financial assistance to charitable organizations doing meaningful work." },
            { icon: Users, title: "Support Local Communities", body: "Supporting local communities through donations and dedicated volunteer efforts." },
            { icon: HeartHandshake, title: "Support Employees & Families", body: "Providing financial support to staff and their families during times of hardship." },
          ].map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-[#f8f9fa] border border-border rounded-3xl p-8 md:p-10 hover-lift overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold mb-8">
                  <p.icon className="w-7 h-7 text-accent-foreground" strokeWidth={1.5} />
                </div>
                <div className="text-7xl font-display text-accent/20 absolute right-0 top-0 leading-none">0{i + 1}</div>
                <h3 className="font-display text-xl md:text-2xl text-primary leading-tight">{p.title}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed font-medium">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button asChild size="lg" className="bg-primary text-primary-foreground rounded-full px-12 h-16 text-xl font-black hover:bg-primary-glow shadow-elegant">
            <Link to="/donate">Donate Now <Sparkles className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      <hr className="border-border" />

      {/* WHO WE ARE */}
      <section className="relative bg-gradient-cream py-28 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="container-x relative">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow mx-auto justify-center flex mb-2">Who We Are</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-primary">
              Backed by <span className="italic gold-text">SMG ABA</span> & partners who care.
            </h2>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full max-w-6xl mx-auto aspect-[18/9] rounded-[3rem] overflow-hidden shadow-elegant mb-16 relative bg-muted/20">
            <AnimatePresence>
              <motion.img
                key={currentImageIndex}
                src={carouselImages[currentImageIndex]}
                alt="Community"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7">
              <div className="flex items-center gap-6 mb-8">
                <img src={smgLogo} alt="SMG ABA Logo" className="h-20 w-auto" />
                <div className="h-px flex-1 shimmer-line" />
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl font-medium">
                SMG Cares is supported by SMG ABA LLC and our incredible partners who show support annually. We collectively share a commitment to making a positive impact locally within our communities and industries.
              </p>
              <Button asChild size="lg" variant="ghost" className="mt-10 group text-primary hover:text-accent hover:bg-transparent px-0 text-lg font-black tracking-widest uppercase">
                <Link to="/about">
                  Learn More
                  <ArrowUpRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </Button>
            </div>

            <div className="lg:col-span-5 flex lg:justify-end">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white border border-border rounded-[3rem] p-8 md:p-14 shadow-elegant w-full max-w-md relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="text-6xl md:text-9xl font-display gold-text leading-none mb-6">100%</div>
                <p className="text-lg md:text-2xl text-primary font-black leading-tight relative z-10 uppercase tracking-tighter">
                  of donations directly fund charitable impact.
                </p>
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* EVENTS */}
      <section className="container-x py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="eyebrow">Events</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl text-primary leading-[1.05]">
              Moments that<br /><span className="italic gold-text">made a difference.</span>
            </h2>
          </div>
          <Link to="/events" className="text-sm font-black uppercase tracking-widest text-primary underline-grow">View all events →</Link>
        </div>

        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4 md:-ml-8">
            {eventsData.map((event, i) => (
              <CarouselItem key={i} className="pl-4 md:pl-8 md:basis-1/2">
                <EventCard {...event} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Mobile: centred arrows + dot indicators */}
          <div className="flex md:hidden items-center justify-center gap-5 mt-8">
            <CarouselPrevious className="static transform-none h-11 w-11 rounded-full bg-white border border-border shadow-md hover:scale-105 text-primary flex items-center justify-center arrow-bounce" />
            <div className="flex gap-2">
              {eventsData.map((_, i) => (
                <span
                  key={i}
                  className="block h-2 rounded-full bg-primary/20 transition-all duration-300"
                  style={{ width: i === 0 ? '24px' : '8px', background: i === 0 ? 'hsl(var(--primary))' : undefined }}
                />
              ))}
            </div>
            <CarouselNext className="static transform-none h-11 w-11 rounded-full bg-white border border-border shadow-md hover:scale-105 text-primary flex items-center justify-center arrow-bounce" />
          </div>


        </Carousel>
      </section>

      {/* CTA STRIP */}
      <section className="container-x relative mb-24">
        <div className="relative py-16 px-6 md:py-24 md:px-12 bg-primary text-primary-foreground overflow-hidden rounded-[2rem] md:rounded-[3.5rem] max-w-6xl mx-auto shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--accent)/0.5),transparent_60%)]" />
          <div className="absolute inset-0 floral-pattern opacity-[0.05]" />
          <div className="relative text-center">
            <h2 className="font-display text-4xl md:text-7xl leading-[0.85] tracking-tighter mb-8">
              Be part of the<br /><span className="italic text-[#1E63D1]">next chapter.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-primary-foreground/80 text-lg md:text-xl leading-relaxed font-medium mb-12">
              Your contribution becomes someone's turning point. Join us in the vital work of giving back.
            </p>
            <Button asChild size="lg" className="bg-gradient-gold text-accent-foreground rounded-full px-8 md:px-16 h-14 md:h-20 text-lg md:text-2xl font-black shadow-gold hover:scale-105 transition-transform">
              <Link to="/donate">Donate Now <ArrowRight className="ml-3 h-7 w-7" /></Link>
            </Button>
          </div>
        </div>
      </section>
      <ContactDialog open={contact} onOpenChange={setContact} />
    </PageShell>
  );
};


const EventCard = ({ id, year, tag, title, body, cta, to, image, secondary }: any) => {
  const isPast = parseInt(year) < 2026 || tag?.toLowerCase().includes("past");
  const buttonText = isPast ? "Read More" : "Register Now";
  const linkTo = isPast ? (id ? `/events/${id}` : "/events") : (to || "/golf");

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-[#dcdcdc] border border-border rounded-3xl overflow-hidden hover-lift">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
      </div>
      <div className="p-8 md:p-10">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <span>{tag}</span>
          <span className="font-display text-3xl text-accent not-italic">{year}</span>
        </div>
        <h3 className="mt-4 font-display text-2xl md:text-3xl text-primary leading-tight">{title}</h3>
        <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-2">{body}</p>
        <Button asChild className={`mt-8 rounded-full ${secondary ? "bg-primary text-primary-foreground" : "bg-gradient-gold text-accent-foreground shadow-gold"}`}>
          <Link to={linkTo}>{buttonText} <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default Index;
