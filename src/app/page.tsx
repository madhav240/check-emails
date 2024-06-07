"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const openAIKey = localStorage.getItem("openai_key") || null;

  function saveOpenAIKey(formData: FormData) {
    const key = formData.get("key");
    localStorage.setItem("openai_key", key);
    redirect("/emails");
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {session ? (
        <>
          {openAIKey ? (
            <>
              <Link
                href={"/emails"}
                className="px-8 py-2 bg-black text-white font-semibold rounded-lg"
              >
                Open Emails
              </Link>
            </>
          ) : (
            <div className="min-h-screen flex flex-row justify-center items-center">
              <form
                action={saveOpenAIKey}
                className="flex flex-col items-center gap-y-2"
              >
                <input
                  type="text"
                  name="key"
                  placeholder="Enter OpenAI API Key"
                  className="text-center outline-none border w-72 h-12 rounded-lg"
                  required
                  minLength={56}
                  maxLength={56}
                />
                <button
                  type="submit"
                  className="px-8 py-2 bg-black text-white font-semibold rounded-lg text-sm"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="px-8 py-2 bg-black text-white font-semibold rounded-lg"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}
