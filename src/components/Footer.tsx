import React from 'react';
import { Compass, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { db } from '../lib/db';
import { normalizePhoneForWhatsApp } from '../lib/bookingLogic';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const settings = db.getSettings();
  const whatsappUrl = `https://wa.me/${normalizePhoneForWhatsApp(settings.whatsappNumber)}?text=${encodeURIComponent('Hello Sreemangal Tourist Information Desk!')}`;

  return (
    <footer className="bg-[#123524] text-stone-300 pt-14 pb-10 border-t border-[#1a4933]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#1a4933]">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-white text-lg font-bold tracking-tight">
                {settings.brandName}
              </span>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed">
              The free, transparent tourist guide for Sreemangal and Moulvibazar. Helping travelers avoid tout markups with authentic travel costs, train schedules, famous restaurant guides, and verified destination tips.
            </p>
            <div className="pt-2 text-xs text-stone-400">
              <p className="font-semibold text-stone-300">Local Information Area</p>
              <p>{settings.serviceArea}</p>
            </div>
          </div>

          {/* Quick Discover */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Explore & Cost Guides
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setCurrentTab('calculator')}
                  className="hover:text-white transition-colors text-emerald-400 font-semibold"
                >
                  Interactive Cost Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('map')}
                  className="hover:text-white transition-colors text-emerald-300 font-semibold"
                >
                  Interactive Google Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('places')}
                  className="hover:text-white transition-colors"
                >
                  Destinations & Entry Fees
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('food')}
                  className="hover:text-white transition-colors"
                >
                  Famous Food & 7-Layer Tea
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('stays')}
                  className="hover:text-white transition-colors"
                >
                  Resorts & Hotels Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('transit')}
                  className="hover:text-white transition-colors"
                >
                  Train Timetables & Bus Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Practical Info & Transport */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Local Transport & Routes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setCurrentTab('transport')}
                  className="hover:text-white transition-colors text-left"
                >
                  CNG & Chander Gari Standard Fares
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('trips')}
                  className="hover:text-white transition-colors text-left"
                >
                  Curated 1-Day & 2-Day Routes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('about')}
                  className="hover:text-white transition-colors"
                >
                  Tourist Safety & Local Advice
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('policies')}
                  className="hover:text-white transition-colors text-left"
                >
                  Transparency & Non-Commercial Notice
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & WhatsApp */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-2">
              Tourist Assistance
            </h4>
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${settings.supportPhone}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.supportPhone} (Helpline)</span>
              </a>
              <a
                href={`mailto:${settings.supportEmail}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.supportEmail}</span>
              </a>
              <div className="flex items-start gap-2.5 text-stone-400 pt-1">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Station Road, Sreemangal Sadar, Moulvibazar - 3210</span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask Helpline on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar & Honest Legal Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>
            © {new Date().getFullYear()} {settings.brandName}. Data and information portal for tourists in Sreemangal.
          </p>
          <p className="max-w-xl text-center md:text-right text-stone-400 text-[11px] leading-relaxed">
            Data Notice: Sreemangal Explorer is an independent tourist information project. All fares, schedules, and menus reflect verified seasonal market benchmarks to protect travelers from overpaying.
          </p>
        </div>
      </div>
    </footer>
  );
};
