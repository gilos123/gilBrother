
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Music2, ArrowLeft, Play } from 'lucide-react';
import { UserProgress } from '@/api/entities';
import { User } from '@/api/entities';

const RhythmTrainingMenu = () => {
    const [userProgress, setUserProgress] = React.useState(null);

    React.useEffect(() => {
        const loadProgress = async () => {
            try {
                const user = await User.me();
                const progress = await UserProgress.filter({ created_by: user.email });
                if (progress.length > 0) {
                    setUserProgress(progress[0]);
                }
            } catch (e) {
                console.error("Couldn't load progress", e);
            }
        };
        loadProgress();
    }, []);

    const modules = [
        {
            id: 'classic_rhythm',
            title: 'Classic Rhythm Training',
            subtitle: 'Match rhythms to audio patterns',
            icon: Music,
            color: 'from-green-400 to-emerald-600',
            level: userProgress?.rhythm_training_level || 1,
            exercises: 7,
            link: createPageUrl('Training?module=rhythm_training')
        },
        {
            id: 'drumline_memory',
            title: 'Drumline Memory',
            subtitle: 'Remember and repeat growing drum patterns',
            icon: Music2,
            color: 'from-red-400 to-orange-600',
            level: userProgress?.drumline_memory_level || 1,
            exercises: '3 Levels',
            link: createPageUrl('DrumlineMemoryMenu')
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link to={createPageUrl("Home")}>
                    <Button variant="ghost" size="icon" className="clay-button">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Rhythm Training</h1>
                    <p className="text-gray-600">Choose your rhythm challenge</p>
                </div>
            </div>

            <div className="grid gap-6">
                {modules.map((module) => (
                    <Link key={module.id} to={module.link} className="block group">
                        <Card className="clay-card hover:scale-[1.02] transition-all duration-300 bg-white/50">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-6">
                                    <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <module.icon className="w-10 h-10" />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            {module.title}
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                            {module.subtitle}
                                        </p>
                                        
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Play className="w-4 h-4" />
                                                Level {module.level}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Play className="w-4 h-4" />
                                                {module.exercises} exercises
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        <Play className="w-6 h-6 text-gray-700 ml-1" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RhythmTrainingMenu;
