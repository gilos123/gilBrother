
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Headphones, Music2, FileMusic, Target, Trophy, Award, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
          <Music className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">About Practice!</h1>
        <p className="text-lg text-gray-600">
          Your personal music theory and ear training companion, designed to make learning fun, engaging, and rewarding.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Our Mission</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          The main goal of Practice! is to demystify music theory and make essential skills like ear training and sight-reading accessible to everyone. Through gamified exercises, friendly competition, and steady progression, we help you build a strong musical foundation, one practice session at a time.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Training Modules & Games</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Headphones className="text-blue-500" /> Ear Training</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Sharpen your listening skills by identifying musical intervals and chords by ear. As you level up, you'll progress from simple triads to complex 7th chords and inversions.</p>
            </CardContent>
          </Card>
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Music2 className="text-green-500" /> Rhythm Training</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li><strong>Classic Rhythm:</strong> Listen to a rhythm and identify the correct notation from a set of options.</li>
                <li><strong>Drumline Memory:</strong> A challenging memory game where a rhythm pattern grows by one measure each round. You must listen to the entire sequence and identify the notation for the final measure.</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><FileMusic className="text-purple-500" /> Sight Reading</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Improve your ability to read sheet music quickly and accurately. Start with basic notes on the staff and advance to ledger lines, complex key signatures, and enharmonic equivalents.</p>
            </CardContent>
          </Card>
          <Card className="clay-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3"><Target className="text-orange-500" /> Musical Geography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Deepen your understanding of music theory by identifying or constructing intervals directly on the musical staff. This module connects your ear training to visual notation.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Meet Your Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/27357494d_bach-transparent.png" alt="J.S. Bach" className="w-32 h-32 mx-auto mb-2 rounded-full bg-orange-100 object-cover" />
            <h3 className="font-bold text-lg">J.S. Bach</h3>
            <p className="text-sm text-gray-600">Your guide for music theory, structure, and the fundamentals of sight-reading.</p>
          </div>
          <div className="space-y-2">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c133a41b2_jimi-hendrix-crop.png" alt="Jimi Hendrix" className="w-32 h-32 mx-auto mb-2 rounded-full bg-purple-100 object-cover" />
            <h3 className="font-bold text-lg">Jimi Hendrix</h3>
            <p className="text-sm text-gray-600">The master of feel and sound, here to help you train your ears to recognize every nuance.</p>
          </div>
          <div className="space-y-2">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a75222d4f_duke-ellington-crop.png" alt="Duke Ellington" className="w-32 h-32 mx-auto mb-2 rounded-full bg-blue-100 object-cover" />
            <h3 className="font-bold text-lg">Duke Ellington</h3>
            <p className="text-sm text-gray-600">The maestro of rhythm and swing, guiding you through the complexities of timing and feel.</p>
          </div>
          <div className="space-y-2">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/677b25538_1ee1ba74-b85e-48cf-87df-944f203ae729.png" alt="Aretha Franklin" className="w-32 h-32 mx-auto mb-2 rounded-full bg-red-100 object-cover" />
            <h3 className="font-bold text-lg">Aretha Franklin</h3>
            <p className="text-sm text-gray-600">The Queen of Soul, here to test your musical memory and make sure you respect the groove.</p>
          </div>
        </div>
      </section>
      
      <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-700 text-center flex items-center justify-center gap-2"><Trophy className="text-yellow-500"/> Weekly Arena</h2>
              <p className="text-gray-600">
                  Compete against other users in the Weekly Arena! All XP you earn throughout the week contributes to your Arena score. Climb the leaderboard, claim the top spot, and prove your dedication. Users who have won the Arena at least once are honored with a glowing crown and a win counter, showcasing their achievements to all contenders.
              </p>
          </div>
          <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-700 text-center flex items-center justify-center gap-2"><Award className="text-indigo-500"/> Badge System</h2>
              <p className="text-gray-600">
                  Unlock a wide variety of badges to commemorate your progress and achievements. From practicing on consecutive days to mastering complex skills and competing in the arena, there's always a new challenge to conquer. Badges are categorized by rarity—Bronze, Golden, Platinum, Superb, and even GODLIKE—giving you tangible goals to strive for on your musical journey.
              </p>
          </div>
      </section>
    </div>
  );
};

export default AboutPage;
