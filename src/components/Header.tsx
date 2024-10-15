"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";
import ModeToggle from "./ModeToggle";
type Props = {};

const Header = (props: Props) => {
  const session = useSession();
  return (
    <div className="sticky top-0 z-50 md:flex justify-center">
      <div className="flex justify-between px-4 border-b-2 shadow-md xl:px-8 md:container">
        <div className="flex items-center w-full p-4">
          <h1 className="text-2xl font-bold">AI Form Builder</h1>
        </div>
        <div className="flex items-center">
          {session.data?.user ? (
            <>
              <Image
              
                src={session.data.user.image}
                alt="User Pic"
                width={32}
                height={32}
                className=" rounded-full mr-2 "
              />
              <Button variant="link" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="link"   onClick={async () =>  await signIn()}>
              Sign In
            </Button>
          )}
        </div>
        <div className="flex items-center ml-6">
            <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;