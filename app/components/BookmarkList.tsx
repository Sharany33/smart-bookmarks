"use client";

import { supabase } from "../lib/supabaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function BookmarkList({
  bookmarks,
}: {
  bookmarks: Bookmark[];
}) {
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

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
