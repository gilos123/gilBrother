
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UserBadges } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Lock, Sparkles, Star, Loader2 } from "lucide-react";

const BADGE_DEFINITIONS = [
  // GODLIKE tier
  { id: "referral_master", name: "Referral Master", icon: "🌟👥", rarity: "GODLIKE", description: "Refer a friend to Practice! and help them complete their first session." },
  
  // Superb badges
  { id: "one_shot_wonder", name: "One Shot Wonder", icon: "🎯🥇", rarity: "Superb", description: "Beat a melodic level with first attempt only." },
  { id: "map_master", name: "Map Master", icon: "🗺️👑", rarity: "Superb", description: "Reach level 20 in the advanced Musical Geography module." },
  { id: "king_of_staff", name: "King of the Staff", icon: "👑🎼", rarity: "Superb", description: "Rank #1 in the weekly Arena leaderboard." },
  { id: "the_enharmonicist", name: "The Enharmonicist", icon: "🎼🔀", rarity: "Superb", description: "Reach level 20 in Sight Reading (mastering enharmonic notes)." },
  { id: "triplet_titan", name: "Triplet Titan", icon: "🥁⚡", rarity: "Superb", description: "Reach level 20 in Rhythm Training (mastering complex triplets)." },
  { id: "inversion_inspector", name: "Inversion Inspector", icon: "👂🔄", rarity: "Superb", description: "Reach level 20 in Ear Training (recognizing chord inversions)." },
  
  // Platinum badges
  { id: "golden_ears", name: "Golden Ears", icon: "👂🏆", rarity: "Platinum", description: "Complete a melodic level with no hint shown." },
  { id: "i_knew_it", name: "I Knew It!", icon: "💡✅", rarity: "Platinum", description: "Fail once, then pass the same melodic level on the next try." },
  { id: "i_live_here_now", name: "I Live Here Now", icon: "🏠📱", rarity: "Platinum", description: "Practice 30 days in a row without missing a day." },
  { id: "punch_above_clef", name: "Punch Above Your Clef", icon: "🥊🎼", rarity: "Platinum", description: "Reach level 20 in any training module." },
  { id: "tiny_tapper", name: "Tiny Tapper", icon: "👶🥁", rarity: "Platinum", description: "Reach level 10 in the Rhythm Training module." },
  { id: "simply_miss_note", name: "One Does Not Simply Miss a Note", icon: "🧙‍♂️🎵", rarity: "Platinum", description: "Score 100% on a sight-reading level 15 or higher." },
  { id: "ledger_line_legend", name: "Ledger Line Legend", icon: "📝✨", rarity: "Platinum", description: "Reach level 11 in Sight Reading (mastering ledger lines)." },
  { id: "syncopation_sensation", name: "Syncopation Sensation", icon: "🎵💫", rarity: "Platinum", description: "Reach level 11 in Rhythm Training (mastering syncopation)." },
  { id: "seventh_heaven", name: "Seventh Heaven", icon: "👂🎵", rarity: "Platinum", description: "Reach level 11 in Ear Training (identifying 7th chords)." },
  
  // Golden badges
  { id: "mind_the_gap", name: "Mind the Gap", icon: "🧠➡️", rarity: "Golden", description: "Get 3 perfect melodic levels in a row." },
  { id: "metronome_monk", name: "Metronome Monk", icon: "🧘‍♂️🎶", rarity: "Golden", description: "Practice at the same hour 5 times in a row." },
  { id: "dont_get_tired", name: "Don't Get Tired", icon: "💪🎮", rarity: "Golden", description: "Complete 10 levels in a single session." },
  { id: "endless_encore", name: "Endless Encore", icon: "🙌🔁", rarity: "Golden", description: "Replay the same level 3 times in a row." },
  { id: "xp_machine", name: "XP Machine", icon: "🧮⚡", rarity: "Golden", description: "Earn at least 1,000 XP in one week." },
  { id: "ear_resistible", name: "Ear-resistible", icon: "👂✨", rarity: "Golden", description: "Score 90% or higher in 5 Ear Training levels." },
  { id: "note_sniper", name: "Note Sniper", icon: "🎯🎼", rarity: "Golden", description: "Get 5 correct sight-reading answers in a row." },
  { id: "the_sharpshooter", name: "The Sharpshooter", icon: "🎯♯", rarity: "Golden", description: "Reach level 6 in Sight Reading (mastering sharps and flats)." },
  { id: "eighth_note_expert", name: "Eighth Note Expert", icon: "🎵🎖️", rarity: "Golden", description: "Reach level 6 in Rhythm Training (mastering eighth notes)." },
  { id: "the_augmented_listener", name: "The Augmented Listener", icon: "👂🔺", rarity: "Golden", description: "Reach level 6 in Ear Training (distinguishing augmented chords)." },
  
  // Bronze badges
  { id: "melodic_hatchling", name: "Melodic Hatchling", icon: "🐣🎶", rarity: "Bronze", description: "Complete your first melodic level." },
  { id: "hot_ears", name: "Hot Ears", icon: "🔥👂", rarity: "Bronze", description: "Practice 3 days in a row." },
  { id: "note_a_day_habit", name: "Note-a-Day Habit", icon: "📅🎵", rarity: "Bronze", description: "Practice 7 consecutive days." },
  { id: "podium_potato", name: "Podium Potato", icon: "🥔🥉", rarity: "Bronze", description: "Rank in the top 3 in the Arena." },
  { id: "clef_hanger", name: "Clef Hanger", icon: "🚪🏃", rarity: "Bronze", description: "Quit a training session before completing it." },
  { id: "oops_again", name: "Oops I Did It Again", icon: "😬🔁", rarity: "Bronze", description: "Fail the same level 5 times in a row." },
  { id: "mozart_pajamas", name: "Mozart in Pajamas", icon: "🛌🎼", rarity: "Bronze", description: "Practice between 2:00 AM and 4:00 AM." },
  
  // Welcome badges (Bronze)
  { id: "first_steps", name: "First Steps", icon: "👶🎵", rarity: "Bronze", description: "Complete your very first training session." },
  { id: "the_explorer", name: "The Explorer", icon: "🗺️🎼", rarity: "Bronze", description: "Try each of the three main training modules at least once." },
  { id: "weekend_warrior", name: "Weekend Warrior", icon: "⚔️📅", rarity: "Bronze", description: "Complete a practice session on a Saturday or Sunday." },
  { id: "the_comeback_kid", name: "The Comeback Kid", icon: "💪🔄", rarity: "Bronze", description: "Fail a session (<70% accuracy), then retry immediately and pass." }
];

const RARITY_COLORS = {
  Bronze: { 
    bg: "from-amber-600 to-orange-700", 
    border: "border-amber-600", 
    text: "text-white",
    cardBg: "from-amber-50 to-orange-100"
  },
  Golden: { 
    bg: "from-yellow-500 to-yellow-600", 
    border: "border-yellow-500", 
    text: "text-white",
    cardBg: "from-yellow-50 to-yellow-100"
  },
  Platinum: { 
    bg: "from-cyan-500 to-blue-500", 
    border: "border-cyan-500", 
    text: "text-white",
    cardBg: "from-cyan-50 to-blue-100"
  },
  Superb: { 
    bg: "from-purple-600 to-pink-600", 
    border: "border-purple-600", 
    text: "text-white",
    cardBg: "from-purple-100 to-pink-100"
  },
  GODLIKE: {
    bg: "from-red-500 via-orange-400 via-yellow-300 via-green-400 via-blue-500 via-indigo-600 to-purple-700",
    border: "border-red-500",
    text: "text-white",
    cardBg: "from-red-50 via-orange-50 via-yellow-50 via-green-50 via-blue-50 via-indigo-50 to-purple-50",
    special: true
  }
};

export default function Badges() {
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserBadges = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        const unlockedBadgesResult = await UserBadges.filter({ user_email: user.email }, '-created_date', 100);
        const unlockedBadgeIds = new Set(unlockedBadgesResult.map(b => b.badge_id));

        const allBadges = BADGE_DEFINITIONS.map(badge => ({
          ...badge,
          unlocked: unlockedBadgeIds.has(badge.id)
        }));
        
        setBadges(allBadges);
      } catch (error) {
        console.error("Failed to fetch user badges, showing all as locked.", error);
        const allBadges = BADGE_DEFINITIONS.map(badge => ({
          ...badge,
          unlocked: false
        }));
        setBadges(allBadges);
      }
      setIsLoading(false);
    };

    fetchUserBadges();
  }, []);

  const rarities = ["All", "GODLIKE", "Superb", "Platinum", "Golden", "Bronze"];

  const filteredBadges = selectedRarity === "All" 
    ? badges 
    : badges.filter(badge => badge.rarity === selectedRarity);

  const getProgressStats = () => {
    if (isLoading || badges.length === 0) {
      return { total: "0/0", Bronze: "0/0", Golden: "0/0", Platinum: "0/0", Superb: "0/0", GODLIKE: "0/0" };
    }
    const totalBadges = badges.length;
    const unlockedBadges = badges.filter(b => b.unlocked).length;
    
    const stats = {
      total: `${unlockedBadges}/${totalBadges}`,
      Bronze: badges.filter(b => b.rarity === "Bronze" && b.unlocked).length + "/" + badges.filter(b => b.rarity === "Bronze").length,
      Golden: badges.filter(b => b.rarity === "Golden" && b.unlocked).length + "/" + badges.filter(b => b.rarity === "Golden").length,
      Platinum: badges.filter(b => b.rarity === "Platinum" && b.unlocked).length + "/" + badges.filter(b => b.rarity === "Platinum").length,
      Superb: badges.filter(b => b.rarity === "Superb" && b.unlocked).length + "/" + badges.filter(b => b.rarity === "Superb").length,
      GODLIKE: badges.filter(b => b.rarity === "GODLIKE" && b.unlocked).length + "/" + badges.filter(b => b.rarity === "GODLIKE").length
    };
    
    return stats;
  };

  const stats = getProgressStats();

  const BadgeCard = ({ badge }) => {
    const colors = RARITY_COLORS[badge.rarity];
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.03 }}
        className="cursor-default" 
      >
        <Card className={`clay-card h-full transition-all duration-300 ${
          badge.unlocked 
            ? `bg-gradient-to-br ${colors.cardBg} ${colors.border} border-2 shadow-lg ${colors.special ? 'animate-pulse shadow-2xl' : ''}` 
            : 'bg-gray-100 border-gray-300 border-2 opacity-70'
        }`}>
          <CardContent className="p-3 text-center space-y-2 h-full flex flex-col">
            <div className="relative">
              <div className={`text-2xl mb-1 ${colors.special && badge.unlocked ? 'animate-bounce' : ''}`}>
                {badge.unlocked ? badge.icon : '🔒'}
              </div>
              {colors.special && badge.unlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400 opacity-20 blur-xl animate-pulse"></div>
              )}
            </div>

            <h3 className={`font-bold text-xs leading-tight ${badge.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
              {badge.name}
            </h3>

            <Badge className={`bg-gradient-to-r ${colors.bg} ${colors.text} font-bold text-xs px-2 py-1 shadow-md ${colors.special ? 'animate-pulse shadow-lg' : ''}`}>
              {badge.rarity}
            </Badge>

            <p className={`text-xs flex-1 leading-tight ${badge.unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
              {badge.description}
            </p>

            {!badge.unlocked && (
              <div className="flex items-center justify-center gap-1 text-gray-400">
                <Lock className="w-3 h-3" />
                <span className="text-xs">Locked</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
        <p className="mt-4 text-gray-700">Loading Your Badge Collection...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Badge Collection</h1>
        <p className="text-gray-600">Unlock achievements by practicing and improving your skills!</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {rarities.map((rarity) => (
          <Button
            key={rarity}
            variant={selectedRarity === rarity ? "default" : "outline"}
            onClick={() => setSelectedRarity(rarity)}
            className={`clay-button transition-all duration-200 ${
              selectedRarity === rarity 
                ? rarity === "GODLIKE" 
                  ? 'bg-gradient-to-r from-red-500 via-orange-400 via-yellow-300 via-green-400 via-blue-500 via-indigo-600 to-purple-700 text-white animate-pulse'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {rarity}
          </Button>
        ))}
      </div>

      <div className="space-y-12">
        {selectedRarity === "All" ? (
          <>
            {badges.filter(badge => badge.rarity === "GODLIKE").length > 0 && (
              <div>
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 via-purple-400 to-transparent animate-pulse"></div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-orange-400 via-yellow-300 via-green-400 via-blue-500 via-indigo-600 to-purple-700 bg-clip-text text-transparent mx-6 px-4 py-2 rounded-full animate-pulse">
                    GODLIKE Badges
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 via-purple-400 to-transparent animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  <AnimatePresence>
                    {badges.filter(badge => badge.rarity === "GODLIKE").map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {badges.filter(badge => badge.rarity === "Superb").length > 0 && (
              <div>
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                  <h3 className="text-2xl font-bold text-purple-700 mx-6 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                    Superb Badges
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  <AnimatePresence>
                    {badges.filter(badge => badge.rarity === "Superb").map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {badges.filter(badge => badge.rarity === "Platinum").length > 0 && (
              <div>
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
                  <h3 className="text-2xl font-bold text-cyan-700 mx-6 px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full">
                    Platinum Badges
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  <AnimatePresence>
                    {badges.filter(badge => badge.rarity === "Platinum").map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {badges.filter(badge => badge.rarity === "Golden").length > 0 && (
              <div>
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent"></div>
                  <h3 className="text-2xl font-bold text-yellow-700 mx-6 px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-100 rounded-full">
                    Golden Badges
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  <AnimatePresence>
                    {badges.filter(badge => badge.rarity === "Golden").map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {badges.filter(badge => badge.rarity === "Bronze").length > 0 && (
              <div>
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                  <h3 className="text-2xl font-bold text-amber-700 mx-6 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
                    Bronze Badges
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  <AnimatePresence>
                    {badges.filter(badge => badge.rarity === "Bronze").map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            <AnimatePresence>
              {filteredBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="clay-card bg-white/80 p-6 mt-8">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Collection Progress
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-gray-800">
                {stats.total} Badges Unlocked
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 via-orange-400 via-yellow-300 via-green-400 via-blue-500 via-indigo-600 to-purple-700 rounded-full animate-pulse shadow-lg"></div>
              <span className="font-semibold bg-gradient-to-r from-red-500 via-orange-400 via-yellow-300 via-green-400 via-blue-500 via-indigo-600 to-purple-700 bg-clip-text text-transparent animate-pulse">GODLIKE: {stats.GODLIKE}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <span className="text-purple-700 font-semibold">Superb: {stats.Superb}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
              <span className="text-cyan-700 font-semibold">Platinum: {stats.Platinum}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"></div>
              <span className="text-yellow-700 font-semibold">Golden: {stats.Golden}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-r from-amber-600 to-orange-700 rounded-full"></div>
              <span className="text-amber-700 font-semibold">Bronze: {stats.Bronze}</span>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${(parseInt(stats.total.split('/')[0]) / parseInt(stats.total.split('/')[1])) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {Math.round((parseInt(stats.total.split('/')[0]) / parseInt(stats.total.split('/')[1])) * 100)}% Complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
