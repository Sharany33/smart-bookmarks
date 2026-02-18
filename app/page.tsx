"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./components/Auth";
import BookmarkForm from "./components/BookmarkForm";
import BookmarkList from "./components/BookmarkList";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  /* ---------------- AUTH STATE ---------------- */

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (!session) {
        setBookmarks([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ---------------- INITIAL FETCH ---------------- */

  useEffect(() => {
    if (!session) return;

    const fetchBookmarks = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      }

      setBookmarks(data || []);
      setLoading(false);
    };

    fetchBookmarks();
  }, [session]);

  /* ---------------- REALTIME SUBSCRIPTION ---------------- */

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new, ...prev]);
          }

          if (payload.eventType === "DELETE") {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  /* ---------------- UI ---------------- */

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

      <button
        onClick={() => supabase.auth.signOut()}
        className="text-sm underline"
      >
        Logout
      </button>

      <BookmarkForm userId={session.user.id} />
      <BookmarkList bookmarks={bookmarks} loading={loading} />
    </main>
  );
}
