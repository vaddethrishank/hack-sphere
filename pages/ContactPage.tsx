import React, { useState } from 'react';
import Section from '../components/Section';

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="animate-fade-in-up">
            <Section title="Get In Touch" subtitle="Have questions? We'd love to hear from you.">
                <div className="grid md:grid-cols-2 gap-12">

                    <div className="bg-secondary p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>

                        {submitted ? (
                            <div className="text-center p-8 bg-primary rounded-md">
                                <h4 className="text-xl font-semibold text-green-400">Thank You!</h4>
                                <p className="text-dark-text mt-2">Your message has been sent. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form
                                action="https://api.web3forms.com/submit?"
                                method="POST"
                                className="space-y-6"
                            onSubmit={() => {
    setTimeout(() => setSubmitted(true), 500); 
}}

                            >
                                <input
  type="hidden"
  name="access_key"
  value={(import.meta as any).env.VITE_WEB3FORMS_KEY}
/>

                                <input type="hidden" name="subject" value="New Contact Message" />

                                <div>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        className="w-full bg-primary p-3 rounded-md border border-secondary"
                                    />
                                </div>

                                <div>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Your Email"
                                        required
                                        className="w-full bg-primary p-3 rounded-md border border-secondary"
                                    />
                                </div>

                                <div>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        placeholder="Your Message"
                                        required
                                        className="w-full bg-primary p-3 rounded-md border border-secondary"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-accent text-white font-bold py-3 px-4 rounded-md"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="text-dark-text space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-white">Contact Information</h3>
                            <p className="mt-2">NIT Silchar, Cachar, Assam - 788010</p>
                            <p>Email: <a href="mailto:hackathon@nits.ac.in" className="text-accent hover:underline">hackathon@nits.ac.in</a></p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white">Event Coordinators</h3>
                            <p className="mt-2">CR, Sec A & B, B.Tech (CSE), 3rd year, NIT Silchar</p>
                        </div>
                    </div>

                </div>
            </Section>
        </div>
    );
};

export default ContactPage;
