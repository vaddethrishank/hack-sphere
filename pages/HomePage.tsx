// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import Section from '../components/Section';

// const timelineEvents = [
//   { date: 'Aug 1, 2025', title: 'Registration Opens', description: 'Teams can start registering for the hackathon.' },
//   { date: 'Sep 15, 2025', title: 'Registration Closes', description: 'The deadline for team registrations.' },
//   { date: 'Oct 1, 2025', title: 'Round 1: Online Quiz', description: 'An online MCQ round to test foundational knowledge.' },
//   { date: 'Oct 15, 2025', title: 'Round 2: Online Coding', description: 'Qualified teams participate in a competitive programming round.' },
//   { date: 'Jan 10, 2026', title: 'Round 3: Offline Hackathon', description: 'The final 24-hour hackathon at NIT Silchar campus.' },
//   { date: 'Jan 11, 2026', title: 'Results & Closing Ceremony', description: 'Winners are announced and prizes are distributed.' },
// ];

// const sponsors = [
//     { name: 'Google', logo: 'https://picsum.photos/seed/google/150/50' },
//     { name: 'Microsoft', logo: 'https://picsum.photos/seed/microsoft/150/50' },
//     { name: 'Amazon', logo: 'https://picsum.photos/seed/amazon/150/50' },
//     { name: 'Devfolio', logo: 'https://picsum.photos/seed/devfolio/150/50' },
//     { name: 'Unstop', logo: 'https://picsum.photos/seed/unstop/150/50' },
// ];

// const HomePage: React.FC = () => {
//     return (
//         <div className="animate-fade-in-up">
//             {/* Hero Section */}
//             <div className="relative pt-24 pb-32 flex content-center items-center justify-center" style={{ minHeight: '80vh' }}>
//                 <div className="absolute top-0 w-full h-full bg-center bg-cover bg-primary"
//                     style={{ backgroundImage: `url('https://picsum.photos/seed/hero/1920/1080')` }}>
//                     <span id="blackOverlay" className="w-full h-full absolute opacity-75 bg-primary"></span>
//                 </div>
//                 <div className="container relative mx-auto">
//                     <div className="items-center flex flex-wrap">
//                         <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
//                             <div className="pr-12">
//                                 <h1 className="text-white font-semibold text-5xl md:text-6xl animate-glow">
//                                     Hackathon 2026
//                                 </h1>
//                                 <p className="mt-4 text-lg text-gray-300">
//                                     Presented by NIT Silchar. A 3-day coding marathon to build, innovate, and create the future.
//                                 </p>
//                                 <div className="mt-12">
//                                     <NavLink to="/registration" className="bg-highlight hover:bg-highlight/80 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg shadow-highlight/30">
//                                         Register Now
//                                     </NavLink>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Timeline Section */}
//             <Section title="Event Timeline" subtitle="Follow our journey from registration to the final round.">
//                 <div className="relative">
//                     <div className="border-l-2 border-accent absolute h-full top-0 left-1/2 -ml-px"></div>
//                     {timelineEvents.map((event, index) => (
//                         <div key={index} className={`flex items-center w-full mb-8 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
//                             <div className="w-1/2"></div>
//                             <div className="w-1/2 px-4">
//                                 <div className={`p-6 bg-secondary rounded-lg shadow-lg transform transition-transform hover:scale-105 ${index % 2 === 0 ? 'text-right' : ''}`}>
//                                     <p className="text-accent font-semibold">{event.date}</p>
//                                     <h3 className="text-xl font-bold mt-1 text-white">{event.title}</h3>
//                                     <p className="mt-2 text-dark-text/80">{event.description}</p>
//                                 </div>
//                             </div>
//                             <div className="absolute w-5 h-5 bg-highlight rounded-full left-1/2 -ml-2.5 border-4 border-primary"></div>
//                         </div>
//                     ))}
//                 </div>
//             </Section>

//             {/* Prizes Section Preview */}
//             <Section title="Prizes & Perks" subtitle="Win exciting cash prizes and grab exclusive opportunities.">
//                 <div className="text-center">
//                     <h3 className="text-4xl font-bold text-white mb-4">Total Prize Pool: ₹5,00,000+</h3>
//                     <p className="text-lg text-dark-text mb-8">More than just cash prizes. Get internship opportunities, goodies, and cloud credits.</p>
//                     <NavLink to="/prizes" className="text-accent hover:text-highlight transition-colors font-semibold">
//                         View All Prizes &rarr;
//                     </NavLink>
//                 </div>
//             </Section>
            
//             {/* Sponsors Section */}
//             <Section title="Our Sponsors" className="bg-secondary/30">
//                  <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
//                     {sponsors.map(sponsor => (
//                         <img key={sponsor.name} src={sponsor.logo} alt={sponsor.name} className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
//                     ))}
//                 </div>
//             </Section>
//         </div>
//     );
// };

// export default HomePage;

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Section from "../components/Section";
import ScrollTimeline from "../components/ScrollTimeline";
import MerryChristmasBanner from "../components/MerryChristmasBanner";
import VanillaTilt from "vanilla-tilt";
import "./HomePage.extra.css";
import { Calendar, Info, Brain, MapPin } from "lucide-react";

const timelineEvents = [
  { date: "Dec 1 , 2025", title: "Registration Opens", description: "Teams can start registering for the hackathon." },
  { date: "Dec 30, 2025", title: "Registration Closes", description: "The deadline for team registrations." },
  { date: "Jan 13, 2026", title: "Round 1: Online Quiz", description: "MCQ round to test foundational knowledge." },
  { date: "Feb 5, 2026", title: "Round 2: Online Coding", description: "Solve coding problems in a timed contest." },
  { date: "Feb 23, 2026", title: "Round 3: Offline Hackathon", description: "Final round at NIT Silchar campus." },
  { date: "Feb 24, 2026", title: "Results & Closing Ceremony", description: "Prizes, certificates & celebration." },
];

const sponsors = [
  { name: "Google", logo: "/google.jpeg" },
  { name: "Amazon", logo: "/amazon.webp" },
  { name: "Microsoft", logo: "/microsoft.jpeg" },
  { name: "Tata", logo: "/tata.jpeg" },
  { name: "CocaCola", logo: "/cocacola.jpeg" },
];

const NEXT_EVENT_DATE = new Date("Jan 13, 2026 10:00:00").getTime();

const HomePage: React.FC = () => {
  const [countdown, setCountdown] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      let diff = NEXT_EVENT_DATE - now;
      if (diff < 0) diff = 0;

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

      setCountdown({
        days: pad(Math.floor(diff / day)),
        hours: pad(Math.floor((diff % day) / hour)),
        minutes: pad(Math.floor((diff % hour) / minute)),
        seconds: pad(Math.floor((diff % minute) / second)),
      });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  // VanillaTilt (wrapper only)
  useEffect(() => {
    const wrappers = document.querySelectorAll(".tilt-wrapper");
    if (wrappers.length > 0) {
      VanillaTilt.init(Array.from(wrappers) as HTMLElement[], {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
      });
    }
  }, []);

  return (
    <div className="animate-fade-in-up relative">
      {/* Merry Christmas Banner */}
      <MerryChristmasBanner />
      
      {/* Global Christmas Background is rendered in App.tsx */}
      
      {/* HERO BLOCK */}
      <div className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 topo-overlay z-10 pointer-events-none"></div>

        <div className="absolute inset-0 hero-bg z-0" style={{ backgroundImage: "url('/nit_silchar.jpg')" }} />
        <div className="absolute inset-0 bg-black/70 z-5" />

        <div className="relative z-10 container mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* LEFT SIDE */}
            <div className="lg:col-span-7">
              <div className="mb-4">
                <span className="inline-flex items-center gap-3 bg-white/10 text-dark-text px-3 py-1 rounded-full text-sm">
                  <strong className="text-accent">Official</strong> • NIT Silchar
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
                <span className="hero-underline">Hackathon</span>
                <br />
                <span className="text-accent">2026</span>
              </h1>

              <h2 className="mt-4 text-lg md:text-2xl text-dark-text font-medium">
                National Institute of Technology, Silchar
              </h2>

              <p className="mt-6 text-base md:text-lg text-dark-text max-w-2xl">
                A national-level{" "}
                <span className="text-white font-semibold">24-hour innovation marathon</span> where
                teams build, pitch and win.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <NavLink
                  to="/registration"
                  className="inline-flex items-center gap-3 bg-frozen-ice hover:bg-frozen-ice/80 text-white font-bold py-3 px-6 rounded-full text-lg transition transform hover:scale-[1.03] shadow-lg shadow-frozen-ice/30"
                >
                  Register Now
                </NavLink>

                <button
                  className="inline-flex items-center gap-2 text-sm text-dark-text hover:text-white"
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "smooth" })}
                >
                  Learn More →
                </button>
              </div>

              <div className="mt-10 flex gap-4 items-center">
                <div className="flex gap-3 card-glass px-4 py-3 rounded-lg">
                  {["days", "hours", "minutes", "seconds"].map((key) => (
                    <React.Fragment key={key}>
                      <div className="text-center">
                        <div className="text-2xl font-black text-white">{(countdown as any)[key]}</div>
                        <div className="text-xs text-dark-text">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      </div>
                      {key !== "seconds" && <div className="w-px bg-white/10 mx-3 h-8" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE CARDS */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {[
                  { title: "Event Date", subtitle: "13 Jan — 24 Feb", Icon: Calendar, link: "/guidelines" },
                  { title: "About", subtitle: "NIT Silchar", Icon: Info, link: "/about" },
                  { title: "Problems", subtitle: "Collections", Icon: Brain, link: "/set1" },
                  {
                    title: "Venue",
                    subtitle: "NIT Silchar",
                    Icon: MapPin,
                    external: true,
                    link: "https://www.google.com/maps/place/National+Institute+of+Technology,+Silchar/@24.7567525,92.7944166,17z"
                  },
                ].map((c, idx) => (
                  <NavLink
                    key={idx}
                    to={c.external ? "#" : c.link}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (c.external) {
                        e.preventDefault();
                        window.open(c.link, "_blank");
                      }
                    }}
                    className="tilt-wrapper rounded-xl cursor-pointer"
                  >
                    <div className="tilt-card-inner card-glass rounded-xl p-5 hover:scale-[1.02] transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm text-dark-text">{c.title}</div>
                          <div className="mt-2 text-xl font-bold text-white">{c.subtitle}</div>
                        </div>

                        <c.Icon className="w-7 h-7 text-accent" />
                      </div>

                      <div className="mt-3 text-sm text-dark-text">
                        {c.title === "Event Date" && "Full schedule & guidelines"}
                        {c.title === "About" && "Venue & organizers"}
                        {c.title === "Problems" && "Problem sets & samples"}
                        {c.title === "Venue" && "Get directions"}
                      </div>
                    </div>
                  </NavLink>
                ))}

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollTimeline 
            events={timelineEvents} 
            title="Event Timeline" 
            subtitle="Track all important dates as you scroll down."
          />
        </div>
      </section>

      {/* PRIZES */}
      <Section title="Prizes & Rewards" subtitle="Win big rewards, goodies and more!">
        <div className="text-center">
          <h3 className="text-4xl font-bold text-dark-text mb-4">
            Prize Pool: <span className="text-accent">₹1,20,000</span>
          </h3>
          <p className="text-dark-text mb-6">
            Top winners receive cash prizes, cloud credits, internships and premium goodies.
          </p>

          <NavLink to="/prizes" className="font-semibold text-frozen-ice hover:text-christmas-green transition">
            See All Prizes →
          </NavLink>
        </div>
      </Section>

      {/* SPONSORS */}
      <Section title="Our Sponsors" subtitle="Powered by industry-leading organizations.">
        <div className="flex flex-wrap justify-center gap-10 py-6">
          {sponsors.map((s) => (
            <img
              key={s.name}
              src={s.logo}
              alt={s.name}
              className="h-12 object-contain     hover:grayscale-0 transition-all duration-300"
            />
          ))}
        </div>
      </Section>
    </div>
  );
};

export default HomePage;