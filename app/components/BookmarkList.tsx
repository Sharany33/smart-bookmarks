"use client";

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
  if (bookmarks.length === 0) {
    return <p>No bookmarks yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {bookmarks.map((b) => (
        <li key={b.id} className="border p-2">
          <a href={b.url} target="_blank" className="font-medium">
            {b.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
