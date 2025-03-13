import Link from "next/link";

export default function Navbar() {
  return (
    <nav className=" p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-black text-xl font-bold">
          <Link href="/">
            <p>MyLogo</p>
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <p className="border-2 border-black text-black  px-4 py-2 rounded font-bold hover:bg-black hover:text-white transistion">
              Log in
            </p>
          </Link>
          <Link href="/signup">
            <p className="border-2 border-black bg-black text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black font-bold">
              Sign Up
            </p>
          </Link>
        </div>
      </div>
    </nav>
  );
}
