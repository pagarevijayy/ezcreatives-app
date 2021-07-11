import { useState, useEffect } from "react";
import Head from "next/head";

import SingleImageMode from "../../components/single-img-mode";
import MultiImageMode from "../../components/multi-img-mode";

const ImageBuilder = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  const [isMultipleImageMode, setIsMultipleImageMode] = useState(false);

  /** Make sure the app is running on the browser and not server (for lazy import implementation) */
  useEffect(() => {
    process.nextTick(() => {
      if (globalThis.window ?? false) {
        setIsBrowser(true);
      }
    });
  }, []);

  if (!isBrowser) return null;

  return (
    <>
      <Head>
        <title> ezCreatives - Image Builder </title>
      </Head>
      <div className="min-h-screen font-sans text-gray-800 bg-gray-50 ">
        <div className="header text-center px-12 py-5 shadow-sm">
          <div className="max-w-screen-2xl mx-auto">
            <p className="font-poppins font-bold text-2xl tracking-wide select-none cursor-pointer transform transition hover:-translate-y-0.5">
              ez <span className="text-cyan-500 uppercase">Creatives</span>
            </p>
          </div>
        </div>
        <div className="py-4 px-4 text-center max-w-screen-xl mx-auto">
          <div className="mt-4 select-none text-xs text-gray-900">
            <button
              className={`${
                !isMultipleImageMode
                  ? "bg-cyan-500 text-white font-semibold hover:bg-cyan-400 hover:border-cyan-400 active:bg-cyan-600"
                  : "hover:text-gray-700 hover:border-cyan-400"
              } py-2 px-4 inline-block rounded-l-lg border border-r-0 border-cyan-500 outline-none focus:outline-none`}
              onClick={() => {
                setIsMultipleImageMode(false);
              }}
            >
              single image
            </button>
            <button
              className={`${
                isMultipleImageMode
                  ? "bg-cyan-500 text-white font-semibold hover:bg-cyan-400 hover:border-cyan-400 active:bg-cyan-600"
                  : "hover:text-gray-700 hover:border-cyan-400"
              } py-2 px-4 inline-block rounded-r-lg border border-l-0 border-cyan-500 outline-none focus:outline-none`}
              onClick={() => {
                setIsMultipleImageMode(true);
              }}
            >
              multiple image
            </button>
          </div>
          {!isMultipleImageMode && <SingleImageMode />}
          {isMultipleImageMode && <MultiImageMode />}
        </div>
      </div>
    </>
  );
};

export default ImageBuilder;
