import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

const STORAGE_KEY = "gcse_maths_users";

// ── Helpers ───────────────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { users: [], activeUserId: null };
  } catch {
    return { users: [], activeUserId: null };
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ── Provider ──────────────────────────────────────────────────────────────
export function UserProvider({ children }) {
  const [store, setStore] = useState(() => loadFromStorage());
  const [showPicker, setShowPicker] = useState(false);

  const activeUser = store.users.find(u => u.id === store.activeUserId) || null;

  // Persist to localStorage whenever store changes
  useEffect(() => {
    saveToStorage(store);
  }, [store]);

  // Show picker on first load if no active user
  useEffect(() => {
    if (!store.activeUserId) setShowPicker(true);
  }, []);

  const addUser = (displayName) => {
    const name = displayName.trim();
    if (!name) return;

    // Count how many existing users share this base name (case-insensitive)
    // Strip any trailing number from existing names before comparing
    const sameNameCount = store.users.filter(
      u => u.displayName.replace(/ \d+$/, "").toLowerCase() === name.toLowerCase()
    ).length;

    // If someone with this name already exists, append a number
    const uniqueDisplayName = sameNameCount > 0 ? `${name} ${sameNameCount + 1}` : name;

    const id = `${name.toLowerCase().replace(/\s+/g, "_")}_${generateId()}`;
    const newUser = { id, displayName: uniqueDisplayName };
    setStore(prev => {
      const next = { users: [...prev.users, newUser], activeUserId: id };
      return next;
    });
    setShowPicker(false);
  };

  const switchUser = (userId) => {
    setStore(prev => ({ ...prev, activeUserId: userId }));
    setShowPicker(false);
  };

  const removeUser = (userId) => {
    setStore(prev => {
      const users = prev.users.filter(u => u.id !== userId);
      const activeUserId = prev.activeUserId === userId
        ? (users[0]?.id || null)
        : prev.activeUserId;
      return { users, activeUserId };
    });
  };

  return (
    <UserContext.Provider value={{ activeUser, users: store.users, addUser, switchUser, removeUser, showPicker, setShowPicker }}>
      {children}
      {showPicker && <ProfilePicker />}
    </UserContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useUser() {
  return useContext(UserContext);
}

// ── Profile picker UI ─────────────────────────────────────────────────────
function ProfilePicker() {
  const { users, activeUser, addUser, switchUser, setShowPicker } = useUser();
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(users.length === 0);

  const handleAdd = () => {
    if (newName.trim()) {
      addUser(newName.trim());
      setNewName("");
      setAdding(false);
    }
  };

  const canDismiss = !!activeUser;

  return (
    <div
      onClick={canDismiss ? () => setShowPicker(false) : undefined}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "28px 24px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>📚</div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a2e", margin: "0 0 4px" }}>
            Who's revising today?
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            Your progress is saved separately for each person
          </p>
        </div>

        {/* Existing users */}
        {users.length > 0 && !adding && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: `2px solid ${u.id === activeUser?.id ? "#059669" : "#e5e7eb"}`,
                    background: u.id === activeUser?.id ? "#ecfdf5" : "#f9fafb",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "#059669", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", fontWeight: "800", flexShrink: 0,
                    }}>
                      {u.displayName[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>
                      {u.displayName}
                    </span>
                  </div>
                  {u.id === activeUser?.id && (
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#059669" }}>✓ Active</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setAdding(true)}
              style={{
                width: "100%", padding: "11px",
                borderRadius: "10px",
                border: "2px dashed #d1d5db",
                background: "transparent",
                cursor: "pointer",
                fontSize: "13px", fontWeight: "600", color: "#6b7280",
              }}
            >
              + Add new person
            </button>
          </div>
        )}

        {/* Add new user form */}
        {adding && (
          <div style={{ marginBottom: "16px" }}>
            {users.length > 0 && (
              <button
                onClick={() => setAdding(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: "13px", marginBottom: "12px", padding: 0 }}
              >
                ← Back
              </button>
            )}
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>
              Enter your first name:
            </p>
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              placeholder="e.g. Scarlett"
              style={{
                width: "100%", padding: "12px 14px",
                borderRadius: "10px",
                border: "2px solid #e5e7eb",
                fontSize: "15px", color: "#1a1a2e",
                outline: "none", boxSizing: "border-box",
                marginBottom: "10px",
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              style={{
                width: "100%", padding: "13px",
                borderRadius: "10px", border: "none",
                background: newName.trim() ? "#059669" : "#d1d5db",
                color: "#fff", fontSize: "14px", fontWeight: "700",
                cursor: newName.trim() ? "pointer" : "default",
                transition: "background 0.15s",
              }}
            >
              Start revising →
            </button>
          </div>
        )}

        {/* Dismiss if active user exists */}
        {canDismiss && !adding && (
          <button
            onClick={() => setShowPicker(false)}
            style={{
              width: "100%", padding: "11px",
              borderRadius: "10px",
              border: "1.5px solid #e5e7eb",
              background: "transparent",
              cursor: "pointer",
              fontSize: "13px", fontWeight: "600", color: "#6b7280",
            }}
          >
            Continue as {activeUser.displayName}
          </button>
        )}
      </div>
    </div>
  );
}