"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, ShieldCheck, MapPin, Star, Phone, Mail, MessageSquare, 
  Globe, Briefcase, Calendar, Truck, ArrowRight, CheckCircle2, Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_AGENCIES } from "@/lib/mock-data/agencies";

export default function TourAgencyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const agency = MOCK_AGENCIES.find((a) => a.id === id);

  if (!agency) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8] dark:bg-[#081419]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Agency not found</h1>
          <Button onClick={() => router.push("/tour-agencies")} variant="ghost">Back to Agencies</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#081419] pb-24">
      {/* ══ HEADER BAR ══ */}
      <div className="bg-white dark:bg-[#0F252E] border-b border-[#E4E9EA] dark:border-[#20353D] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-sm font-bold text-[#4A5A62] dark:text-[#A9BCC2] hover:text-[#003366] dark:hover:text-[#3FCFC0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Agencies
          </button>
          
          <div className="flex items-center gap-4">
            <Button size="sm" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="font-bold bg-[#008080] hover:bg-[#005f5f] text-white rounded-xl px-5 gap-2">
              <MessageSquare className="w-4 h-4" /> Contact Agency
            </Button>
          </div>
        </div>
      </div>

      {/* ══ HERO IMAGE ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-[2rem] overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 border border-[#E4E9EA] dark:border-[#20353D]">
          <img src={agency.coverImage} alt={agency.agencyName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[#003366]/80 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/20">
                {agency.region.replace("_", " ")}
              </span>
              {agency.sltdaVerified && (
                <span className="px-3 py-1 bg-[#FDA301]/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#0E1B22] flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" /> SLTDA Certified ({agency.sltdaLicenseNumber})
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              {agency.agencyName}
            </h1>
            <p className="text-lg text-white/90 font-medium mt-2 max-w-3xl">
              "{agency.tagline}"
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm font-medium text-white/90">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                <MapPin className="w-4 h-4 text-[#FDA301]" /> Head Office: {agency.city}
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                <Star className="w-4 h-4 text-[#FDA301] fill-[#FDA301]" /> {agency.rating} ({agency.reviewCount} Reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Details */}
        <div className="flex-1 space-y-10">
          
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Agency Overview</h2>
            <p className="text-sm text-[#4A5A62] dark:text-[#A9BCC2] leading-relaxed">
              {agency.description}
            </p>
          </section>

          <hr className="border-[#E4E9EA] dark:border-[#20353D]" />

          {/* Specializations & Fleet */}
          <section className="grid sm:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="w-5 h-5 text-[#008080] dark:text-[#3FCFC0]" />
                <h3 className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>Specializations</h3>
              </div>
              <ul className="space-y-3">
                {agency.specializations.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">
                    <CheckCircle2 className="w-4 h-4 text-[#1F9D6C] shrink-0 mt-0.5" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-[#008080] dark:text-[#3FCFC0]" />
                <h3 className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>Fleet Options</h3>
              </div>
              <ul className="space-y-3">
                {agency.fleetTypes.map((fleet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-semibold text-[#4A5A62] dark:text-[#A9BCC2]">
                    <CheckCircle2 className="w-4 h-4 text-[#1F9D6C] shrink-0 mt-0.5" />
                    {fleet}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="border-[#E4E9EA] dark:border-[#20353D]" />

          {/* Featured Package */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0E1B22] dark:text-[#EAF2F4]" style={{ fontFamily: "'Fraunces', serif" }}>Featured Tour Package</h2>
              <Link href={`/tours?provider=${agency.id}`}>
                <Button variant="secondary" size="sm" className="rounded-xl font-bold">View All Tours</Button>
              </Link>
            </div>
            
            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[#003366] to-[#005F73] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md mb-1">
                  <Calendar className="w-3.5 h-3.5" /> {agency.featuredPackage.duration}
                </div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>{agency.featuredPackage.title}</h3>
                <p className="text-white/80 text-sm font-medium">An exclusive itinerary curated by {agency.agencyName}.</p>
              </div>
              
              <div className="bg-white text-[#0E1B22] p-5 rounded-[1.5rem] flex flex-col items-center justify-center shrink-0 min-w-[160px] shadow-sm">
                <div className="text-[10px] uppercase font-bold text-[#9AAAB0] mb-1">Starting From</div>
                <div className="text-3xl font-black text-[#003366]">${agency.featuredPackage.price}</div>
                <div className="text-xs font-semibold text-[#4A5A62] mt-0.5 mb-4">per person</div>
                <Link href={`/tours`}>
                  <Button className="w-full rounded-xl font-bold bg-[#FDA301] hover:bg-[#E59300] text-black">Explore Itinerary</Button>
                </Link>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Contact Widget */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white dark:bg-[#0F252E] rounded-[2rem] border border-[#E4E9EA] dark:border-[#20353D] shadow-xl p-6 sm:p-8 sticky top-24">
            
            <h3 className="text-xl font-bold text-[#0E1B22] dark:text-[#EAF2F4] mb-6" style={{ fontFamily: "'Fraunces', serif" }}>Contact Information</h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#008080]/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#008080] dark:text-[#3FCFC0]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#9AAAB0] uppercase tracking-wider mb-1">Direct Line</div>
                  <div className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{agency.contactPhone}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1F9D6C]/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-[#1F9D6C]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#9AAAB0] uppercase tracking-wider mb-1">WhatsApp</div>
                  <div className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{agency.whatsappNumber}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#003366]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#003366] dark:text-[#3FCFC0]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#9AAAB0] uppercase tracking-wider mb-1">Email Address</div>
                  <div className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{agency.contactEmail}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-[#4A5A62]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#9AAAB0] uppercase tracking-wider mb-1">Website</div>
                  <Link href="#" className="text-sm font-bold text-[#008080] dark:text-[#3FCFC0] hover:underline">Visit Official Site</Link>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #003366, #005F73, #008080)", color: "white" }}
            >
              <MessageSquare className="w-4 h-4" /> Send Inquiry Message
            </Button>
            
            <p className="text-xs text-center text-[#4A5A62] dark:text-[#A9BCC2] mt-4 font-medium">
              Response usually within {Math.max(1, Math.floor(Math.random() * 5))} hours
            </p>

            <div className="mt-6 pt-6 border-t border-[#E4E9EA] dark:border-[#20353D]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#15323D]">
                  <Briefcase className="w-5 h-5 text-[#003366] dark:text-[#3FCFC0]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#9AAAB0] uppercase tracking-wider">Experience</div>
                  <div className="text-sm font-bold text-[#0E1B22] dark:text-[#EAF2F4]">{agency.yearsInOperation} Years in Operation</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
