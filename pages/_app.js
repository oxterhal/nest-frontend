import Navbar from "@/components/header";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <div className="w-screen h-12"></div>
      <Component {...pageProps} />
    </>
  );
}
