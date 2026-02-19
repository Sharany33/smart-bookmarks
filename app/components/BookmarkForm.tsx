"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function BookmarkForm({
  userId,

}: {
  userId: string;

}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);


  const addBookmark = async () => {
    if (!title || !url || loading) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: userId,
      })
      .select()
      .single();

    setLoading(false);

    if (!error && data) {
      setTitle("");
      setUrl("");
    }
  };

  return (
    <form className="space-y-3 bg-gray-50 p-4 rounded-lg border">
      <input
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Bookmark title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        type="button"
        onClick={addBookmark}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Bookmark"}
      </button>
    </form>
  );
}
