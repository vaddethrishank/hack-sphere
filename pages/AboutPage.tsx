
import React from 'react';
import Section from '../components/Section';

const AboutPage: React.FC = () => {
    return (
        <div className="animate-fade-in-up relative">
            {/* Global Christmas Background is rendered in App.tsx */}
            <Section title="About Hackathon 2026">
                <div className="max-w-4xl mx-auto text-center text-dark-text">
                    <p className="text-lg mb-6">
                        Hackathon 2026 is the flagship coding event of NIT Silchar, designed to bring together the brightest minds from across the nation. It's more than just a competition; it's a platform for innovation, collaboration, and learning. Participants will have the opportunity to work on real-world problems, develop their skills, and network with industry experts.
                    </p>
                    <p className="text-lg">
                        Our mission is to create a vibrant ecosystem that encourages students to think outside the box, solve complex challenges, and build solutions that can make a real impact. Join us for an unforgettable experience of coding, creativity, and camaraderie.
                    </p>
                </div>
            </Section>

            <Section title="About NIT Silchar" className="bg-secondary/30">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <img src='/assets/nits.jpg' alt="NIT Silchar Campus" className="rounded-lg shadow-lg" />
                    <div className="text-dark-text">
                        <p className="text-lg mb-4">
                            National Institute of Technology, Silchar is one of the 31 NITs of India and was established in 1967 as a Regional Engineering College in Silchar. In 2002, it was upgraded to the status of National Institute of Technology and was declared as Institute of National Importance under the National Institutes of Technology Act, 2007.
                        </p>
                        <p className="text-lg">
                           The institute is renowned for its academic excellence, research contributions, and vibrant campus life. It provides a conducive environment for students to excel in their chosen fields and contribute to the technological advancement of the country.
                        </p>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default AboutPage;
