import { useState } from "react";
import Link from "next/link";

import Header from "../components/header";

const PrimaryLayout = ({ setMultipleImageMode, children }) => {
  const [isMultipleImageMode, setIsMultipleImageMode] =
    useState(setMultipleImageMode);

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50 ">
      <Header />
      <div className="py-4 px-4 text-center max-w-screen-xl mx-auto">
        <div className="mt-4 select-none text-xs text-gray-900">
          <Link href="/image-builder/single-mode">
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
          </Link>
          <Link href="/image-builder/multi-mode">
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
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PrimaryLayout;
