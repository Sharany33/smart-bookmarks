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
    <div className="space-y-2">
      <input
        className="border p-2 w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={addBookmark}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Bookmark"}
      </button>
    </div>
  );
}
