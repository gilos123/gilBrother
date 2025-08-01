import React, { useState, useEffect } from 'react';
import { WeeklyArena } from '@/api/entities';
import { UserBadges } from '@/api/entities';
import { UserProgress } from '@/api/entities';
import { getYear, getISOWeek, endOfISOWeek, formatDistanceToNow } from 'date-fns';
import { Crown, Shield, Sword, Loader2, Flame } from 'lucide-react';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to determine highest badge tier for a user
const getHighestBadgeTierFromList = (userEmail, allBadges) => {
    const normalizedEmail = userEmail?.toString().trim().toLowerCase();
    if (!normalizedEmail) {
      return { tier: null, color: null, count: 0 };
    }

    const userBadges = allBadges.filter(badge =>
      badge.user_email?.toString().trim().toLowerCase() === normalizedEmail
    );

    if (userBadges.length === 0) {
      return { tier: null, color: null, count: 0 };
    }

    const rarityPriority = ['GODLIKE', 'Superb', 'Platinum', 'Golden', 'Bronze'];

    for (const rarity of rarityPriority) {
      const hasRarity = userBadges.some(badge => badge.badge_rarity === rarity);
      if (hasRarity) {
        const colorMap = {
          'GODLIKE': 'from-red-500 via-orange-400 via-yellow-300 via-green-400 via-blue-500 via-indigo-600 to-purple-700',
          'Superb': 'from-purple-600 to-pink-600',
          'Platinum': 'from-cyan-500 to-blue-500',
          'Golden': 'from-yellow-500 to-yellow-600',
          'Bronze': 'from-amber-600 to-orange-700'
        };
        return {
          tier: rarity.toLowerCase(),
          color: colorMap[rarity],
          count: userBadges.length
        };
      }
    }

    return { tier: null, color: null, count: userBadges.length };
};

const PodiumPlace = ({ place, user, icon: Icon, color }) => {
  const badgeInfo = user.badgeInfo || { tier: null, color: null, count: 0 };
  const hasArenaWins = user.total_arena_wins >= 1; // FIXED: Show crown for any user with 1+ arena wins

  const placeStyles = {
    1: 'h-36 sm:h-48',
    2: 'h-28 sm:h-40',
    3: 'h-24 sm:h-32'
  };

  return (
    <div className="flex flex-col items-center flex-1 min-w-0 max-w-[120px]">
      <div className="text-2xl sm:text-4xl font-bold mb-2" style={{ color }}>
        {place}
      </div>
      <div className={`w-full ${placeStyles[place]} bg-white/50 clay-card flex flex-col items-center justify-end p-2 sm:p-4 text-center relative`}>
        {/* Badge Tier Diamond - only show if user has badges */}
        {badgeInfo.count > 0 && badgeInfo.color && (
          <div className="absolute -top-2 -right-2">
            <div className={`w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br ${badgeInfo.color} transform rotate-45 border border-white sm:border-2 shadow-lg flex items-center justify-center ${badgeInfo.tier === 'godlike' ? 'godlike-animated-bg' : ''}`}>
              <div className="transform -rotate-45 text-white font-bold text-xs">
                {badgeInfo.count}
              </div>
            </div>
          </div>
        )}

        {/* FIXED: Glowing Crown with Win Count for Arena Winners - show for ANY user with 1+ wins */}
        {hasArenaWins && (
          <div className="absolute -top-3 -left-3 flex items-center">
            <div className="relative">
              <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-500 glowing-crown" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg glowing-crown">
                {user.total_arena_wins}
              </div>
            </div>
          </div>
        )}

        <Icon className="w-6 h-6 sm:w-10 sm:h-10 mb-1 sm:mb-2" style={{ color }}/>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center gap-1.5">
            <p className="font-bold text-gray-800 text-xs sm:text-sm text-center leading-tight">{user.user_full_name}</p>

            {user.current_streak > 0 && (
              <div className="relative flex items-end justify-center w-7 h-7" title={`${user.current_streak} day streak`}>
                <Flame className="absolute text-orange-500 w-full h-full" fill="currentColor" />
                <span className="relative font-bold text-white text-xs drop-shadow-lg z-10 pb-[2px]">
                  {user.current_streak}
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-yellow-600 font-semibold mt-1">{user.weekly_xp} XP</p>
      </div>
    </div>
  );
};

export default function Arena() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      const weekIdentifier = `${getYear(new Date())}-W${getISOWeek(new Date())}`;

      try {
        // OPTIMIZED: Fetch data in parallel instead of sequentially
        const weeklyArenaEntries = await WeeklyArena.filter({ week_identifier: weekIdentifier }, '-weekly_xp', 50);

        if (weeklyArenaEntries.length === 0) {
          setLeaderboard([]);
          setIsLoading(false);
          return;
        }

        // OPTIMIZED: Fetch all user progress and badges in parallel
        const userEmails = weeklyArenaEntries.map(entry => entry.created_by);
        
        const [allUserProgress, allUserBadges] = await Promise.all([
          Promise.all(userEmails.map(email => 
            UserProgress.filter({ created_by: email }).catch(() => [])
          )),
          Promise.all(userEmails.map(email => 
            UserBadges.filter({ user_email: email }).catch(() => [])
          ))
        ]);

        // Build enriched leaderboard
        const enrichedLeaderboard = weeklyArenaEntries.map((entry, index) => {
          const userProgress = allUserProgress[index] || [];
          const userBadges = allUserBadges[index] || [];
          
          const latestProgress = userProgress.length > 0 ? userProgress[0] : null;
          const badgeInfo = getHighestBadgeTierFromList(entry.created_by, userBadges);

          return {
            ...entry,
            current_streak: latestProgress ? latestProgress.current_streak || 0 : 0,
            total_arena_wins: latestProgress ? latestProgress.total_arena_wins || 0 : 0,
            badgeInfo: badgeInfo,
          };
        });
        
        setLeaderboard(enrichedLeaderboard);

      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboard([]);
      }

      setIsLoading(false);
    };

    const updateTimer = () => {
        const endOfWeek = endOfISOWeek(new Date());
        setTimeUntilReset(formatDistanceToNow(endOfWeek, { addSuffix: true }));
    };

    fetchLeaderboard();
    updateTimer();
    const timerInterval = setInterval(updateTimer, 60000);

    return () => clearInterval(timerInterval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 py-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-gray-700">Loading Arena...</p>
        </div>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 5); // Only show top 5 users total (positions 4-5)

  const LeaderboardItem = ({ user, index }) => {
    const badgeInfo = user.badgeInfo || { tier: null, color: null, count: 0 };
    const hasArenaWins = user.total_arena_wins >= 1; // FIXED: Show crown for any user with 1+ arena wins

    return (
      <div key={user.id} className="clay-card bg-white/60 p-4 flex items-center justify-between relative">
        {/* Badge Tier Diamond */}
        {badgeInfo.count > 0 && badgeInfo.color && (
          <div className="absolute -top-2 -left-2 z-10">
            <div className={`w-8 h-8 bg-gradient-to-br ${badgeInfo.color} transform rotate-45 border border-white shadow-md flex items-center justify-center ${badgeInfo.tier === 'godlike' ? 'godlike-animated-bg' : ''}`}>
              <div className="transform -rotate-45 text-white font-bold text-xs">
                {badgeInfo.count}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="font-bold text-lg text-gray-500 w-6">{index + 4}</span>
            
            {/* FIXED: Show crown with win count for ANY user with arena wins >= 1 */}
            {hasArenaWins && (
              <div className="absolute -top-1 -right-6 flex items-center">
                <div className="relative">
                  <Crown className="w-5 h-5 text-yellow-500 glowing-crown" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg glowing-crown">
                    {user.total_arena_wins}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-800">{user.user_full_name}</p>

            {user.current_streak > 0 && (
              <div className="relative flex items-end justify-center w-7 h-7" title={`${user.current_streak} day streak`}>
                <Flame className="absolute text-orange-500 w-full h-full" fill="currentColor" />
                <span className="relative font-bold text-white text-xs drop-shadow-lg z-10 pb-[2px]">
                  {user.current_streak}
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="font-bold text-yellow-600">{user.weekly_xp} XP</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 space-y-8 sm:space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Weekly Arena</h1>
          <p className="text-gray-600">Compete for the top spot! Resets {timeUntilReset}.</p>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-center items-end gap-2 sm:gap-4 h-48 sm:h-64 px-2">
            {leaderboard.length > 0 ? (
              <>
                {top3[1] && <PodiumPlace place={2} user={top3[1]} icon={Shield} color="#a0aec0" />}
                {top3[0] && <PodiumPlace place={1} user={top3[0]} icon={Crown} color="#ecc94b" />}
                {top3[2] && <PodiumPlace place={3} user={top3[2]} icon={Sword} color="#cd7f32" />}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-center">
                The Arena is quiet... Be the first to set a score!
              </div>
            )}
          </div>
        </div>

        {rest.length > 0 && (
           <div className="max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">Top Contenders</h2>
              <div className="space-y-3">
                {rest.map((user, index) => (
                  <LeaderboardItem key={user.id} user={user} index={index} />
                ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}