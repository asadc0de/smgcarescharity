import { useState } from "react";
import { Link } from "react-router-dom";

import { ContactDialog } from "./ContactDialog";

export const SiteFooter = () => {
  const [contact, setContact] = useState(false);
  
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden pt-16 md:pt-20">
      <div className="container-x relative z-10">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight">
            Your charitable <br /> <span className="italic text-accent-soft">foundation partner.</span>
          </h3>
          <Link 
            to="/golf-register"
            className="inline-block w-full md:w-auto px-8 md:px-12 py-4 md:py-6 border border-white/20 rounded-full text-xl md:text-3xl font-display hover:bg-white hover:text-primary transition-all text-center"
          >
            Start Here
          </Link>
        </div>

        {/* Columns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 mb-2">
          
          {/* Column 1 */}
          <div>
            <p className="font-display text-xl mb-6">Fundraising</p>
            <ul className="space-y-2 text-sm text-white/50">
              {[
                { label: "2026 Golf Outing", to: "/golf" },
                { label: "Recent Events", to: "/events" },
                { label: "Past Impact", to: "/events" },
                { label: "Donations", to: "/donate" }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-white transition-colors cursor-pointer block">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <p className="font-display text-xl mb-6">Explore</p>
            <ul className="space-y-2 text-sm text-white/50">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Gallery", to: "/gallery" },
                { label: "Contact", action: () => setContact(true) }
              ].map(link => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="hover:text-white transition-colors cursor-pointer block">{link.label}</Link>
                  ) : (
                    <button onClick={link.action} className="hover:text-white transition-colors cursor-pointer block text-left">{link.label}</button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 (Formerly 4) */}
          <div className="flex flex-col items-start">
            <p className="font-display text-xl mb-6">Institutional ↗</p>
            <div className="flex flex-col items-start gap-2 text-[10px] uppercase tracking-widest text-white/30 font-bold">
              <p>© {new Date().getFullYear()} SMG Cares</p>
              <p>Supported by SMG ABA</p>
            </div>
          </div>

        </div>

        {/* Massive Brand Text (Like reference) */}
        <div className="relative pointer-events-none select-none">
          <h2 className="font-display text-[27vw] leading-none tracking-tighter text-white opacity-10 -mb-5">
            smgcares
          </h2>
        </div>

      </div>
      {/* Legal Footer */}
        <div className="pt-6 mt-8 border-t border-white/10 text-center text-[10px] sm:text-xs uppercase tracking-widest text-white/50 font-bold flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-2 pb-6 px-4">
          <Link to="/" className="hover:text-white transition-colors cursor-pointer">SMG CARES</Link>
          <span className="text-white/20">I</span>
          <Link to="/terms" className="hover:text-white transition-colors cursor-pointer">ALL RIGHTS RESERVED</Link>
          <span className="text-white/20">I</span>
          <Link to="/privacy" className="hover:text-white transition-colors cursor-pointer">PRIVACY POLICY</Link>
          <span className="text-white/20">I</span>
          <span>SMG CARES IS A TAX-EXEMPT 501(C)(3)</span>
          <span className="text-white/20">I</span>
          <span>ID #41-2557942</span>
        </div>
      <ContactDialog open={contact} onOpenChange={setContact} />
    </footer>
  );
};
