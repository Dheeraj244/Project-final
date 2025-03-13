"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Ensure this matches your router setup
import Link from "next/link";

const SignUpPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/api/users/signup", user);
      toast.success("Signup success");
      await router.push("/login"); // Ensure this is awaited
    } catch (error) {
      console.log("Something went wrong");
      toast.error(error.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email && user.password && user.username) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {loading ? "Processing..." : "Sign Up"}
        </h2>
        <form onSubmit={onSignup}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-600 font-medium mb-2"
            >
              User Name
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-zinc-500 focus:outline-none"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder="User Name"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-zinc-500 focus:outline-none"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium mb-2"
            >
              Set Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-zinc-500 focus:outline-none"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className={`w-full border-2 ${
              buttonDisabled || loading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-black text-white hover:bg-white hover:text-black"
            } py-2 rounded-lg transition`}
          >
            {buttonDisabled
              ? "Please fill all fields"
              : loading
              ? "Processing..."
              : "Sign Up"}
          </button>
          <Link href="/login" className="block text-center mt-4 text-gray-600">
            Already a user? Log in
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
