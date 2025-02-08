import Image from "next/image";
import GPTComponent from "./components/GPTComponents";
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>My App</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <div>
        <GPTComponent />
      </div>
    </>
  );
}