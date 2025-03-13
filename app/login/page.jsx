"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/profile");
    } catch (error) {
      console.log("Login failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {loading ? "Processing..." : "Login"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
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
              Password
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
            {loading ? "Processing..." : "Login"}
          </button>
          <Link href="/signup" className="block text-center mt-4 text-gray-600">
            Visit Signup page
          </Link>
        </form>
      </div>
    </div>
  );
}
