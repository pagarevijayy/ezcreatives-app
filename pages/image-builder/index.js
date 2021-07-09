import {
  Fragment,
  lazy,
  Suspense,
  useState,
  useEffect,
  useRef,
  createRef,
} from "react";
import Image from "next/image";

import { useFormik } from "formik";
import * as htmlToImage from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import debounce from "lodash.debounce";

import { Listbox, Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon, CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import {
  designTemplateConfig,
  SampleDefaultData,
  templateOptions,
} from "../../constants/template.config";

const importTemplate = (templateName, templateCategory) =>
  lazy(() => {
    return import(`../../lib/templates/${templateCategory}-designs`).then(
      (module) => ({
        default: module[templateName],
      })
    );
  });

const RenderCurrentTemplate = ({ currentTemplate, templateConfig }) => {
  return Object.values(currentTemplate).map((Template, index) => (
    <Template key={`${index}`} templateData={templateConfig} />
  ));
};

const determineTemplateCategory = (templateName) => {
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

const removeEmptyKeys = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => !!v));
};

const downloadFiles = async (element, filename) => {
  console.log("awaiting...");
  const startMeasuring = performance.now();

  const dataURL = await htmlToImage.toPng(element, { pixelRatio: 3 });

  const stopMeasuring = performance.now();
  console.log("image ready after:", stopMeasuring - startMeasuring, "ms");

  let a = document.createElement("a");
  a.href = dataURL;
  a.download = filename;
  a.click();
  console.log("downloaded - ", filename);
};

const convertHtmlRefArrayToImageArray = (htmlReferenceArray) => {
  return Promise.all(
    htmlReferenceArray.map(async (element) => {
      const imgData = await htmlToImage.toPng(element.current, {
        pixelRatio: 3,
      });
      return imgData;
    })
  );
};

const getRandomInteger = () => {
  // Returns a random integer from 0 to 100:
  return Math.floor(Math.random() * 101);
};

const zipDownloadImages = async (htmlReferenceArray) => {
  const zip = new JSZip();
  console.log("awaiting...");
  const startMeasuring = performance.now();

  const imageArray = await convertHtmlRefArrayToImageArray(htmlReferenceArray);

  const stopMeasuring = performance.now();

  console.log("images ready after: ", stopMeasuring - startMeasuring, "ms");

  imageArray.forEach((imgData, i) => {
    const extractedDataURL = imgData.split("base64,")[1];
    zip.file(`ezcreatives${getRandomInteger()}_${i}.png`, extractedDataURL, {
      base64: true,
    });
  });

  const zippedFile = await zip.generateAsync({ type: "blob" });
  saveAs(zippedFile, `ezcreatives${getRandomInteger()}_.zip`);

  console.log("zip file downloaded!");
};

const ImageBuilder = () => {
  const [selectedListItem, setSelectedListItem] = useState(templateOptions[0]);

  const debouncedTemplateID = useRef(
    debounce((id) => {
      SetRequestedTemplate(id);
    }, 500)
  ).current;
  const debouncedGoogleSheetID = useRef(
    debounce((id) => {
      setGoogleSheetId(id);
    }, 500)
  ).current;
  const [isBrowser, setIsBrowser] = useState(false);
  const [currentTemplate, SetCurrentTemplate] = useState({});
  const [requestedTemplate, SetRequestedTemplate] = useState(
    templateOptions[0].id
  );
  const [templateConfigData, setTemplateConfigData] =
    useState(designTemplateConfig);

  const [multiImageContent, setMultiImageContent] = useState([]);

  const imageReference = useRef(null);
  const multiImageReference = useRef([]);
  multiImageReference.current = multiImageContent.map(
    (e, i) => multiImageReference.current[i] ?? createRef()
  );
  // console.log("null referencing...");

  const [googleSheetId, setGoogleSheetId] = useState("");
  const [isMultipleImageMode, setIsMultipleImageMode] = useState(false);

  const generateImage = (values) => {
    const trimmedValues = removeEmptyKeys(values);
    setTemplateConfigData(trimmedValues);
  };

  const formik = useFormik({
    initialValues: designTemplateConfig,
    onSubmit: generateImage,
  });

  /** Import the required template component with corresponding default values */
  useEffect(() => {
    const templateCategory = determineTemplateCategory(requestedTemplate);
    const ImportedTemplate = importTemplate(
      requestedTemplate,
      templateCategory
    );
    SetCurrentTemplate({ [requestedTemplate]: ImportedTemplate });

    const sampleData = removeEmptyKeys(SampleDefaultData[requestedTemplate]);

    setTemplateConfigData(sampleData);

    formik.setValues({
      ...sampleData,
    });
  }, [requestedTemplate]);

  useEffect(() => {
    process.nextTick(() => {
      if (globalThis.window ?? false) {
        setIsBrowser(true);
      }
    });
  }, []);

  const handleTemplateId = (selectedValue) => {
    debouncedTemplateID(selectedValue.id);
    setSelectedListItem(selectedValue);
  };

  const downloadImage = () => {
    // Returns a random integer from 0 to 100:
    const randomInteger = Math.floor(Math.random() * 101);

    downloadFiles(imageReference.current, `ezcreatives${randomInteger}_`);
  };

  const generateMultipleImage = () => {
    console.log("generate multi images...");
    // console.log("googleSheetId", googleSheetId);
    if (!googleSheetId) return;

    /**@todo: don't call api if data was previously available and sheet id hasn't changed */

    // api call
    fetch(`/api/googlesheet?sheetID=${googleSheetId}`)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.success) {
          const templateConfigArray = response?.data?.templateConfigData;
          const trimmedConfigArray = templateConfigArray.map((object) =>
            removeEmptyKeys(object)
          );
          setMultiImageContent(trimmedConfigArray);
          // console.log("multiImageContent", multiImageContent);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const downloadMultipleImage = () => {
    console.log("download multi images...");

    /** @todo Show pop up if google sheet ain't connected and there are no  htmlref*/
    if (multiImageReference.current.length == 0) return;

    zipDownloadImages(multiImageReference.current);
  };

  const handleGoogleSheetsURL = (e) => {
    const googleSheetURL = e?.target?.value;

    // console.log("googleSheetURL", googleSheetURL);

    debouncedGoogleSheetID(googleSheetURL);
  };

  if (!isBrowser) return null;

  return (
    <>
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
          {!isMultipleImageMode && (
            <div className="text-center my-6 md:divide-x md:grid md:grid-cols-2">
              <div className="">
                <div className="md:max-w-xs lg:max-w-md mx-auto">
                  <h2 className="text-2xl font-bold">Editor</h2>
                  <div className="mt-4">
                    <div className="text-left">
                      <form
                        className="space-y-8"
                        onSubmit={formik.handleSubmit}
                      >
                        <div className="text-center hidden md:block">
                          <button
                            className="w-48 rounded-lg px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                            type="submit"
                          >
                            Generate Image
                          </button>
                        </div>
                        <Listbox
                          value={selectedListItem}
                          onChange={handleTemplateId}
                        >
                          <div className="relative mt-1">
                            <Listbox.Label className="font-medium px-1">
                              Choose a Template
                            </Listbox.Label>
                            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 mt-2 text-left bg-white rounded-lg shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-cyan-300 focus-visible:ring-offset-2 focus-visible:border-cyan-500">
                              <span className="block truncate">
                                {selectedListItem.name}
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <SelectorIcon
                                  className="w-5 h-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {templateOptions.map(
                                  (template, templateIdx) => (
                                    <Listbox.Option
                                      key={templateIdx}
                                      className={({ active }) =>
                                        `${
                                          active
                                            ? "text-cyan-900 bg-cyan-100"
                                            : "text-gray-900"
                                        }
                          cursor-default select-none relative py-2 pl-10 pr-4`
                                      }
                                      value={template}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={`${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            } block truncate`}
                                          >
                                            {template.name}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={`${
                                                active
                                                  ? "text-cyan-600"
                                                  : "text-cyan-600"
                                              }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                                            >
                                              <CheckIcon
                                                className="w-5 h-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  )
                                )}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                        <div className="">
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button
                                  className={`disclosure-btn font-medium text-gray-700 ${
                                    open ? "" : ""
                                  }  `}
                                >
                                  <span> Modify Content </span>
                                  <ChevronUpIcon
                                    className={`${
                                      !open ? "transform rotate-180" : ""
                                    } w-5 h-5 `}
                                  />
                                </Disclosure.Button>
                                <Transition
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform  scale-0 opacity-0"
                                  enterTo="transform origin-top scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform origin-top scale-0 opacity-0"
                                >
                                  <Disclosure.Panel>
                                    <div className="max-w-md mx-auto my-2 p-4 text-sm bg-white shadow-md rounded-md">
                                      <div className="grid grid-cols-1 gap-6">
                                        <label className="block ">
                                          <span className="text-gray-800 hover:text-cyan-800">
                                            Primary Content (quote)
                                          </span>
                                          <textarea
                                            className=""
                                            rows="3"
                                            spellCheck="false"
                                            name="quote"
                                            {...formik.getFieldProps("quote")}
                                          />
                                        </label>

                                        <label className="block">
                                          <span className="text-gray-800">
                                            Secondary Content (sub-quote)
                                          </span>
                                          <input
                                            type="text"
                                            className=""
                                            placeholder=""
                                            name="subQuote"
                                            {...formik.getFieldProps(
                                              "subQuote"
                                            )}
                                          />
                                        </label>

                                        <label className="block">
                                          <span className="text-gray-800">
                                            Primary Image URL
                                          </span>
                                          <input
                                            type="url"
                                            className=""
                                            placeholder=""
                                            name="imageURL"
                                            {...formik.getFieldProps(
                                              "imageURL"
                                            )}
                                          />
                                        </label>

                                        <label className="block">
                                          <span className="text-gray-800">
                                            Brand Handle (if any)
                                          </span>
                                          <input
                                            type="text"
                                            className=""
                                            placeholder=""
                                            name="brandHandle"
                                            {...formik.getFieldProps(
                                              "brandHandle"
                                            )}
                                          />
                                        </label>

                                        <label className="block">
                                          <span className="text-gray-800">
                                            Secondary Image URL (if any)
                                          </span>
                                          <input
                                            type="url"
                                            className=""
                                            placeholder=""
                                            name="imageURL2"
                                            {...formik.getFieldProps(
                                              "imageURL2"
                                            )}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>
                        <div className="">
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button
                                  className={`disclosure-btn font-medium text-gray-700 ${
                                    open ? "" : ""
                                  }  `}
                                >
                                  <span> Modify Template Styles </span>{" "}
                                  <ChevronUpIcon
                                    className={`${
                                      !open ? "transform rotate-180" : ""
                                    } w-5 h-5 `}
                                  />
                                </Disclosure.Button>
                                <Transition
                                  enter="transition duration-100 ease-out"
                                  enterFrom="transform  scale-0 opacity-0"
                                  enterTo="transform origin-top scale-100 opacity-100"
                                  leave="transition duration-75 ease-out"
                                  leaveFrom="transform scale-100 opacity-100"
                                  leaveTo="transform origin-top scale-0 opacity-0"
                                >
                                  <Disclosure.Panel>
                                    <div className="max-w-md mx-auto my-2 p-4 text-sm bg-white shadow-md rounded-md">
                                      <div className="grid grid-cols-1 gap-6">
                                        <label className="block">
                                          <span className="text-gray-800">
                                            Padding - Main Content
                                          </span>
                                          <input
                                            type="text"
                                            className=""
                                            placeholder=""
                                            name="mainContentPadding"
                                            {...formik.getFieldProps(
                                              "mainContentPadding"
                                            )}
                                          />
                                        </label>

                                        <label className="block">
                                          <span className="text-gray-800">
                                            Font Styles - Main Content
                                          </span>
                                          <input
                                            type="text"
                                            className=""
                                            placeholder=""
                                            name="mainContentFontStyles"
                                            {...formik.getFieldProps(
                                              "mainContentFontStyles"
                                            )}
                                          />
                                        </label>

                                        <label className="block">
                                          <span className="text-gray-800">
                                            Font Styles - Secondary Content
                                          </span>

                                          <input
                                            type="text"
                                            className=""
                                            placeholder=""
                                            name="subContentFontStyles"
                                            {...formik.getFieldProps(
                                              "subContentFontStyles"
                                            )}
                                          />
                                        </label>

                                        <label className="block">
                                          <span className="text-gray-800">
                                            Background Color
                                          </span>

                                          <input
                                            type="text"
                                            className=""
                                            placeholder=""
                                            name="bgColorStyles"
                                            {...formik.getFieldProps(
                                              "bgColorStyles"
                                            )}
                                          />
                                        </label>

                                        <label className="block">
                                          <span className="text-gray-800">
                                            Background Opacity (if any)
                                          </span>

                                          <input
                                            type="text"
                                            className=""
                                            placeholder=""
                                            name="bgOpacity"
                                            {...formik.getFieldProps(
                                              "bgOpacity"
                                            )}
                                          />
                                        </label>

                                        <label className="block">
                                          <span className="text-gray-800">
                                            Font Styles - Brand Handle (if any)
                                          </span>

                                          <input
                                            type="text"
                                            className=""
                                            placeholder=""
                                            name="brandingFontStyles"
                                            {...formik.getFieldProps(
                                              "brandingFontStyles"
                                            )}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </div>
                        <div className="text-center md:hidden">
                          <button
                            className="w-48 rounded-lg px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                            type="submit"
                          >
                            Generate Image
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 md:mt-0">
                <h2 className="text-2xl font-bold">Preview</h2>
                <div className="mt-4 space-y-8">
                  <div className="text-center hidden md:block">
                    <button
                      className="rounded-lg w-48 px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                      onClick={downloadImage}
                    >
                      Download Image
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-6">
                    <Suspense fallback={<div>Loading...</div>}>
                      <div
                        className={`${
                          requestedTemplate.toLowerCase().includes("horizontal")
                            ? "zoom-50"
                            : "zoom-80"
                        } shadow`}
                      >
                        <div ref={imageReference}>
                          <RenderCurrentTemplate
                            currentTemplate={currentTemplate}
                            templateConfig={templateConfigData}
                          />
                        </div>
                      </div>
                    </Suspense>
                  </div>
                  <div className="text-center md:hidden">
                    <button
                      className="rounded-lg w-48 px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                      onClick={downloadImage}
                    >
                      Download Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isMultipleImageMode && (
            <div className="text-center my-6 md:divide-x md:grid md:grid-cols-2">
              <div className="">
                <div className="md:max-w-xs lg:max-w-md mx-auto">
                  <h2 className="text-2xl font-bold">Editor</h2>
                  <div className="mt-4 text-left space-y-8">
                    <div className="text-center hidden md:block">
                      <button
                        className="w-48 rounded-lg px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                        onClick={generateMultipleImage}
                      >
                        Generate Image
                      </button>
                    </div>
                    <Listbox
                      value={selectedListItem}
                      onChange={handleTemplateId}
                    >
                      <div className="relative mt-1">
                        <Listbox.Label className="px-1">
                          Choose a Template
                        </Listbox.Label>
                        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 mt-2 text-left bg-white rounded-lg shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-cyan-300 focus-visible:ring-offset-2 focus-visible:border-cyan-500 sm:text-sm">
                          <span className="block truncate">
                            {selectedListItem.name}
                          </span>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <SelectorIcon
                              className="w-5 h-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {templateOptions.map((template, templateIdx) => (
                              <Listbox.Option
                                key={templateIdx}
                                className={({ active }) =>
                                  `${
                                    active
                                      ? "text-cyan-900 bg-cyan-100"
                                      : "text-gray-900"
                                  }
                          cursor-default select-none relative py-2 pl-10 pr-4`
                                }
                                value={template}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`${
                                        selected ? "font-medium" : "font-normal"
                                      } block truncate`}
                                    >
                                      {template.name}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={`${
                                          active
                                            ? "text-cyan-600"
                                            : "text-cyan-600"
                                        }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                                      >
                                        <CheckIcon
                                          className="w-5 h-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                    <label className="block">
                      <span className="px-1 text-gray-700">
                        Enter Google Sheets ID
                      </span>
                      <input
                        type="text"
                        className=" bg-white shadow-md focus:bg-white focus:placeholder-gray-400 focus:shadow"
                        placeholder="google sheets id"
                        onChange={handleGoogleSheetsURL}
                      />
                    </label>
                    <div className="text-center md:hidden">
                      <button
                        className="w-48 rounded-lg px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                        onClick={generateMultipleImage}
                      >
                        Generate Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 md:mt-0">
                <h2 className="text-2xl font-bold">Preview</h2>
                <div className="mt-4 space-y-8">
                  <div className="text-center hidden md:block">
                    <button
                      className="rounded-lg w-48 px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                      onClick={downloadMultipleImage}
                    >
                      Download Image
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-6">
                    <Suspense fallback={<div>Loading...</div>}>
                      {multiImageContent.length == 0 && (
                        <div className="mt-4">
                          <figure>
                            <Image
                              width="280"
                              height="140"
                              src="/images/undraw_Optimize_image_re_3tb1.svg"
                              alt="connect google sheets"
                            />
                          </figure>
                          <p className="mt-6 text-sm text-cyan-800">
                            please make sure the google sheet is connected
                          </p>
                        </div>
                      )}
                      {multiImageContent.length > 0 &&
                        multiImageContent.map((imageConfigData, index) => {
                          return (
                            <div
                              key={`image_${index}`}
                              className={`${
                                requestedTemplate
                                  .toLowerCase()
                                  .includes("horizontal")
                                  ? "zoom-50"
                                  : "zoom-80"
                              } shadow`}
                            >
                              <div ref={multiImageReference.current[index]}>
                                <RenderCurrentTemplate
                                  currentTemplate={currentTemplate}
                                  templateConfig={imageConfigData}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </Suspense>
                  </div>
                  <div className="text-center md:hidden">
                    <button
                      className="rounded-lg w-48 px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                      onClick={downloadMultipleImage}
                    >
                      Download Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageBuilder;
