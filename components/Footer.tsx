
import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary text-dark-text/80">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <RouterNavLink to="/" className="text-white font-bold text-2xl">
                            HACKATHON '26
                        </RouterNavLink>
                        <p className="text-sm">National Institute of Technology, Silchar</p>
                        <p className="text-sm">A national-level coding competition to foster innovation and problem-solving skills.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Quick Links</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><RouterNavLink to="/about" className="text-base hover:text-accent">About</RouterNavLink></li>
                                    <li><RouterNavLink to="/rounds" className="text-base hover:text-accent">Rounds</RouterNavLink></li>
                                    <li><RouterNavLink to="/prizes" className="text-base hover:text-accent">Prizes</RouterNavLink></li>
                                    <li><RouterNavLink to="/leaderboard" className="text-base hover:text-accent">Leaderboard</RouterNavLink></li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Support</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><RouterNavLink to="/contact" className="text-base hover:text-accent">Contact</RouterNavLink></li>
                                    <li><a href="#" className="text-base hover:text-accent">FAQs</a></li>
                                    <li><a href="#" className="text-base hover:text-accent">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>
                         <div className="md:grid md:grid-cols-1 md:gap-8">
                           <div>
                                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Contact Us</h3>
                                <ul className="mt-4 space-y-4">
                                    <li><p className="text-base">NIT Silchar, Cachar, Assam - 788010</p></li>
                                    <li><a href="mailto:hackathon@nits.ac.in" className="text-base hover:text-accent">hackathon@nits.ac.in</a></li>
                                </ul>
                            </div>
                         </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-primary pt-8">
                    <p className="text-base text-center">&copy; 2024-2026 Hackathon Committee, NIT Silchar. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
