"use client";

import Image from "next/image";
import GPTComponent from "./components/GPTComponents";
import Head from 'next/head';
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();

  const navigateToUpload = () => {
    router.push('/upload-img');
  };
  return (
    <>
      <Head>
        <title>Recipe Makr</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-4 text-[var(--soft-orange)]">
          Welcome to <span className="text-[var(--vibrant-orange)]">Recipe Makr!</span>
        </h1>
        <p className="italic text-2xl mb-6 text-[var(--peach)]"> 
          From Picture to Plate
        </p>
        <button
          className="px-6 py-3 rounded-full text-lg font-medium transition-all"
          style={{
            backgroundColor: 'var(--vibrant-orange)',
            color: 'white',
            fontWeight: 'bold',
          }}
          onClick={navigateToUpload}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--soft-orange)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--vibrant-orange)')}
        >
          Get Started
        </button>
      </div>
    </div>
    </>
  );
}
