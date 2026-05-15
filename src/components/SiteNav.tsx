import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "./ContactDialog";
import smgLogo from "@/assets/logo.webp";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/events", label: "Recent Events" },
  { to: "/golf", label: "2026 Golf Fundraiser" },
  { to: "/gallery", label: "Gallery" },
];

export const SiteNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isSolidNav = scrolled || pathname.startsWith('/admin') || pathname === '/privacy' || pathname === '/terms';

  return (
    <>
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <div className={`flex items-center justify-between w-full max-w-6xl h-14 px-6 rounded-full transition-all duration-500 border border-white/10 ${isSolidNav ? "bg-primary/90 backdrop-blur-xl shadow-lg scale-[0.98]" : "bg-white/10 backdrop-blur-md"}`}>
          <Link to="/" className="flex items-center group shrink-0">
            <img src={smgLogo} alt="SMG Cares" className="h-10 md:h-12 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `text-[11px] uppercase tracking-widest font-semibold transition-colors ${isActive ? "text-accent-soft" : "text-white/80 hover:text-white"}`}>
                {l.label}
              </NavLink>
            ))}
            <button onClick={() => setContactOpen(true)} className="text-[11px] uppercase tracking-widest font-semibold text-white/80 hover:text-white transition-colors">Contact</button>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="hidden sm:inline-flex bg-gradient-gold text-accent-foreground hover:opacity-90 rounded-full px-5 h-8 text-xs font-bold uppercase tracking-wider">
              <Link to="/donate">Donate Now</Link>
            </Button>
            <button onClick={() => setOpen(o => !o)} className="lg:hidden p-1.5 text-white" aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-20 inset-x-4 lg:hidden overflow-hidden rounded-3xl p-6 bg-primary/95 backdrop-blur-2xl border border-white/10">
              <div className="flex flex-col gap-4">
                {links.map(l => (
                  <NavLink key={l.to} to={l.to} className="text-lg font-display text-white py-1 border-b border-white/10">{l.label}</NavLink>
                ))}
                <button onClick={() => { setOpen(false); setContactOpen(true); }} className="text-lg font-display text-white py-1 text-left border-b border-white/10">Contact Us</button>
                <Button asChild className="bg-gradient-gold text-accent-foreground rounded-full mt-2"><Link to="/donate">Donate Now</Link></Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </>
  );
};