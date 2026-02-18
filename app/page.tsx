"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./components/Auth";
import BookmarkForm from "./components/BookmarkForm";
import BookmarkList from "./components/BookmarkList";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // 🔑 SINGLE SOURCE OF AUTH TRUTH
  useEffect(() => {
    // Initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // Clear bookmarks immediately on logout
      if (!session) {
        setBookmarks([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch bookmarks only when logged in
  useEffect(() => {
    if (!session) return;

    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setBookmarks(data || []);
    };

    fetchBookmarks();
  }, [session]);

  if (!session) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Smart Bookmarks</h1>
        <Auth />
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Smart Bookmarks</h1>

      {/* LOGOUT — NOW INSTANT */}
      <button
        onClick={() => supabase.auth.signOut()}
        className="text-sm underline"
      >
        Logout
      </button>

      <BookmarkForm
        userId={session.user.id}
        onAdd={(b) => setBookmarks((prev) => [b, ...prev])}
      />

      <BookmarkList bookmarks={bookmarks} />
    </main>
  );
}