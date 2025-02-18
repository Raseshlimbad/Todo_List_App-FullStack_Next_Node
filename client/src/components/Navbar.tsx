"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/queries";
import { SIGNOUT_USER } from "@/graphql/mutations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; 
import { usePathname } from "next/navigation"; 
export default function NavBar() {

  // Query for current user
  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "network-only", 
  });

  // Sign out mutation
  const [signout] = useMutation(SIGNOUT_USER);

  const router = useRouter();
  const pathname = usePathname();
  
  // Fetch data until user not found
  useEffect(() => {
    if (data?.getUser) {
      // console.log("Pathname", pathname)
      refetch(); 
    }
  }, [pathname, data?.getUser, refetch]); 

  const handleSignout = async () => {
    try {
      await signout(); 
      await refetch(); 
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

//  Loading state to display username
  if (loading) {
    return (
      <nav className="bg-gray-700 text-white px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          MyTodoApp
        </Link>
        <div className="text-white">Loading...</div>
      </nav>
    );
  }

  // Error state to display Username
  if (error) {
    return (
      <nav className="bg-gray-700 text-white px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          MyTodoApp
        </Link>
        <div className="text-white">Error fetching user</div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-700 text-white px-6 py-3 flex justify-between items-center">
      {/* App Name */}
      <Link href="/" className="text-xl font-bold">
        MyTodoApp
      </Link>

      {/* User Info & Login/Logout */}
      <div className="flex items-center gap-4">
        {data?.getUser ? (
          <>
            {/* Display Username */}
            <span className="font-medium">Hello, {data.getUser.username}!</span>

            {/* Sign out button */}
            <button
              onClick={handleSignout}
              className="bg-white px-3 py-1 rounded text-black font-semibold"
            >
              Signout
            </button>
          </>
        ) : (
          // Login Button and link to Login Page
          <Link
            href="/login"
          >
            <button className="bg-white px-3 py-1 rounded text-black font-semibold">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
