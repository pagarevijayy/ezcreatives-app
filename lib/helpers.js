import * as htmlToImage from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getRandomInteger } from "./utils";

import { toast } from "react-toastify";

/** Determine a template belongs to which category based on the template id */
export const determineTemplateCategory = (templateName) => {
  if (templateName.toLowerCase().includes("square")) {
    return "square";
  }

  if (templateName.toLowerCase().includes("horizontal")) {
    return "horizontal";
  }

  if (templateName.toLowerCase().includes("vertical")) {
    return "vertical";
  }
};

/** Convert html element to an image and download that image file */
export const downloadSingleFile = async (element, filename) => {
  toast("🚀 Downloading! Please wait...", {
    position: "bottom-right",
    autoClose: 7000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  console.log("downloading...");

  const startMeasuring = performance.now();

  const dataURL = await htmlToImage.toPng(element, { pixelRatio: 3 });

  const stopMeasuring = performance.now();
  console.log(`Image ready in ${stopMeasuring - startMeasuring} ms`);

  let a = document.createElement("a");
  a.href = dataURL;
  a.download = filename;
  a.click();

  console.log(`Downloaded: ${filename} 🚀 `);
};

/** Convert an array of html elements into an array of image data-urls */
export const convertHtmlRefArrayToImageArray = (htmlReferenceArray) => {
  return Promise.all(
    htmlReferenceArray.map(async (element) => {
      const imgData = await htmlToImage.toPng(element.current, {
        pixelRatio: 3,
      });
      return imgData;
    })
  );
};

/** Zip and download multiple image files - after converting an array of html elements to images  */
export const zipDownloadImages = async (htmlReferenceArray) => {
  const zip = new JSZip();
  toast("🚀 Downloading in background! Please wait...", {
    position: "bottom-right",
    autoClose: 25000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  console.log("downloading...");
  const startMeasuring = performance.now();

  const imageArray = await convertHtmlRefArrayToImageArray(htmlReferenceArray);

  const stopMeasuring = performance.now();

  console.log(`Images ready in ${stopMeasuring - startMeasuring} ms`);

  imageArray.forEach((imgData, i) => {
    const extractedDataURL = imgData.split("base64,")[1];
    zip.file(`ezcreatives${getRandomInteger()}_${i}.png`, extractedDataURL, {
      base64: true,
    });
  });

  const zippedFile = await zip.generateAsync({ type: "blob" });
  saveAs(zippedFile, `ezcreatives${getRandomInteger()}_.zip`);

  console.log("The zip file downloaded! 🚀");
};
