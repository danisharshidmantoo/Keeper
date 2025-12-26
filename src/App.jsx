import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";

const STORAGE_KEY = "ai-notes-app-v1";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");

  // theme: "dark" or "light"
  const [theme, setTheme] = useState("dark");

  // categories
  const [categories, setCategories] = useState(["All Notes"]);
  const [activeCategory, setActiveCategory] = useState("All Notes");

  // saving
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  // ----- LOAD FROM LOCALSTORAGE ONCE -----
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      if (Array.isArray(data.notes)) setNotes(data.notes);
      if (data.selectedId) setSelectedId(data.selectedId);
      if (data.theme === "light" || data.theme === "dark") setTheme(data.theme);
      if (Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
      }
      if (data.activeCategory) setActiveCategory(data.activeCategory);
      if (data.lastSavedAt) setLastSavedAt(data.lastSavedAt);
      setIsDirty(false);
    } catch (e) {
      console.error("Failed to load saved data:", e);
    }
  }, []);

  // ----- MARK DIRTY WHENEVER SOMETHING IMPORTANT CHANGES -----
  useEffect(() => {
    // don't auto-dirty on very first mount load, but that's ok – user can hit save
    setIsDirty(true);
  }, [notes, theme, categories, activeCategory, selectedId]);

  // ----- THEME FUNCTIONS -----
  const setDayMode = () => setTheme("light");
  const setNightMode = () => setTheme("dark");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // ----- SAVE TO LOCALSTORAGE -----
  const saveAll = () => {
    try {
      const savedAt = new Date().toISOString();
      const payload = {
        notes,
        selectedId,
        theme,
        categories,
        activeCategory,
        lastSavedAt: savedAt,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setLastSavedAt(savedAt);
      setIsDirty(false);
    } catch (e) {
      console.error("Failed to save:", e);
      alert("Could not save. Check console for details.");
    }
  };

  // ----- NOTES CRUD -----
  const createNote = () => {
    const now = new Date();
    const newNote = {
      id: Date.now(),
      title: "Untitled Note",
      content: "",
      createdAt: now.toISOString(),
      category: activeCategory === "All Notes" ? null : activeCategory,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const updateNote = (id, field, value) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, [field]: value } : note))
    );
  };

  // ----- CATEGORIES -----
  const addCategory = () => {
    const name = prompt("Enter category name:");
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      alert("Category already exists.");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
  };

  // ----- FILTERING -----
  const filteredNotes = useMemo(() => {
    let list = notes;

    if (activeCategory !== "All Notes") {
      list = list.filter((n) => n.category === activeCategory);
    }

    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, search, activeCategory]);

  const selectedNote = notes.find((n) => n.id === selectedId) || null;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  // theme-based top-level classes
  const rootThemeClasses =
    theme === "dark"
      ? "bg-slate-950 text-slate-100"
      : "bg-slate-100 text-slate-900";

  const panelBg =
    theme === "dark" ? "bg-slate-900" : "bg-white border-slate-200";

  const listCardBg =
    theme === "dark"
      ? "bg-slate-900 hover:bg-slate-800"
      : "bg-white hover:bg-slate-100";

  const borderColor =
    theme === "dark" ? "border-slate-800" : "border-slate-200";

  return (
    <div className={`h-screen w-screen ${rootThemeClasses} flex overflow-hidden`}>
      {/* LEFT SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col w-64 border-r ${borderColor} px-6 py-5`}
      >
        {/* Top brand + theme + save */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold tracking-tight">SmartNotes</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={saveAll}
              className="px-2 py-1 text-[11px] rounded-md border border-slate-700 hover:bg-slate-800/80 active:scale-95 transition-transform"
            >
              Save
            </button>
            <button
              className="h-8 w-8 rounded-full border text-xs flex items-center justify-center hover:scale-105 transition-transform"
              onClick={toggleTheme}
              title="Toggle light / dark"
            >
              {theme === "dark" ? "☀" : "🌙"}
            </button>
          </div>
        </div>

        {/* Save status */}
        <div className="mb-6 text-[11px] text-slate-500 space-y-1">
          <div>
            Status:{" "}
            <span
              className={
                isDirty ? "text-yellow-400 font-medium" : "text-emerald-400"
              }
            >
              {isDirty ? "Unsaved changes" : "Saved"}
            </span>
          </div>
          {lastSavedAt && (
            <div>Last saved at {formatTime(lastSavedAt)}</div>
          )}
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-[0.08em] mb-2">
            <span>Categories</span>
            <button
              className="rounded-full border px-1 text-[11px] leading-none"
              onClick={addCategory}
            >
              +
            </button>
          </div>

          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeCategory === cat
                    ? theme === "dark"
                      ? "bg-slate-800 text-slate-50"
                      : "bg-slate-200 text-slate-900"
                    : "text-slate-400 hover:bg-slate-800/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
      </aside>

      {/* MAIN AREA (MIDDLE LIST + RIGHT EDITOR) */}
      <main className="flex-1 flex">
        {/* MIDDLE COLUMN: search, button, list of notes */}
        <section
          className={`w-full md:w-[420px] border-r ${borderColor} px-6 py-5 flex flex-col`}
        >
          {/* Search bar */}
          <div className="mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-full rounded-lg bg-slate-900/70 border border-slate-800 pl-9 pr-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* New Note button */}
          <button
            type="button"
            onClick={createNote}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-sm font-semibold py-2 mb-4 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </button>

          {/* Notes list */}
          <div className="space-y-3 overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-slate-500 mt-4">
                No notes yet in{" "}
                <span className="font-semibold">{activeCategory}</span>. Click{" "}
                <span className="font-semibold">New Note</span> to create one.
              </p>
            ) : (
              filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedId(note.id)}
                  className={`relative w-full text-left rounded-2xl px-4 py-3 ${listCardBg} transition-colors border ${
                    note.id === selectedId ? "border-blue-500/80" : borderColor
                  }`}
                >
                  <div
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                  >
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-500/90 hover:bg-red-600 active:scale-95 transition-transform">
                      <X size={14} absoluteStrokeWidth />
                    </span>
                  </div>
                  <div className="mb-1 text-[11px] text-slate-400">
                    {formatDate(note.createdAt)}
                  </div>
                  <div className="text-sm font-semibold truncate mb-1">
                    {note.title || "Untitled Note"}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-2">
                    {note.content || "No content"}
                  </div>
                  {note.category && (
                    <div className="mt-1 text-[10px] text-slate-500">
                      {note.category}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </section>

        {/* RIGHT PANEL: editor / empty state */}
        <section className="hidden md:flex flex-1 items-center justify-center px-10">
          {!selectedNote ? (
            <div className="text-center text-slate-400">
              <p className="text-lg font-semibold mb-1">
                Select a note to start editing
              </p>
              <p className="text-sm">or create a new one</p>
            </div>
          ) : (
            <div
              className={`w-full max-w-2xl h-[80vh] flex flex-col ${panelBg} border ${borderColor} rounded-2xl px-6 py-5`}
            >
              <div className="flex items-center gap-4 mb-3">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) =>
                    updateNote(selectedNote.id, "title", e.target.value)
                  }
                  className="flex-1 bg-transparent border-b border-slate-700 pb-2 text-xl font-semibold focus:outline-none focus:border-blue-500"
                  placeholder="Note title"
                />
                {/* Category selector */}
                <select
                  value={selectedNote.category || "All Notes"}
                  onChange={(e) =>
                    updateNote(
                      selectedNote.id,
                      "category",
                      e.target.value === "All Notes" ? null : e.target.value
                    )
                  }
                  className="text-xs border border-slate-700 rounded-md bg-slate-900/60 px-2 py-1 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-2 flex-1">
                <textarea
                  value={selectedNote.content}
                  onChange={(e) =>
                    updateNote(selectedNote.id, "content", e.target.value)
                  }
                  placeholder="Start typing your note..."
                  className="w-full h-full resize-none bg-transparent text-sm leading-relaxed focus:outline-none"
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
