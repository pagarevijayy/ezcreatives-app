import { useState, useEffect } from "react";
import PrimaryLayout from "../../layouts/primary-layout";
import SingleImageMode from "../../components/single-img-mode";

const ImageBuilderSingleMode = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  /** Make sure the app is running on the browser and not the next.js server
   * (for lazy import implementation) */
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
      <PrimaryLayout setMultipleImageMode={false}>
        <SingleImageMode />
      </PrimaryLayout>
    </>
  );
};

export default ImageBuilderSingleMode;
