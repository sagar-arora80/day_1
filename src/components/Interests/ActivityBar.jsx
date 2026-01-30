import React from 'react';
import { Activity, Trophy, Zap, Timer, Dumbbell, Heart } from 'lucide-react';

const IconMap = {
    'Activity': Activity,
    'Trophy': Trophy,
    'Zap': Zap,
    'Timer': Timer,
    'Dumbbell': Dumbbell,
    'Heart': Heart,
    'Run': Activity,
    'Badminton': Trophy
};

export function ActivityBar({ activities }) {
    if (!activities || activities.length === 0) return null;

    return (
        <div className="w-full mb-12">
            <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                <span className="text-2xl">⚡</span> Body (Active Pursuits)
            </h3>

            <div className="flex flex-wrap gap-4">
                {activities.map((activity, i) => {
                    // Extract icon name from tags (assuming tag stores icon name)
                    const iconName = Array.isArray(activity.tags) ? activity.tags[0] : activity.tags;
                    const IconComponent = IconMap[iconName] || Activity;

                    return (
                        <div key={i} className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 pr-8 backdrop-blur-sm hover:border-violet-500/30 transition-colors">
                            <div className={`p-3 rounded-xl ${iconName === 'Trophy' || iconName === 'Badminton' ? 'bg-lime-500/10 text-lime-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                                <IconComponent size={24} className="animate-pulse-slow" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-slate-200">{activity.description}</div>
                                <div className="text-sm text-slate-500 font-medium">{activity.title}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
