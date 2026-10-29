import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Car,
  Calculator,
  Utensils,
  Bed,
  Train,
  Calendar,
  Menu,
  X,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { db } from '../lib/db';
import { normalizePhoneForWhatsApp } from '../lib/bookingLogic';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settings = db.getSettings();
  const whatsappUrl = `https://wa.me/${normalizePhoneForWhatsApp(settings.whatsappNumber)}?text=${encodeURIComponent('Hello Sreemangal Tourist Information Desk! I have a question about my trip.')}`;

  const navLinks = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'calculator', label: 'Cost Calculator', icon: Calculator },
    { id: 'map', label: 'Google Map', icon: MapPin },
    { id: 'places', label: 'Destinations', icon: Compass },
    { id: 'food', label: 'Food & Restaurants', icon: Utensils },
    { id: 'stays', label: 'Resorts & Hotels', icon: Bed },
    { id: 'transit', label: 'Train & Bus', icon: Train },
    { id: 'transport', label: 'Transport Fares', icon: Car },
    { id: 'trips', label: 'Trip Plans', icon: Calendar },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner: Local Support Hotline */}
      <div className="bg-[#123524] text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="truncate">
              Official Sreemangal Tourist Information & Fair Travel Guide · Data Only
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`tel:${settings.supportPhone}`}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{settings.supportPhone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Ask Local Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#123524] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight tracking-tight text-[#18201b]">
                {settings.brandName}
              </div>
              <div className="text-[11px] text-stone-500 font-medium">
                Tourist Guide & Travel Cost Hub
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    active
                      ? 'bg-[#123524] text-white shadow-sm'
                      : 'text-stone-700 hover:text-[#123524] hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Direct CTA */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('calculator')}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cost Calculator</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('calculator')}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200"
            >
              Cost Calc
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 ${
                currentTab === item.id
                  ? 'bg-[#123524] text-white'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 text-emerald-700" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
