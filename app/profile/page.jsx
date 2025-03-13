"use client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Energy Trading Platform
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/marketplace')}
            className="w-full border-2 border-black text-black px-6 py-3 rounded-lg font-bold hover:bg-black hover:text-white transition-colors"
          >
            Buy Energy
          </button>
          
          <button
            onClick={() => router.push('/sell')}
            className="w-full border-2 border-black bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-black transition-colors"
          >
            Sell Energy
          </button>
        </div>
      </div>
    </div>
  );
}
