import React from 'react';
import { Train, Bus, Clock, Ticket, AlertCircle, Sparkles, ExternalLink, MapPin } from 'lucide-react';
import { db } from '../lib/db';

export const TransitGuide: React.FC = () => {
  const trainSchedules = db.getTrainSchedules();

  return (
    <div className="space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Train className="w-3.5 h-3.5" />
          <span>Inter-City Transit Guide</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-stone-900">
          How to Reach Sreemangal: Train Timetables & Highway Buses
        </h2>
        <p className="text-stone-600 text-sm mt-2 max-w-2xl">
          Everything you need to plan your journey from Dhaka, Chittagong, or Sylhet with official Bangladesh Railway train schedules and fare charts.
        </p>
      </div>

      {/* Train Timetable Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/70">
          <div>
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Train className="w-5 h-5 text-emerald-800" />
              <span>Dhaka (Kamalapur) ➔ Sreemangal Intercity Trains</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Approx. 195 km · Average journey time 3.5 to 4.5 hours
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Sreemangal+Railway+Station"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-xl transition-colors border border-stone-200 flex items-center gap-1.5 shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Station on Google Maps</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>

            <a
              href="https://eticket.railway.gov.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#123524] hover:bg-[#1a4933] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Railway E-Ticket Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase font-semibold tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-4">Train Name & No.</th>
                <th className="p-4">Dhaka Dep.</th>
                <th className="p-4">Sreemangal Arr.</th>
                <th className="p-4">Off-Day</th>
                <th className="p-4">Fares (BDT)</th>
                <th className="p-4">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {trainSchedules.map((train) => (
                <tr key={train.trainNumber} className="hover:bg-stone-50/70">
                  <td className="p-4">
                    <span className="font-bold text-stone-900 text-sm block">
                      {train.trainName} ({train.trainNumber})
                    </span>
                    <span className="text-stone-500 text-[11px] font-serif">{train.bengaliName}</span>
                  </td>
                  <td className="p-4 whitespace-nowrap font-bold text-emerald-800 text-sm">
                    {train.departureDhaka}
                  </td>
                  <td className="p-4 whitespace-nowrap font-bold text-stone-900 text-sm">
                    {train.arrivalSreemangal}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700">
                      {train.offDay}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div>
                      <strong className="text-stone-900">৳{train.fareShovon}</strong>{' '}
                      <span className="text-stone-400 text-[11px]">(Shovon)</span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      ৳{train.fareSnigdha} (Snigdha AC) · ৳{train.fareACBerth} (Berth)
                    </div>
                  </td>
                  <td className="p-4 text-stone-600 text-xs max-w-xs">{train.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buses & Road Transit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <Bus className="w-5 h-5 text-emerald-800" />
            <span>Highway Bus Services from Dhaka</span>
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Direct AC & Non-AC buses operate from Dhaka&apos;s Sayedabad, Fakirapool, and Mohakhali terminals via Bhairab and Brahmanbaria.
          </p>
          <div className="space-y-2 text-xs text-stone-700">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <strong className="text-stone-900 block">Ena Transport & Hanif Enterprise</strong>
              <span className="text-stone-500">Departures every 30-45 minutes · Fare ~৳450 - ৳550 non-AC, ৳750-৳850 AC</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <strong className="text-stone-900 block">Shyamoli Paribahan</strong>
              <span className="text-stone-500">Fakirapool & Arambagh counters · Duration 4.5 to 5.5 hours</span>
            </div>
          </div>
        </div>

        {/* Station Arrival Survival Advice */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-3 text-xs text-amber-950">
          <h3 className="font-bold text-base text-amber-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <span>Station Arrival Tips (Avoid Overpaying)</span>
          </h3>
          <ul className="space-y-2 text-stone-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">1.</span>
              <span><strong>Exit the main gates first:</strong> Avoid engaging with touts standing right on the train platform. Walk 30 meters out to the registered station CNG line.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">2.</span>
              <span><strong>Town Hotel Drop Fare:</strong> A CNG drop from Sreemangal Station to any hotel inside town or Station Road is standard <strong>৳50 to ৳80</strong> (or ৳20-30 per person shared). Do not pay ৳200+.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">3.</span>
              <span><strong>Radhanagar Resort Drop:</strong> A CNG drop from Station to resorts in Radhanagar (Novem, Shanti Bari, Grand Sultan) is standard <strong>৳150 to ৳200</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">4.</span>
              <span><strong>Late-night arrival:</strong> Upaban Express arrives at 01:25 AM. Station area remains lit with rickshaws and Five Brother restaurant is open 24/7 next door.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
