"use client";

import { supabase } from "../lib/supabaseClient";

export default function Auth() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000",
      },
    });
  };

  return (
    <button
      onClick={login}
      className="px-4 py-2 bg-black text-white rounded"
    >
      Login with Google
    </button>
  );
}
