import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

const ProgressContext = createContext(null);

const STORAGE_KEY = "gcse_maths_progress";

// ── Score values ──────────────────────────────────────────────────────────
// "correct"      — student revealed answer and self-marked correct
// "struggled"    — student revealed answer (implying they needed help)
// "not_attempted"— never opened

// ── Helpers ───────────────────────────────────────────────────────────────
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ── Provider ──────────────────────────────────────────────────────────────
export function ProgressProvider({ children }) {
  const { activeUser } = useUser();
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Get all scores for a given topic path for the active user
  const getTopicProgress = (topicPath) => {
    if (!activeUser) return {};
    return progress[activeUser.id]?.[topicPath] || {};
  };

  // Get score for a single question
  const getScore = (topicPath, questionId) => {
    if (!activeUser) return "not_attempted";
    return progress[activeUser.id]?.[topicPath]?.[questionId] || "not_attempted";
  };

  // Set score for a single question
  const setScore = (topicPath, questionId, score) => {
    if (!activeUser) return;
    setProgress(prev => ({
      ...prev,
      [activeUser.id]: {
        ...prev[activeUser.id],
        [topicPath]: {
          ...prev[activeUser.id]?.[topicPath],
          [questionId]: score,
        },
      },
    }));
  };

  // Calculate progress stats for a topic (for future progress bar use)
  const getTopicStats = (topicPath, totalQuestions) => {
    const scores = getTopicProgress(topicPath);
    const attempted = Object.keys(scores).length;
    const correct   = Object.values(scores).filter(s => s === "correct").length;
    const struggled = Object.values(scores).filter(s => s === "struggled").length;
    return {
      attempted,
      correct,
      struggled,
      total: totalQuestions,
      percentAttempted: totalQuestions ? Math.round((attempted / totalQuestions) * 100) : 0,
      percentCorrect:   totalQuestions ? Math.round((correct   / totalQuestions) * 100) : 0,
    };
  };

  return (
    <ProgressContext.Provider value={{ getScore, setScore, getTopicProgress, getTopicStats }}>
      {children}
    </ProgressContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useProgress() {
  return useContext(ProgressContext);
}