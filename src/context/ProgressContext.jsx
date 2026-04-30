import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

const ProgressContext = createContext(null);

const STORAGE_KEY = "gcse_maths_progress";

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

  const uid = activeUser?.id;

  // ── Question-level scores ─────────────────────────────────────────────
  const getTopicProgress = (topicPath) => {
    if (!uid) return {};
    return progress[uid]?.[topicPath]?.questions || {};
  };

  const getScore = (topicPath, questionId) => {
    if (!uid) return "not_attempted";
    return progress[uid]?.[topicPath]?.questions?.[questionId] || "not_attempted";
  };

  const setScore = (topicPath, questionId, score) => {
    if (!uid) return;
    setProgress(prev => ({
      ...prev,
      [uid]: {
        ...prev[uid],
        [topicPath]: {
          ...prev[uid]?.[topicPath],
          questions: {
            ...prev[uid]?.[topicPath]?.questions,
            [questionId]: score,
          },
        },
      },
    }));
  };

  // ── Topic-level understood flag ───────────────────────────────────────
  const isTopicUnderstood = (topicId) => {
    if (!uid) return false;
    return progress[uid]?.understood?.includes(topicId) || false;
  };

  const markTopicUnderstood = (topicId) => {
    if (!uid) return;
    setProgress(prev => {
      const current = prev[uid]?.understood || [];
      if (current.includes(topicId)) return prev;
      return {
        ...prev,
        [uid]: {
          ...prev[uid],
          understood: [...current, topicId],
        },
      };
    });
  };

  const unmarkTopicUnderstood = (topicId) => {
    if (!uid) return;
    setProgress(prev => ({
      ...prev,
      [uid]: {
        ...prev[uid],
        understood: (prev[uid]?.understood || []).filter(id => id !== topicId),
      },
    }));
  };

  const getUnderstoodTopics = () => {
    if (!uid) return [];
    return progress[uid]?.understood || [];
  };

  // ── Topic stats (for future progress bar) ─────────────────────────────
  const getTopicStats = (topicPath, totalQuestions) => {
    const scores = getTopicProgress(topicPath);
    const attempted = Object.keys(scores).length;
    const correct   = Object.values(scores).filter(s => s === "correct").length;
    const struggled = Object.values(scores).filter(s => s === "struggled").length;
    return {
      attempted, correct, struggled,
      total: totalQuestions,
      percentAttempted: totalQuestions ? Math.round((attempted / totalQuestions) * 100) : 0,
      percentCorrect:   totalQuestions ? Math.round((correct   / totalQuestions) * 100) : 0,
    };
  };

  return (
    <ProgressContext.Provider value={{
      getScore, setScore, getTopicProgress, getTopicStats,
      isTopicUnderstood, markTopicUnderstood, unmarkTopicUnderstood, getUnderstoodTopics,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useProgress() {
  return useContext(ProgressContext);
}