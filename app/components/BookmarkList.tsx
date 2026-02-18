"use client";

import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function BookmarkList({
  bookmarks,
  loading,
}: {
  bookmarks: Bookmark[];
  loading: boolean;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteBookmark = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bookmark?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
    }

    setDeletingId(null);
  };

  if (loading) {
    return <p>Loading bookmarks...</p>;
  }

  if (bookmarks.length === 0) {
    return <p>No bookmarks yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="border p-2 flex justify-between items-center"
        >
          <a
            href={b.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium"
          >
            {b.title}
          </a>

          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-sm text-red-600 underline"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
