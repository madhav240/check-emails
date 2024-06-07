"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Header = () => {
  const { data: session } = useSession();
  function onSignOut() {
    if (confirm(`Click 'OK' to Logout`)) {
      localStorage.removeItem("openai_key");
      signOut({ callbackUrl: "/", redirect: true });
    }
  }
  if (session) {
    return (
      <div className="fixed w-full px-1 py-2 bg-white top-0">
        <div className="max-w-7xl mx-auto flex flex-row ">
          <div className="w-full flex flex-row gap-x-2">
            <div>
              <Image
                src={session.user?.image}
                alt=""
                width={48}
                height={48}
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <p className="font-semibold">{session.user?.name}</p>
              <p className="text-sm">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="px-2 py-1 mt-1 h-fit bg-red-600 text-white text-sm font-semibold rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
};

export default Header;
