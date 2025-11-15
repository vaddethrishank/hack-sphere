import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Clock, Zap, Trophy, Users, Code2 } from 'lucide-react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

interface EventMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className: string }>;
  status: 'completed' | 'current' | 'upcoming';
}

const EventCountdownPage: React.FC = () => {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  // Event dates
  const eventMilestones: EventMilestone[] = [
    {
      id: '1',
      date: 'Dec 1, 2025',
      title: 'Registration Opens',
      description: 'Teams can start registering for the hackathon. Limited slots available!',
      icon: Users,
      status: 'upcoming',
    },
    {
      id: '2',
      date: 'Dec 30, 2025',
      title: 'Registration Closes',
      description: 'Final deadline for team registrations. Ensure all documents are submitted.',
      icon: Calendar,
      status: 'upcoming',
    },
    {
      id: '3',
      date: 'Jan 13, 2026',
      title: 'Round 1: Online Quiz',
      description: 'MCQ round to test foundational knowledge. 90 minutes to compete.',
      icon: Code2,
      status: 'upcoming',
    },
    {
      id: '4',
      date: 'Feb 5, 2026',
      title: 'Round 2: Online Coding',
      description: 'Solve coding problems in a timed contest. Show your programming skills!',
      icon: Zap,
      status: 'upcoming',
    },
    {
      id: '5',
      date: 'Feb 23, 2026',
      title: 'Round 3: Offline Hackathon',
      description: 'Final 24-hour hackathon at NIT Silchar. Build, innovate, and create!',
      icon: Trophy,
      status: 'upcoming',
    },
    {
      id: '6',
      date: 'Feb 24, 2026',
      title: 'Results & Closing Ceremony',
      description: 'Prizes, certificates, and celebration. Find out the winners!',
      icon: Trophy,
      status: 'upcoming',
    },
  ];

  // Countdown to Round 1: Jan 13, 2026 10:00:00
  const NEXT_EVENT_DATE = new Date('Jan 13, 2026 10:00:00').getTime();

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      let diff = NEXT_EVENT_DATE - now;

      if (diff < 0) {
        diff = 0;
      }

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      setCountdown({
        days: Math.floor(diff / day),
        hours: Math.floor((diff % day) / hour),
        minutes: Math.floor((diff % hour) / minute),
        seconds: Math.floor((diff % minute) / second),
        totalSeconds: Math.floor(diff / 1000),
      });
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in-up min-h-screen py-12">
      {/* Main Countdown Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Hackathon <span className="text-frozen-ice">2026</span>
          </h1>
          <p className="text-lg text-dark-text max-w-3xl mx-auto">
            Join us for an extraordinary innovation marathon at NIT Silchar
          </p>
        </div>

        {/* Main Countdown Timer */}
        <div className="mb-16">
          <div className="card-glass rounded-2xl p-8 md:p-12 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                Countdown to Round 1
              </h2>
              <p className="text-dark-text">Online Quiz begins on Jan 13, 2026 at 10:00 AM</p>
            </div>

            {/* Timer Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { value: countdown.days, label: 'Days', max: '999' },
                { value: countdown.hours, label: 'Hours', max: '23' },
                { value: countdown.minutes, label: 'Minutes', max: '59' },
                { value: countdown.seconds, label: 'Seconds', max: '59' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="text-center p-4 rounded-lg bg-gradient-to-b from-secondary/50 to-secondary/30 border border-frozen-ice/30"
                >
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-black text-frozen-ice mb-2">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="h-1 w-full bg-gradient-to-r from-christmas-green/0 via-frozen-ice to-christmas-green/0 rounded-full" />
                  </div>
                  <div className="text-sm font-semibold text-dark-text mt-2">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden border border-white/10">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-christmas-green via-frozen-ice to-christmas-red transition-all duration-300"
                  style={{
                    width: `${Math.max(0, Math.min(100, (countdown.totalSeconds / (30 * 24 * 60 * 60)) * 100))}%`,
                  }}
                />
              </div>
              <p className="text-xs text-dark-text/60 mt-2 text-center">
                {countdown.days > 0
                  ? `${countdown.days} days, ${countdown.hours} hours until next event`
                  : countdown.hours > 0
                  ? `${countdown.hours} hours, ${countdown.minutes} minutes until next event`
                  : countdown.minutes > 0
                  ? `${countdown.minutes} minutes, ${countdown.seconds} seconds until next event`
                  : 'Event starting soon!'}
              </p>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-sm text-dark-text mb-1">Event Type</div>
                <div className="text-lg font-bold text-frozen-ice">Online Quiz</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-dark-text mb-1">Duration</div>
                <div className="text-lg font-bold text-christmas-green">90 Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-dark-text mb-1">Prize Pool</div>
                <div className="text-lg font-bold text-accent">₹1,20,000</div>
              </div>
            </div>
          </div>
        </div>

        {/* All Event Milestones */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Event <span className="text-frozen-ice">Timeline</span>
          </h2>

          <div className="space-y-4">
            {eventMilestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={milestone.id}
                  className="card-glass rounded-xl p-6 border border-white/10 hover:border-frozen-ice/50 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-3 rounded-lg bg-frozen-ice/20">
                        <Icon className="w-6 h-6 text-frozen-ice" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{milestone.title}</h3>
                          <p className="text-sm text-frozen-ice font-semibold mt-1">{milestone.date}</p>
                          <p className="text-sm text-dark-text mt-2">{milestone.description}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-christmas-green/20 text-christmas-green flex-shrink-0">
                          {milestone.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Quick <span className="text-frozen-ice">Facts</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Prize Pool',
                value: '₹1,20,000+',
                description: 'Exciting cash prizes and rewards',
              },
              {
                title: 'Rounds',
                value: '3',
                description: 'Online Quiz, Coding, and Offline Hackathon',
              },
              {
                title: 'Duration',
                value: '3 Months',
                description: 'From registration to final ceremony',
              },
            ].map((fact, idx) => (
              <div
                key={idx}
                className="card-glass rounded-xl p-6 text-center border border-white/10"
              >
                <div className="text-4xl font-bold text-frozen-ice mb-2">{fact.value}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{fact.title}</h3>
                <p className="text-sm text-dark-text">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Ready to Compete?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/registration"
              className="inline-flex items-center gap-2 bg-frozen-ice hover:bg-frozen-ice/80 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Register Now
            </NavLink>
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 border border-frozen-ice text-frozen-ice hover:bg-frozen-ice/10 font-bold py-3 px-8 rounded-full transition-colors"
            >
              Back to Home
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCountdownPage;
