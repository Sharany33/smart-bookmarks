"use client";

import { supabase } from "../lib/supabaseClient";

export default function Auth() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };
  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow inline-block">
      <button
        onClick={login}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Login with Google
      </button>
    </div>
  );
}
