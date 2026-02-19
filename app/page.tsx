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
      <main className="min-h-screen bg-gray-50 flex justify-center py-10">
        <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Smart Bookmarks</h1>
          </div>

          <Auth />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center py-12">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-3">
          <h1 className="text-2xl font-semibold">Smart Bookmarks</h1>

          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-gray-500 hover:text-black"
          >
            Logout
          </button>
        </div>

        <BookmarkForm userId={session.user.id} />
        <BookmarkList bookmarks={bookmarks} loading={loading} />
      </div>
    </main>
  );
}
