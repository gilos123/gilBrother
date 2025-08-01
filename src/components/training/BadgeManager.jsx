
import { UserBadges } from '@/api/entities';
import { UserProgress } from '@/api/entities';
import { Session } from '@/api/entities';
import { User } from '@/api/entities';
import { WeeklyArena } from '@/api/entities';
import { getYear, getISOWeek } from 'date-fns';

// FIXED: Badge descriptions updated to level 20
const BADGE_DEFINITIONS = {
  // Bronze
  hot_ears: { id: "hot_ears", name: "Hot Ears", rarity: "Bronze", icon: "👂", description: "Completed 5 ear training sessions." },
  note_a_day_habit: { id: "note_a_day_habit", name: "Note-a-Day Habit", rarity: "Bronze", icon: "📅", description: "Practiced for 3 consecutive days." },
  podium_potato: { id: "podium_potato", name: "Podium Potato", rarity: "Bronze", icon: "🥔", description: "Reached the top 3 on a weekly leaderboard." },
  clef_hanger: { id: "clef_hanger", name: "Clef Hanger", rarity: "Bronze", icon: "🎶", description: "Quit a session prematurely." },
  oops_again: { id: "oops_again", name: "Oops I Did It Again", rarity: "Bronze", icon: "🤦", description: "Made mistakes in 3 consecutive sessions but kept going." },
  mozart_pajamas: { id: "mozart_pajamas", name: "Mozart in Pajamas", rarity: "Bronze", icon: "🛌", description: "Practiced between 10 PM and 6 AM." },
  first_steps: { id: "first_steps", name: "First Steps", rarity: "Bronze", icon: "👣", description: "Completed your very first session." },
  the_explorer: { id: "the_explorer", name: "The Explorer", rarity: "Bronze", icon: "🧭", description: "Tried all main training modules." },
  weekend_warrior: { id: "weekend_warrior", name: "Weekend Warrior", rarity: "Bronze", icon: "⚡", description: "Practiced during the weekend." },
  the_comeback_kid: { id: "the_comeback_kid", name: "The Comeback Kid", rarity: "Bronze", icon: "🔄", description: "Improved significantly after a tough session." },
  // NEW Bronze badges
  speed_demon: { id: "speed_demon", name: "Speed Demon", rarity: "Bronze", icon: "⚡", description: "Earned 5 speed bonuses in sight reading." },
  perfect_pitch_newbie: { id: "perfect_pitch_newbie", name: "Perfect Pitch Newbie", rarity: "Bronze", icon: "🎯", description: "Got 10 questions correct in a row across all sessions." },
  
  // Silver
  streak_flame: { id: "streak_flame", name: "Streak Flame", rarity: "Silver", icon: "🔥", description: "Maintained a learning streak for 7 days." },
  sage_of_sounds: { id: "sage_of_sounds", name: "Sage of Sounds", rarity: "Silver", icon: "💡", description: "Provided helpful tips to fellow learners." },
  // NEW Silver badge
  century_club: { id: "century_club", name: "Century Club", rarity: "Silver", icon: "💯", description: "Earned 100 total XP." },
  
  // Golden
  metronome_monk: { id: "metronome_monk", name: "Metronome Monk", rarity: "Golden", icon: "⏱️", description: "Achieved high rhythm accuracy across 10 sessions." },
  dont_get_tired: { id: "dont_get_tired", name: "Don't Get Tired", rarity: "Golden", icon: "💪", description: "Completed a perfect session (all questions correct)." },
  endless_encore: { id: "endless_encore", name: "Endless Encore", rarity: "Golden", icon: "🔁", description: "Completed 15 total practice sessions." },
  xp_machine: { id: "xp_machine", name: "XP Machine", rarity: "Golden", icon: "🧠", description: "Earned 200 total XP." },
  ear_resistible: { id: "ear_resistible", name: "Ear-resistible", rarity: "Golden", icon: "👂", description: "Achieved 90%+ accuracy in 5 ear training sessions." },
  note_sniper: { id: "note_sniper", name: "Note Sniper", rarity: "Golden", icon: "🎯", description: "Achieved perfect accuracy in sight reading." },
  the_sharpshooter: { id: "the_sharpshooter", name: "The Sharpshooter", rarity: "Golden", icon: "🏹", description: "Reached level 6 in Sight Reading." },
  eighth_note_expert: { id: "eighth_note_expert", name: "Eighth Note Expert", rarity: "Golden", icon: "🎼", description: "Reached level 6 in Rhythm Training." },
  the_augmented_listener: { id: "the_augmented_listener", name: "The Augmented Listener", rarity: "Golden", icon: "👂➕", description: "Reached level 6 in Ear Training." },
  // NEW Golden badges
  double_century: { id: "double_century", name: "Double Century", rarity: "Golden", icon: "💰", description: "Earned 300 total XP." },
  
  // Platinum
  i_live_here_now: { id: "i_live_here_now", name: "I Live Here Now", rarity: "Platinum", icon: "🏠", description: "Completed 25 total practice sessions." },
  tiny_tapper: { id: "tiny_tapper", name: "Tiny Tapper", rarity: "Platinum", icon: "🤏", description: "Got 100 correct rhythm exercises." },
  punch_above_clef: { id: "punch_above_clef", name: "Punch Above Your Clef", rarity: "Platinum", icon: "🥊", description: "Achieved 95%+ accuracy in a difficult session." },
  simply_miss_note: { id: "simply_miss_note", name: "One Does Not Simply Miss a Note", rarity: "Platinum", icon: "✅", description: "Achieved 95%+ accuracy across 5 sessions." },
  ledger_line_legend: { id: "ledger_line_legend", name: "Ledger Line Legend", rarity: "Platinum", icon: "📜", description: "Reached level 11 in Sight Reading." },
  syncopation_sensation: { id: "syncopation_sensation", name: "Syncopation Sensation", rarity: "Platinum", icon: "💃", description: "Reached level 11 in Rhythm Training." },
  seventh_heaven: { id: "seventh_heaven", name: "Seventh Heaven", rarity: "Platinum", icon: "☁️7️⃣", description: "Reached level 11 in Ear Training." },
  // NEW Platinum badge
  marathon_musician: { id: "marathon_musician", name: "Marathon Musician", rarity: "Platinum", icon: "🏃", description: "Maintained a 14-day practice streak." },
  
  // Superb
  king_of_staff: { id: "king_of_staff", name: "King of the Staff", rarity: "Superb", icon: "👑", description: "Reached level 10+ in all main modules." },
  the_enharmonicist: { id: "the_enharmonicist", name: "The Enharmonicist", rarity: "Superb", icon: "↔️", description: "Reached level 20 in Sight Reading." },
  triplet_titan: { id: "triplet_titan", name: "Triplet Titan", rarity: "Superb", icon: "🎶🎶🎶", description: "Reached level 20 in Rhythm Training." },
  inversion_inspector: { id: "inversion_inspector", name: "Inversion Inspector", rarity: "Superb", icon: "🕵️", description: "Reached level 20 in Ear Training." },
  map_master: { id: "map_master", name: "Map Master", rarity: "Superb", icon: "🗺️", description: "Reached level 20 in Musical Geography." },
  
  // GODLIKE
  referral_master: { id: "referral_master", name: "Referral Master", rarity: "GODLIKE", icon: "🤝", description: "Invited many friends to join." }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// FIXED: Debug function to check if badge already exists
const hasBadge = async (userEmail, badgeId) => {
  try {
    const existingBadges = await UserBadges.filter({ user_email: userEmail, badge_id: badgeId });
    return existingBadges.length > 0;
  } catch (error) {
    console.error(`Error checking badge ${badgeId} for ${userEmail}:`, error);
    return false;
  }
};

// ROBUST: Award badge with proper error handling and duplicate prevention
const awardBadge = async (userEmail, badgeId, badgeName, badgeRarity) => {
  try {
    // Check if user already has this badge
    const alreadyHas = await hasBadge(userEmail, badgeId);
    if (alreadyHas) {
      console.log(`User ${userEmail} already has badge ${badgeId}`);
      return false;
    }

    await UserBadges.create({
      badge_id: badgeId,
      badge_name: badgeName,
      badge_rarity: badgeRarity,
      user_email: userEmail,
      unlocked_date: new Date().toISOString()
    });

    console.log(`✅ Awarded badge "${badgeName}" to ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to award badge ${badgeId} to ${userEmail}:`, error);
    return false;
  }
};

export class BadgeManager {
  constructor(userEmail) {
    this.userEmail = userEmail;
    this.unlockedBadges = new Set();
    this.sessionBadges = []; // Track badges unlocked in current session
    // Existing properties for other badge checks
    this.isFirstSession = false;
    this.lastFailedSession = null;
  }

  async init() {
    try {
      // Load existing badges
      const badges = await UserBadges.filter({ user_email: this.userEmail });
      this.unlockedBadges = new Set(badges.map(b => b.badge_id));

      // Check if this is user's first session (still depends on this.isFirstSession if the checkFirstSession method is called)
      // Note: 'first_steps' badge is now handled by checkAndAwardBasicBadges externally. This property remains for general use.
      this.isFirstSession = this.unlockedBadges.size === 0;

    } catch (error) {
      console.error("BadgeManager init error:", error);
    }
  }

  async grantBadge(badgeId) {
    if (this.unlockedBadges.has(badgeId)) {
      return; // Badge already unlocked in this session or loaded from init
    }

    const badgeDefinition = BADGE_DEFINITIONS[badgeId];
    if (!badgeDefinition) {
      console.warn(`Badge definition not found for: ${badgeId}`);
      return;
    }

    // Use the robust awardBadge function for persistence and duplicate prevention
    const awardedSuccessfully = await awardBadge(
      this.userEmail,
      badgeId,
      badgeDefinition.name,
      badgeDefinition.rarity
    );

    if (awardedSuccessfully) {
      this.unlockedBadges.add(badgeId); // Add to in-memory set for current session
      // Add to session badges for notification/summary at end of session
      this.sessionBadges.push({
        id: badgeId,
        name: badgeDefinition.name,
        rarity: badgeDefinition.rarity,
        icon: badgeDefinition.icon,
        description: badgeDefinition.description
      });

      // Show notification immediately
      this.showNotification(badgeDefinition);
    }
  }

  async showNotification(badge) {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'badge',
      message: `${badge.name} Unlocked!`,
      icon: badge.icon,
      rarity: badge.rarity,
      duration: 5000
    };

    // Use a custom event to bubble up the notification to the UI
    const event = new CustomEvent('add-notification', { detail: newNotification });
    window.dispatchEvent(event);
  }

  async checkSessionPerformance(correctAnswers, module) {
    // 'dont_get_tired' badge logic has been moved to checkAndAwardBasicBadges for perfect sessions.
    // This method can be used for other session-specific performance badges if needed.
  }

  // Clef Hanger - Simple quit detection
  async checkClefHanger() {
    // This will be called when user quits a session
    await this.grantBadge('clef_hanger');
  }

  checkComebackKid(accuracy, module) {
    if (accuracy < 70) {
      // Store failed session info
      this.lastFailedSession = { module, timestamp: Date.now() };
    } else if (this.lastFailedSession &&
               this.lastFailedSession.module === module &&
               (Date.now() - this.lastFailedSession.timestamp) < 300000) { // Within 5 minutes
      this.grantBadge('the_comeback_kid');
      this.lastFailedSession = null;
    }
  }

  checkLevelMilestones(module, newLevel) {
    // Level-based badge logic is now handled by the external checkAndAwardAdvancedBadges function,
    // typically called after a session or when user progress is updated.
    // This method is now empty as per the new design.
  }
}

// FIXED: Comprehensive badge check function with corrected logic
// This function is now called from Training.js after a session is complete.
// It checks and awards basic badges for the CURRENT user only.
export const checkAndAwardBasicBadges = async (user, userProgress, currentSession) => {
    if (!user || !user.email) return;

    try {
        console.log(`🔍 Checking basic badges for ${user.email} after session completion.`);
        const existingBadgesRecords = await UserBadges.filter({ user_email: user.email });
        const badgeIds = new Set(existingBadgesRecords.map(b => b.badge_id));
        
        const badgesToAward = [];
        const now = new Date().toISOString();

        // 1. "First Steps" Badge
        if (!badgeIds.has('first_steps')) {
            // Check if user has any session recorded
            const hasAnySession = (await Session.filter({ created_by: user.email }, '-created_date', 1)).length > 0;
            if (hasAnySession) {
                badgesToAward.push({
                    badge_id: 'first_steps',
                    badge_name: 'First Steps',
                    badge_rarity: 'Bronze',
                    user_email: user.email,
                    unlocked_date: now
                });
            }
        }
        
        // 2. "The Explorer" Badge - FIXED: Check if user tried all 3 main modules
        if (!badgeIds.has('the_explorer')) {
            const allSessions = await Session.filter({ created_by: user.email });
            const mainModules = ['ear_training', 'rhythm_training', 'sight_reading'];
            const completedModules = new Set(allSessions.map(s => s.module_type).filter(Boolean));
            
            if (mainModules.every(module => completedModules.has(module))) {
                badgesToAward.push({
                    badge_id: 'the_explorer',
                    badge_name: 'The Explorer',
                    badge_rarity: 'Bronze',
                    user_email: user.email,
                    unlocked_date: now
                });
            }
        }

        // 3. "Weekend Warrior" Badge
        if (!badgeIds.has('weekend_warrior')) { // Check if user has any weekend session
            const allSessions = await Session.filter({ created_by: user.email });
            const hasWeekendSession = allSessions.some(session => {
                const sessionDate = new Date(session.created_date);
                const dayOfWeek = sessionDate.getDay();
                return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
            });
            if (hasWeekendSession) {
                badgesToAward.push({
                    badge_id: 'weekend_warrior',
                    badge_name: 'Weekend Warrior',
                    badge_rarity: 'Bronze',
                    user_email: user.email,
                    unlocked_date: now
                });
            }
        }

        // 4. NEW: "Don't Get Tired" Badge - Perfect session
        if (!badgeIds.has('dont_get_tired') && currentSession) {
            if (currentSession.correct_answers !== undefined && currentSession.total_questions !== undefined && 
                currentSession.total_questions > 0 && currentSession.correct_answers === currentSession.total_questions) {
                badgesToAward.push({
                    badge_id: 'dont_get_tired',
                    badge_name: "Don't Get Tired",
                    badge_rarity: 'Golden',
                    user_email: user.email,
                    unlocked_date: now
                });
            }
        }

        // 5. NEW: "Century Club" Badge - 100 XP
        if (!badgeIds.has('century_club') && userProgress && userProgress.total_xp !== undefined && userProgress.total_xp >= 100) {
            badgesToAward.push({
                badge_id: 'century_club',
                badge_name: 'Century Club',
                badge_rarity: 'Silver',
                user_email: user.email,
                unlocked_date: now
            });
        }

        // 6. NEW: "XP Machine" Badge - 200 XP (Updated definition)
        if (!badgeIds.has('xp_machine') && userProgress && userProgress.total_xp !== undefined && userProgress.total_xp >= 200) {
            badgesToAward.push({
                badge_id: 'xp_machine',
                badge_name: 'XP Machine',
                badge_rarity: 'Golden',
                user_email: user.email,
                unlocked_date: now
            });
        }

        // 7. NEW: "Double Century" Badge - 300 XP
        if (!badgeIds.has('double_century') && userProgress && userProgress.total_xp !== undefined && userProgress.total_xp >= 300) {
            badgesToAward.push({
                badge_id: 'double_century',
                badge_name: 'Double Century',
                badge_rarity: 'Golden',
                user_email: user.email,
                unlocked_date: now
            });
        }

        // 8. NEW: "Streak Flame" Badge - 7 day streak
        if (!badgeIds.has('streak_flame') && userProgress && userProgress.current_streak !== undefined && userProgress.current_streak >= 7) {
            badgesToAward.push({
                badge_id: 'streak_flame',
                badge_name: 'Streak Flame',
                badge_rarity: 'Silver',
                user_email: user.email,
                unlocked_date: now
            });
        }

        // 9. NEW: "Marathon Musician" Badge - 14 day streak
        if (!badgeIds.has('marathon_musician') && userProgress && userProgress.current_streak !== undefined && userProgress.current_streak >= 14) {
            badgesToAward.push({
                badge_id: 'marathon_musician',
                badge_name: 'Marathon Musician',
                badge_rarity: 'Platinum',
                user_email: user.email,
                unlocked_date: now
            });
        }

        // 10. "Endless Encore" Badge - 15 sessions (Updated definition)
        if (!badgeIds.has('endless_encore')) {
            const allSessions = await Session.filter({ created_by: user.email });
            if (allSessions.length >= 15) {
                badgesToAward.push({
                    badge_id: 'endless_encore',
                    badge_name: 'Endless Encore',
                    badge_rarity: 'Golden',
                    user_email: user.email,
                    unlocked_date: now
                });
            }
        }

        // 11. "I Live Here Now" Badge - 25 sessions (Updated definition)
        if (!badgeIds.has('i_live_here_now')) {
            const allSessions = await Session.filter({ created_by: user.email });
            if (allSessions.length >= 25) {
                badgesToAward.push({
                    badge_id: 'i_live_here_now',
                    badge_name: 'I Live Here Now',
                    badge_rarity: 'Platinum',
                    user_email: user.email,
                    unlocked_date: now
                });
            }
        }

        // Award badges one by one
        for (const badgeData of badgesToAward) {
            // Double check existence to prevent race conditions if multiple calls overlap
            const awardedSuccessfully = await awardBadge(badgeData.user_email, badgeData.badge_id, badgeData.badge_name, badgeData.badge_rarity);
            if (awardedSuccessfully) {
                await delay(100); // Small delay between creations to mitigate rate limits
                
                // Trigger notification
                const badgeDef = BADGE_DEFINITIONS[badgeData.badge_id];
                if (badgeDef && typeof window !== 'undefined') {
                    const event = new CustomEvent('add-notification', {
                        detail: {
                            id: Date.now() + Math.random(),
                            type: 'badge',
                            message: `${badgeDef.name} Unlocked!`,
                            icon: badgeDef.icon,
                            rarity: badgeDef.rarity,
                            duration: 5000
                        }
                    });
                    window.dispatchEvent(event);
                }
            }
        }

    } catch (error) {
        console.error(`❌ Error checking/awarding basic badges for ${user.email}:`, error);
    }
};

export const checkAndAwardAdvancedBadges = async (user, userProgress) => {
    if (!user || !user.email || !userProgress) return;

    try {
        console.log(`🔍 Checking advanced badges for ${user.email}.`);
        const existingBadgesRecords = await UserBadges.filter({ user_email: user.email });
        const badgeIds = new Set(existingBadgesRecords.map(b => b.badge_id));
        
        const badgeChecks = [
            // Sharpshooter
            { id: 'the_sharpshooter', condition: userProgress.sight_reading_level >= 6 },
            // Eighth Note Expert
            { id: 'eighth_note_expert', condition: userProgress.rhythm_training_level >= 6 },
            // The Augmented Listener
            { id: 'the_augmented_listener', condition: userProgress.ear_training_level >= 6 },
            // Ledger Line Legend
            { id: 'ledger_line_legend', condition: userProgress.sight_reading_level >= 11 },
            // Syncopation Sensation
            { id: 'syncopation_sensation', condition: userProgress.rhythm_training_level >= 11 },
            // Seventh Heaven
            { id: 'seventh_heaven', condition: userProgress.ear_training_level >= 11 },
            // FIXED: Superb badges now check for level 20
            // The Enharmonicist
            { id: 'the_enharmonicist', condition: userProgress.sight_reading_level >= 20 },
            // Triplet Titan
            { id: 'triplet_titan', condition: userProgress.rhythm_training_level >= 20 },
            // Inversion Inspector
            { id: 'inversion_inspector', condition: userProgress.ear_training_level >= 20 },
            // Map Master
            { id: 'map_master', condition: userProgress.musical_geography_level >= 20 },
            // King of the Staff
            { 
                id: 'king_of_staff', 
                condition: userProgress.ear_training_level >= 10 && 
                           userProgress.rhythm_training_level >= 10 && 
                           userProgress.sight_reading_level >= 10 
            },
        ];

        for (const check of badgeChecks) {
            if (check.condition && !badgeIds.has(check.id)) {
                const badgeDef = BADGE_DEFINITIONS[check.id];
                if (badgeDef) {
                    const awardedSuccessfully = await awardBadge(user.email, badgeDef.id, badgeDef.name, badgeDef.rarity);
                    if (awardedSuccessfully && typeof window !== 'undefined') {
                         // Trigger notification for newly awarded advanced badges
                        const event = new CustomEvent('add-notification', {
                            detail: {
                                id: Date.now() + Math.random(),
                                type: 'badge',
                                message: `${badgeDef.name} Unlocked!`,
                                icon: badgeDef.icon,
                                rarity: badgeDef.rarity,
                                duration: 5000
                            }
                        });
                        window.dispatchEvent(event);
                    }
                }
            }
        }

    } catch (error) {
        console.error(`❌ Error checking/awarding advanced badges for ${user.email}:`, error);
    }
};

// MAIN: Comprehensive badge check function
// This function now primarily handles 'sage_of_sounds'.
export const checkAndAwardBadges = async (stats, user, userProgress) => {
  const newlyAwardedBadges = [];
  const userEmail = user.email;

  try {
    console.log(`🎯 Starting comprehensive badge check for ${userEmail}`);

    // checkAndAwardBasicBadges and checkAndAwardAdvancedBadges are now called externally
    // (e.g., from Training.js after a session or from a retroactive script).
    // This function focuses on other specific badge checks.

    // Check for Sage of Sounds badge (for contributing helpful tips)
    // Assuming stats.tipsProvided counts the number of helpful tips provided by the user
    if (stats && stats.tipsProvided >= 5) { // Example: 5 tips provided
      const badgeDef = BADGE_DEFINITIONS["sage_of_sounds"];
      const awardedSuccessfully = await awardBadge(userEmail, badgeDef.id, badgeDef.name, badgeDef.rarity);
      if (awardedSuccessfully) {
        newlyAwardedBadges.push({
          badge_id: badgeDef.id,
          badge_name: badgeDef.name,
          badge_rarity: badgeDef.rarity,
          user_email: userEmail
        });
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('add-notification', {
                detail: {
                    id: Date.now() + Math.random(),
                    type: 'badge',
                    message: `${badgeDef.name} Unlocked!`,
                    icon: badgeDef.icon,
                    rarity: badgeDef.rarity,
                    duration: 5000
                }
            });
            window.dispatchEvent(event);
        }
      }
    }

  } catch (error) {
    console.error('Error in comprehensive badge checking system:', error);
  }
  return newlyAwardedBadges;
};

// UTILITY: Function to retroactively award missing badges to existing users
export const retroactivelyAwardMissingBadges = async () => {
  try {
    console.log('🔄 Starting retroactive badge awarding process...');

    let uniqueUsers = [];
    try {
      const allUsers = await User.list();
      uniqueUsers = allUsers.map(u => u.email).filter(Boolean); // Ensure email is not null/undefined
    } catch (error) {
      console.warn('Could not fetch all users from User entity, falling back to sessions:', error);
      // Fetch recent sessions to find active users if User.list fails
      const allSessions = await Session.list('-created_date', 1000); 
      uniqueUsers = [...new Set(allSessions.map(s => s.created_by).filter(Boolean))]; // Filter out null/undefined created_by
    }

    console.log(`Found ${uniqueUsers.length} users to process`);

    for (const userEmail of uniqueUsers) {
      console.log(`\n👤 Processing user: ${userEmail}`);
      
      try {
        const user = { email: userEmail }; // Create a minimal user object for consistency
        const userProgress = await UserProgress.get(userEmail); // Fetch user progress
        // userProgress might be null if no record exists for the user yet.
        // The checkAndAward functions handle null userProgress gracefully.

        // Call checkAndAwardBasicBadges which now handles:
        // "First Steps", "The Explorer", "Weekend Warrior", XP-based, streak-based, and perfect session.
        // For retroactive application, `currentSession` is passed as null.
        await checkAndAwardBasicBadges(user, userProgress, null); 
        await delay(100); 

        // Call checkAndAwardAdvancedBadges for all level-based and map master badges.
        await checkAndAwardAdvancedBadges(user, userProgress);
        await delay(100);

        // checkAndAwardBadges (for 'sage_of_sounds') is skipped here as it requires 'stats.tipsProvided',
        // which cannot be reliably determined retroactively without a specific data source.

      } catch (userError) {
        console.error(`❌ Error processing user ${userEmail} for retroactive badges:`, userError);
      }
    }

    console.log('✅ Retroactive badge awarding completed');
  } catch (error) {
    console.error('❌ Error in retroactive badge awarding process:', error);
  }
};
