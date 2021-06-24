import { lazy, Suspense, useState, useEffect } from "react";

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

const ImageBuilder = () => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [currentTemplate, SetCurrentTemplate] = useState({});
  const [requestedTemplate, SetRequestedTemplate] = useState(
    "VerticalClippedBottomImage"
  );

  useEffect(() => {
    const templateCategory = determineTemplateCategory(requestedTemplate);
    const ImportedTemplate = importTemplate(
      requestedTemplate,
      templateCategory
    );
    SetCurrentTemplate({ [requestedTemplate]: ImportedTemplate });
  }, [requestedTemplate]);

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
      <div className="min-h-screen font-sans text-gray-800 bg-gray-100 ">
        <div className="header text-center py-6 shadow-sm">
          <p className="font-poppins font-bold text-3xl tracking-wider">
            image <span className="text-cyan-500 uppercase">builder</span>
          </p>
          <p className="mt-2 text-gray-700">Bulk Images in a Click!</p>
        </div>
        <div className="m-4 text-center">
          <div className="m-4">
            single image{" "}
            <span className="text-gray-400">/ multiple image </span>{" "}
          </div>
          <div className="text-center m-4 md:grid md:grid-cols-2">
            <div className="p-4">
              <h2 className="text-2xl font-bold">Editor</h2>
              <div className="py-8">
                <div className="text-left">
                  <form>
                    <label className="block">
                      <span className="text-gray-700">Template ID</span>
                      <input type="text" className="" placeholder="" />
                    </label>
                    <div className="mt-8">
                      <h3 className="text-xl font-medium">Content</h3>
                      <div className="mt-6 max-w-md">
                        <div className="grid grid-cols-1 gap-6">
                          <label className="block">
                            <span className="text-gray-700">
                              Primary Content (quote)
                            </span>
                            <textarea className="" rows="3" />
                          </label>

                          <label className="block">
                            <span className="text-gray-700">
                              Secondary Content (sub-quote)
                            </span>
                            <input type="text" className="" placeholder="" />
                          </label>

                          <label className="block">
                            <span className="text-gray-700">
                              Primary Image URL
                            </span>
                            <input type="url" className="" placeholder="" />
                          </label>

                          <label className="block">
                            <span className="text-gray-700">
                              Brand Handle (if any)
                            </span>
                            <input type="text" className="" placeholder="" />
                          </label>

                          <label className="block">
                            <span className="text-gray-700">
                              Secondary Image URL (if any)
                            </span>
                            <input type="url" className="" placeholder="" />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-xl font-medium">Styling</h3>
                      <div className="mt-6 max-w-md">
                        <div className="grid grid-cols-1 gap-6">
                          <label className="block">
                            <span className="text-gray-700">
                              Padding - Main Content
                            </span>
                            <input type="text" className="" placeholder="" />
                          </label>

                          <label className="block">
                            <span className="text-gray-700">
                              Font Styles - Main Content
                            </span>
                            <input type="text" className="" placeholder="" />
                          </label>

                          <label className="block">
                            <span className="text-gray-700">
                              Font Styles - Secondary Content
                            </span>

                            <input type="text" className="" placeholder="" />
                          </label>

                          <label className="block">
                            <span className="text-gray-700">
                              Background Color
                            </span>

                            <input type="text" className="" placeholder="" />
                          </label>

                          <label className="block">
                            <span className="text-gray-700">
                              Font Styles - Brand Handle (if any)
                            </span>

                            <input type="text" className="" placeholder="" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h1 className="text-lg font-medium"> Preview </h1>
              <div className="py-8 flex flex-col items-center justify-center gap-6">
                <Suspense fallback={<div>Loading...</div>}>
                  <div style={{ zoom: 0.75 }}>
                    <RenderCurrentTemplate
                      currentTemplate={currentTemplate}
                      templateConfig={{
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
                      }}
                    />
                  </div>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageBuilder;
