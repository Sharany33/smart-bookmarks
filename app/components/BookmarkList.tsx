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
    return <p className="text-sm text-gray-500">Loading bookmarks...</p>;
  }

  if (bookmarks.length === 0) {
    return <p className="text-sm text-gray-500">No bookmarks yet. Add one above.</p>;
  }

  return (
    <ul className="space-y-2">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="flex justify-between items-center border rounded-md px-3 py-2 hover:bg-gray-50"
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
            className="text-sm text-red-500 hover:text-red-700"
          >
            {deletingId === b.id ? "Deleting..." : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
}
