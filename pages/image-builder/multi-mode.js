import { useState, useEffect } from "react";
import PrimaryLayout from "../../layouts/primary-layout";
import MultiImageMode from "../../components/multi-img-mode";

const ImageBuilderMultiMode = () => {
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
      <PrimaryLayout setMultipleImageMode={true}>
        <MultiImageMode />
      </PrimaryLayout>
    </>
  );
};

export default ImageBuilderMultiMode;
