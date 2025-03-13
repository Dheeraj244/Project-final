import React from "react";
import Navbar from "@/components/Navbar";
const Home = () => {
  return (
    <>
      <Navbar />
      <section className="w-full h-screen bg-gradient-to-b from-slate-50 via-blue-100 to-blue-200 flex-center flex-col">
        <h1 className=" mt-5 text-5xl font-extrabold leading-[1.15] text-black sm:text-6xl text-center">
          Trade Energy
          <br />
          <span className="bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 bg-clip-text text-transparent text-center ">
            Block-chain powered Trading
          </span>
        </h1>
        <p className="text-center mt-5 text-lg text-gray-600 sm:text-xl max-w-l">
          This is a blockchain-based energy trading platform enables
          decentralized peer-to-peer (P2P) energy exchange, allowing individuals
          to trade excess renewable energy directly. Blockchain ensures secure,
          transparent, and tamper-proof transactions without intermediaries,
          reducing costs and inefficiencies.
        </p>
      </section>
    </>
  );
};

export default Home;
