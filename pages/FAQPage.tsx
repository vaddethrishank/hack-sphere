import React, { useState } from "react";
import Section from "../components/Section";

const faqs = [
  {
    q: "Who can participate in the hackathon?",
    a: "Anyone—students, beginners, and professionals are welcome to join HackSphere '26.",
  },
  {
    q: "Is there any registration fee?",
    a: "Yes, The hackathon has an entry fee of RS.2000 per team.",
  },
  {
    q: "Will the hackathon be held offline or online?",
    a: "Round 1 & 2 are online. The final hackathon (Round 3) is offline at NIT Silchar.",
  },
  {
    q: "What is the team size?",
    a: "A team must have 2–4 members.",
  },
  {
    q: "Do we receive participation certificates?",
    a: "Yes. All participants who participate in the hackathon receive the certificates.",
  },

];

const FAQPage: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section title="Frequently Asked Questions" subtitle="Find answers to common queries.">
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-secondary/40 border border-accent/20 hover:border-accent transition cursor-pointer"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
              <span className="text-accent text-xl">{open === i ? "−" : "+"}</span>
            </div>

            {open === i && (
              <p className="mt-3 text-dark-text">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default FAQPage;
