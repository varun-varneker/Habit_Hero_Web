import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveUserData } from "../api/userData";

// Define initial stats here since we can't import from store
const initialStats = {
  health: 100,
  xp: 0,
  level: 1,
  levelUpPending: false,
  charisma: 0,
  intelligence: 0,
  strength: 0,
  adaptability: 0,
  willpower: 0
};

function isOverdue(deadline, completed) {
  if (completed) return false;
  if (!deadline) return false;
  const today = new Date().toISOString().slice(0, 10);
  return deadline < today;
}

export default function useStatDecay(loaded = false) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const stats = useSelector(state => state.stats);
  const quests = useSelector(state => state.quests);

  useEffect(() => {
    if (!user?.uid || !loaded) return; // Wait for data to load

    console.log("Checking for overdue quests...", quests);
    
    let healthDecreased = false;
    const today = new Date().toISOString().slice(0, 10);

    // Check for overdue quests that haven't been penalized yet
    const updatedQuests = quests.map(quest => {
      if (!quest.completed && 
          quest.deadline && 
          quest.deadline < today && 
          !quest.healthPenaltyApplied) {
        
        console.log(`Quest "${quest.text}" is overdue! Deadline: ${quest.deadline}, Today: ${today}`);
        healthDecreased = true;
        return { ...quest, healthPenaltyApplied: true };
      }
      return quest;
    });

    if (healthDecreased) {
      // Count how many quests became overdue
      const overdueCount = updatedQuests.filter(
        (quest, index) => 
          quest.healthPenaltyApplied && !quests[index].healthPenaltyApplied
      ).length;

      // Decrease health by 10 for each overdue quest
      const newHealth = Math.max(0, (stats.health || 100) - (10 * overdueCount));
      console.log(`Health decreased from ${stats.health} to ${newHealth} due to ${overdueCount} overdue quest(s)`);

      if (newHealth === 0) {
        console.log("HP reached 0 - Resetting progress");
        dispatch({ type: "RESET_USER_PROGRESS" });
        saveUserData(user.uid, { 
          stats: initialStats,
          quests: [],
          achievements: []
        });
      } else {
        // Update both quests and stats
        dispatch({ type: "SET_QUESTS", payload: updatedQuests });
        dispatch({
          type: "UPDATE_STATS",
          payload: { health: newHealth }
        });
        
        // Save to database
        saveUserData(user.uid, { 
          quests: updatedQuests,
          stats: { ...stats, health: newHealth }
        });
      }
    }
  }, [quests, stats, user?.uid, dispatch, loaded]);
}