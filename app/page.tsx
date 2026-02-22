'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

type Truck = {
  title: string;
  officer: string;
  helmetUrl?: string;
  truckUrl?: string;
  driversTitle?: string;
  drivers: string[];
  qualifiedDriversTitle?: string;
  qualifiedDrivers?: string[];
};

type DateItem = { date: string; desc: string };
type EventItem = { imageUrl: string };
type FlyerItem = { imageUrl: string };

type Content = {
  trucks: Truck[];
  dates: DateItem[];
  events?: EventItem[];
  flyers?: FlyerItem[];
  timings?: {
    trucksSeconds?: number;
    datesSeconds?: number;
    eventsSeconds?: number;
    flyersSeconds?: number;
  };
};

const ROTATE_TRUCKS = 15;
const ROTATE_DATES = 4;
const ROTATE_EVENTS = 9;
const ROTATE_FLYERS = 7;

function useRotatingIndex(length: number, seconds: number) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (length < 2) return;
    const id = setInterval(() => {
      setIdx((p) => (p + 1) % length);
    }, seconds * 1000);
    return () => clearInterval(id);
  }, [length, seconds]);

  useEffect(() => {
    setIdx(0);
  }, [length]);

  return idx;
}

export default function TVDashboard() {
  const [data, setData] = useState<Content | null>(null);

  useEffect(() => {
    fetch(`/content.json?v=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then(setData);
  }, []);

  const trucks = data?.trucks ?? [];
  const dates = data?.dates ?? [];
  const events = data?.events ?? [];
  const flyers = data?.flyers ?? [];

  const truck =
    trucks[
      useRotatingIndex(
        trucks.length,
        data?.timings?.trucksSeconds ?? ROTATE_TRUCKS
      )
    ];

  const event =
    events[
      useRotatingIndex(
        events.length,
        data?.timings?.eventsSeconds ?? ROTATE_EVENTS
      )
    ];

  const flyer =
    flyers[
      useRotatingIndex(
        flyers.length,
        data?.timings?.flyersSeconds ?? ROTATE_FLYERS
      )
    ];

  const dateIdx = useRotatingIndex(
    dates.length,
    data?.timings?.datesSeconds ?? ROTATE_DATES
  );

  const [showQualified, setShowQualified] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setShowQualified((p) => !p);
    }, 7500);
    return () => clearInterval(id);
  }, [truck]);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* ROOT: horizontal on mobile, grid on desktop */}
      <div className="flex md:grid h-full min-w-full overflow-x-auto snap-x snap-mandatory pt-[calc(env(safe-area-inset-top)+24px)] md:grid-cols-12 md:gap-6 md:p-8 md:[grid-template-rows:32vh_1fr]">
        {/* ===================== */}
        {/* LEFT SLIDE (TRUCK)   */}
        {/* ===================== */}
        <section className="min-w-full snap-start md:col-span-8 md:row-span-2 flex flex-col h-full overflow-hidden rounded-3xl bg-white/5 shadow-[0_0_40px_rgba(56,189,248,0.15)] p-6 md:p-0">
          <div className="flex items-start gap-6 px-8 pt-6 shrink-0">
            {truck?.helmetUrl && (
              <img
                src={truck.helmetUrl}
                className="h-28 w-28 rounded-2xl object-contain"
                alt=""
              />
            )}

            <div>
              <h1 className="font-serif text-6xl">{truck?.title}</h1>
              <div className="mt-2 text-2xl text-sky-300">{truck?.officer}</div>
            </div>
          </div>

          <div className="flex items-center justify-center py-6 flex-1 min-h-0">
            {truck?.truckUrl && (
              <motion.img
                src={truck.truckUrl}
                className="max-h-[420px] w-auto object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                alt=""
              />
            )}
          </div>

          <div className="px-8 pb-6 shrink-0">
            <AnimatePresence mode="wait">
              {!showQualified ? (
                <motion.div key="crew" className="w-full overflow-hidden">
                  <div className="mb-2 border-b border-sky-200/20 pb-2 italic text-sky-200">
                    {truck?.driversTitle || 'Crew'}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-lg">
                    {truck?.drivers.map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="qualified" className="w-full overflow-hidden">
                  <div className="mb-2 border-b border-emerald-200/25 pb-2 italic text-emerald-200">
                    {truck?.qualifiedDriversTitle || 'Qualified Drivers'}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-lg">
                    {truck?.qualifiedDrivers?.map((q) => (
                      <div key={q}>{q}</div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ===================== */}
        {/* RIGHT SLIDE (INFO)   */}
        {/* ===================== */}
        <div className="min-w-full snap-start flex flex-col gap-6 p-6 md:contents">
          {/* Top Event Image */}
          <div className="md:col-span-4 rounded-3xl overflow-hidden bg-white/5 ring-1 ring-sky-200/10">
            {event && (
              <img
                src={event.imageUrl}
                className="h-full w-full object-cover"
                alt=""
              />
            )}
          </div>

          {/* Right Column Grid */}
          <aside className="md:col-span-4 md:row-span-2 grid md:grid-rows-[2fr_1fr] gap-6">
            <div className="grid grid-cols-2 gap-6 h-full">
          <div className="rounded-3xl bg-white/5 ring-1 ring-sky-200/10 p-6 overflow-hidden">
            <div className="text-sm uppercase tracking-widest text-sky-200 mb-4">
              Mutual Aid
            </div>

            <ul className="space-y-4 text-sm md:text-base">
              <li className="flex items-center justify-between">
                <span className="pr-4">Elsmere</span>
                <span className="font-medium text-right">970</span>
              </li>

              <li className="flex items-center justify-between">
                <span className="pr-4">Onesquethaw</span>
                <span className="font-medium text-right">972</span>
              </li>

              <li className="flex items-center justify-between">
                <span className="pr-4">Selkirk</span>
                <span className="font-medium text-right">970</span>
              </li>

              <li className="flex items-center justify-between">
                <span className="pr-4">Slingerlands</span>
                <span className="font-medium text-right">970 / 921</span>
              </li>
            </ul>
          </div>

              <div className="rounded-3xl overflow-hidden bg-white/5 ring-1 ring-sky-200/10">
                {flyer && (
                  <img
                    src={flyer.imageUrl}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                )}
              </div>
            </div>

            {/* Upcoming */}
            <div className="rounded-3xl bg-white/5 ring-1 ring-sky-200/10 p-6">
              <div className="text-sm uppercase tracking-widest text-sky-200 mb-4">
                Upcoming
              </div>

              {dates.slice(dateIdx, dateIdx + 2).map((d, i) => (
                <div key={i} className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3 text-lg">
                    <CalendarDays className="h-5 w-5 text-sky-200" />
                    {d.desc}
                  </div>
                  <div className="text-5xl font-bold">{d.date}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}