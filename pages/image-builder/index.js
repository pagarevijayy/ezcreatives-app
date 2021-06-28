import { lazy, Suspense, useState, useEffect } from "react";
import { useFormik } from "formik";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useRef } from "react";
import debounce from "lodash.debounce";
import * as htmlToImage from "html-to-image";

import { designTemplateConfig } from "../../constants/template.config";

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

const downloadFiles = (element, filename) => {
  htmlToImage
    .toPng(element, {
      pixelRatio: 3,
    })
    .then(function (dataUrl) {
      let a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      a.click();
      console.log("downloading", filename);
    });
};

const ImageBuilder = () => {
  const debouncedTemplateID = useRef(
    debounce((id) => {
      SetRequestedTemplate(id);
    }, 1000)
  ).current;
  const [isBrowser, setIsBrowser] = useState(false);
  const [currentTemplate, SetCurrentTemplate] = useState({});
  const [requestedTemplate, SetRequestedTemplate] = useState(
    "VerticalClippedBottomImage"
  );
  const [templateConfigData, setTemplateConfigData] =
    useState(designTemplateConfig);

  const imageReference = useRef(null);
  const [isMultipleImageMode, setIsMultipleImageMode] = useState(false);

  const generateImage = (values) => {
    const trimmedValues = removeEmptyKeys(values);
    setTemplateConfigData(trimmedValues);
  };

  const formik = useFormik({
    initialValues: {
      quote: "",
      subQuote: "",
      brandHandle: "",
      imageURL: "",
      imageURL2: "",
      mainContentPadding: "",
      mainContentFontStyles: "",
      subContentFontStyles: "",
      brandingFontStyles: "",
      bgColorStyles: "",
      bgOpacity: "",
    },
    onSubmit: generateImage,
  });

  useEffect(() => {
    const templateCategory = determineTemplateCategory(requestedTemplate);
    const ImportedTemplate = importTemplate(
      requestedTemplate,
      templateCategory
    );
    SetCurrentTemplate({ [requestedTemplate]: ImportedTemplate });

    /**@todo: modify/remove this later */
    setTemplateConfigData({
      subQuote: "in conversation with Neil Patel",
      // mainContentFontStyles: "",
      // mainContentPadding: "px-2",
      // brandHandle: "@wethesapiens_",
      // subContentFontStyles: "text-xl",
      imageURL2:
        "https://pbs.twimg.com/profile_images/829191018331385858/jxsj-ZmD.jpg",
      imageURL:
        "https://assets.entrepreneur.com/content/1x1/300/20180118150600-GaryVaynerchuk-Headshot.png",
      quote: "How Digital Marketing will change in 2021",
    });
  }, [requestedTemplate]);

  useEffect(() => {
    process.nextTick(() => {
      if (globalThis.window ?? false) {
        setIsBrowser(true);
      }
    });
  }, []);

  const handleTemplateId = (e) => {
    const templateValue = e?.target?.value;
    // console.log("templateValue", templateValue);
    debouncedTemplateID(templateValue);
  };

  const downloadImage = () => {
    downloadFiles(imageReference.current, "atb");
  };

  if (!isBrowser) return null;

  return (
    <>
      <div className="min-h-screen font-sans text-gray-800 bg-gray-50 ">
        <div className="header text-center px-12 py-5 shadow-sm">
          <div className="max-w-screen-2xl mx-auto">
            <p className="font-poppins font-bold text-2xl tracking-wide">
              ez <span className="text-cyan-500 uppercase">Creatives</span>
            </p>
          </div>
        </div>
        <div className="py-4 px-4 text-center max-w-screen-xl mx-auto">
          <div className="mt-4 select-none text-xs ">
            <button
              className={`${
                !isMultipleImageMode
                  ? "bg-cyan-500 text-white font-semibold"
                  : ""
              } py-2 px-4 inline-block rounded-l-lg border border-cyan-500 outline-none focus:outline-none`}
              onClick={() => {
                setIsMultipleImageMode(false);
              }}
            >
              single image
            </button>
            <button
              className={`${
                isMultipleImageMode
                  ? "bg-cyan-500 text-white font-semibold"
                  : ""
              } py-2 px-4 inline-block rounded-r-lg border border-cyan-500 outline-none focus:outline-none`}
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
                            className="w-48 rounded-lg px-3 py-2 border border-cyan-500 focus:outline-none"
                            type="submit"
                          >
                            Generate Image
                          </button>
                        </div>
                        <label className="block">
                          <span className="text-gray-700">Template ID</span>
                          <input
                            type="text"
                            className=""
                            placeholder="Enter template id"
                            onChange={handleTemplateId}
                          />
                        </label>
                        <div className="">
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button
                                  className={`disclosure-btn font-semibold text-gray-700 ${
                                    open ? "bg-gray-300 bg-opacity-50" : ""
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
                                    <div className="my-6 px-2 max-w-md mx-auto">
                                      <div className="grid grid-cols-1 gap-6">
                                        <label className="block">
                                          <span className="text-gray-700">
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
                                          <span className="text-gray-700">
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
                                          <span className="text-gray-700">
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
                                          <span className="text-gray-700">
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
                                          <span className="text-gray-700">
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
                                  className={`disclosure-btn font-semibold text-gray-700 ${
                                    open ? "bg-gray-300 bg-opacity-50" : ""
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
                                    <div className="my-6 px-2 max-w-md mx-auto">
                                      <div className="grid grid-cols-1 gap-6">
                                        <label className="block">
                                          <span className="text-gray-700">
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
                                          <span className="text-gray-700">
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
                                          <span className="text-gray-700">
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
                                          <span className="text-gray-700">
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
                                          <span className="text-gray-700">
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
                                          <span className="text-gray-700">
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
                            className="w-48 rounded-lg px-3 py-2 border border-cyan-500 focus:outline-none"
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
                      className="border border-cyan-500 rounded-lg w-48 px-3 py-2 focus:outline-none"
                      onClick={downloadImage}
                    >
                      Download Image
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-6">
                    <Suspense fallback={<div>Loading...</div>}>
                      <div
                        className={
                          requestedTemplate.toLowerCase().includes("horizontal")
                            ? "zoom-50"
                            : "zoom-80"
                        }
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
                      className="border border-cyan-500 rounded-lg w-48 px-3 py-2 focus:outline-none"
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
            <div>
              <p className="p-5">is multiple image mode</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageBuilder;
