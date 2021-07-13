import { Fragment, lazy, Suspense, useState, useEffect, useRef } from "react";

import { useFormik } from "formik";

import debounce from "lodash.debounce";

import { Listbox, Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon, CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import {
  designTemplateConfig,
  SampleDefaultData,
  templateOptions,
} from "../constants/template.config";

import { WIKI } from "../constants/core";

import RenderCurrentTemplate from "./render-template";
import { removeEmptyKeys, getRandomInteger } from "../lib/utils";

import { determineTemplateCategory, downloadSingleFile } from "../lib/helpers";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const importTemplate = (templateName, templateCategory) =>
  lazy(() => {
    return import(`../lib/templates/${templateCategory}-designs`).then(
      (module) => ({
        default: module[templateName],
      })
    );
  });

const SingleImageMode = () => {
  const [selectedListItem, setSelectedListItem] = useState(templateOptions[0]);

  const debouncedTemplateID = useRef(
    debounce((id) => {
      SetRequestedTemplate(id);
    }, 500)
  ).current;

  const [currentTemplate, SetCurrentTemplate] = useState({});
  const [requestedTemplate, SetRequestedTemplate] = useState(
    templateOptions[0].id
  );
  const [templateConfigData, setTemplateConfigData] =
    useState(designTemplateConfig);
  const imageReference = useRef(null);

  const generateImage = (values) => {
    const trimmedValues = removeEmptyKeys(values);
    setTemplateConfigData(trimmedValues);
    toast("😎 Preview is ready!", {
      position: "bottom-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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

  const handleTemplateId = (selectedValue) => {
    debouncedTemplateID(selectedValue.id);
    setSelectedListItem(selectedValue);
  };

  const downloadImage = () => {
    downloadSingleFile(
      imageReference.current,
      `ezcreatives${getRandomInteger()}_`
    );
  };

  return (
    <div className="text-center my-6 md:divide-x md:grid md:grid-cols-2">
      <div className="">
        <div className="md:max-w-xs lg:max-w-md mx-auto">
          <h2 className="text-2xl font-bold">Editor</h2>
          <div className="mt-4">
            <div className="text-left">
              <form className="space-y-8" onSubmit={formik.handleSubmit}>
                <div className="text-center hidden md:block">
                  <button
                    className="w-48 rounded-lg px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                    type="submit"
                  >
                    Generate Image
                  </button>
                </div>
                <Listbox value={selectedListItem} onChange={handleTemplateId}>
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
                                      active ? "text-cyan-600" : "text-cyan-600"
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
                                    {...formik.getFieldProps("subQuote")}
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
                                    {...formik.getFieldProps("imageURL")}
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
                                    {...formik.getFieldProps("brandHandle")}
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
                                    {...formik.getFieldProps("imageURL2")}
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
                                    {...formik.getFieldProps("bgColorStyles")}
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
                                    {...formik.getFieldProps("bgOpacity")}
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
                <div className="text-center">
                  <a
                    href={WIKI.gettingStartedSingleMode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline cursor-pointer text-cyan-700 hover:text-cyan-500 
                focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-cyan-500"
                  >
                    Need Help Getting Started?
                  </a>
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
              className={`rounded-lg w-48 px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5 `}
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
        <ToastContainer />
      </div>
    </div>
  );
};

export default SingleImageMode;
