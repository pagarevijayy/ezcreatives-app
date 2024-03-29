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
import debounce from "lodash.debounce";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  designTemplateConfig,
  SampleDefaultData,
  templateOptions,
} from "../constants/template.config";

import { WIKI } from "../constants/core";

import RenderCurrentTemplate from "./render-template";

import { removeEmptyKeys } from "../lib/utils";
import { determineTemplateCategory, zipDownloadImages } from "../lib/helpers";

const importTemplate = (templateName, templateCategory) =>
  lazy(() => {
    return import(`../lib/templates/${templateCategory}-designs`).then(
      (module) => ({
        default: module[templateName],
      })
    );
  });

const spinnerSVG = (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 inline"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const MultiImageMode = () => {
  const [selectedListItem, setSelectedListItem] = useState(templateOptions[0]);

  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingImageError, setGeneratingImageError] = useState({
    status: false,
    message: "",
  });

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

  const [currentTemplate, SetCurrentTemplate] = useState({});
  const [requestedTemplate, SetRequestedTemplate] = useState(
    templateOptions[0].id
  );
  const [templateConfigData, setTemplateConfigData] =
    useState(designTemplateConfig);

  const [multiImageContent, setMultiImageContent] = useState([]);

  const multiImageReference = useRef([]);
  multiImageReference.current = multiImageContent.map(
    (e, i) => multiImageReference.current[i] ?? createRef()
  );

  const [googleSheetId, setGoogleSheetId] = useState("");

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
  }, [requestedTemplate]);

  const handleTemplateId = (selectedValue) => {
    debouncedTemplateID(selectedValue.id);
    setSelectedListItem(selectedValue);
  };

  const generateMultipleImage = () => {
    console.log("generate multi images...");

    setGeneratingImage(true);
    setGeneratingImageError({
      status: false,
      message: "",
    });

    if (!googleSheetId) {
      setGeneratingImage(false);
      setGeneratingImageError({
        status: true,
        message: "Please enter google sheets id!",
      });

      toast("🙊 Please enter google sheets ID!", {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

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
        } else {
          setGeneratingImageError({
            status: true,
            message:
              "Something went wrong. Make sure all steps have been followed correctly!",
          });
        }

        setGeneratingImage(false);
      })
      .catch((error) => {
        setGeneratingImage(false);
        setGeneratingImageError({
          status: true,
          message:
            "Something went wrong. Make sure all steps have been followed correctly!",
        });
        toast("❌ Something went wrong!", {
          position: "bottom-right",
          autoClose: 3500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log(error);
      });
  };

  const downloadMultipleImage = () => {
    console.log("download multi images...");

    if (multiImageReference.current.length == 0) {
      toast("💔 Google Sheet is not connected!", {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    zipDownloadImages(multiImageReference.current);
  };

  const handleGoogleSheetsURL = (e) => {
    const googleSheetURL = e?.target?.value;

    // console.log("googleSheetURL", googleSheetURL);

    debouncedGoogleSheetID(googleSheetURL);
  };

  return (
    <div className="text-center my-6 md:divide-x md:grid md:grid-cols-2">
      <div className="">
        <div className="md:max-w-xs lg:max-w-md mx-auto">
          <h2 className="text-2xl font-bold">Editor</h2>
          <div className="mt-4 text-left space-y-8">
            <div className="text-center hidden md:block">
              <button
                disabled={generatingImage}
                className="w-48 rounded-lg px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                onClick={generateMultipleImage}
              >
                {generatingImage ? (
                  <span> {spinnerSVG} Generating... </span>
                ) : (
                  `Generate Image`
                )}
              </button>
            </div>
            <Listbox value={selectedListItem} onChange={handleTemplateId}>
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
            <label className="block">
              <span className="px-1 text-gray-700">Enter Google Sheets ID</span>
              <input
                type="text"
                className=" bg-white shadow-md focus:bg-white focus:placeholder-gray-400 focus:shadow"
                placeholder="google sheets id"
                onChange={handleGoogleSheetsURL}
              />
              {generatingImageError.status ? (
                <p className="mt-4 px-1 text-xs text-red-500">
                  {generatingImageError.message}
                </p>
              ) : null}
            </label>
            <div className="text-center">
              <a
                href={WIKI.gettingStartedMultiMode}
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
                disabled={generatingImage}
                className="w-48 rounded-lg px-3 py-2 border border-cyan-600 focus:outline-none text-cyan-600 hover:text-cyan-500 hover:border-cyan-500 active:text-cyan-700 active:border-cyan-700 transform transition hover:-translate-y-0.5"
                onClick={generateMultipleImage}
              >
                {generatingImage ? (
                  <span> {spinnerSVG} Generating... </span>
                ) : (
                  `Generate Image`
                )}
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
                  <p className="mt-6 md:mt-12 text-sm text-cyan-800">
                    Make sure the google sheet is connected
                  </p>
                </div>
              )}
              {multiImageContent.length > 0 &&
                multiImageContent.map((imageConfigData, index) => {
                  return (
                    <div
                      key={`image_${index}`}
                      className={`${
                        requestedTemplate.toLowerCase().includes("horizontal")
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
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default MultiImageMode;
