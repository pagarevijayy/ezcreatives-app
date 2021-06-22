import { designTemplateConfig } from "../../constants/template.config";

export const HorizontalLeftImage = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-0",
    bgColorStyles: "bg-yellow-700",
    ...templateData,
  };

  const templateDimensions = { width: "640px", height: "390px" };
  const imageDimensions = { width: "340px", height: "390px" };
  const clipPath1 = "polygon(0% 100%, 0% 0%, 80% 0%, 100% 100%)";

  return (
    <div className="design-wrapper">
      <div
        className={"grid grid-cols-2" + " " + `${templateConfig.bgColorStyles}`}
        style={templateDimensions}
      >
        <div style={{ clipPath: clipPath1 }}>
          <img
            style={{ ...imageDimensions, objectFit: "cover" }}
            src={templateConfig.imageURL}
          />
        </div>
        <div className="pr-8 flex flex-col justify-center text-right">
          <p
            className={
              "text-4xl text-gray-100 capitalize  font-poppins font-bold" +
              " " +
              `${templateConfig.mainContentPadding}`
            }
          >
            <span className={`${templateConfig.mainContentFontStyles}`}>
              {templateConfig.quote}
            </span>
          </p>
          <p className="font-poppins font-bold text-xl text-gray-200 mt-6">
            <span className={`${templateConfig.subContentFontStyles}`}>
              {templateConfig.subQuote}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export const HorizontalPoppedTitle = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-4",
    bgColorStyles:
      "bg-gradient-to-tl from-pink-300 via-purple-300 to-indigo-400",
    ...templateData,
  };

  const templateDimensions = { width: "640px", height: "390px" };
  const imageDimensions = { width: "430px", height: "390px" };
  // const clipPath1 = "polygon(0% 100%, 0% 0%, 80% 0%, 100% 100%)";

  const clipPath2 = "polygon(0% 100%, 20% 0%, 100% 0%, 100% 100%)";

  return (
    <div className="design-wrapper">
      <div
        className={"grid grid-cols-3" + " " + `${templateConfig.bgColorStyles}`}
        style={templateDimensions}
      >
        <div className="pl-6 relative text-left">
          <p className="my-6 font-poppins font-bold text-xl text-gray-200 ">
            <span className={`${templateConfig.subContentFontStyles}`}>
              {templateConfig.subQuote}
            </span>
          </p>
          <div className="mt-8 ml-6 absolute w-96 z-10">
            <p
              className={
                " inline decoration-clone leading-relaxed text-5xl text-gray-100 capitalize bg-gray-900 font-poppins font-bold" +
                " " +
                `${templateConfig.mainContentPadding}`
              }
            >
              <span className={`${templateConfig.mainContentFontStyles}`}>
                {templateConfig.quote}
              </span>
            </p>
          </div>
        </div>
        <div className="col-span-2 -mr-1" style={{ clipPath: clipPath2 }}>
          <img
            style={{ ...imageDimensions, objectFit: "cover" }}
            src={templateConfig.imageURL}
          />
        </div>
      </div>
    </div>
  );
};

export const HorizontalEncircledRightImage = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-0",
    bgColorStyles: "bg-blue-500",
    ...templateData,
  };

  const templateDimensions = { width: "640px", height: "390px" };
  const imageDimensions = { width: "340px", height: "390px" };

  return (
    <div className="design-wrapper">
      <div
        className={"grid grid-cols-2" + " " + `${templateConfig.bgColorStyles}`}
        style={templateDimensions}
      >
        <div className="pl-12 flex flex-col justify-center text-left">
          <p
            className={
              "text-4xl text-gray-100 font-poppins font-bold" +
              " " +
              `${templateConfig.mainContentPadding}`
            }
          >
            <span className={`${templateConfig.mainContentFontStyles}`}>
              {templateConfig.quote}
            </span>
          </p>
          <p className="font-poppins font-bold text-xl text-white mt-6">
            <span className={`${templateConfig.subContentFontStyles}`}>
              {templateConfig.subQuote}
            </span>
          </p>
        </div>
        <div className="pr-6 flex justify-center items-center">
          <img
            className="w-64 h-64 object-cover rounded-full border-4 border-gray-50"
            src={templateConfig.imageURL}
          />
        </div>
      </div>
    </div>
  );
};

export const HorizontalPodcastGuest = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-0",
    bgColorStyles: "bg-gray-900",
    ...templateData,
  };

  const templateDimensions = { width: "640px", height: "390px" };
  const imageDimensions = { width: "340px", height: "390px" };

  return (
    <div className="design-wrapper">
      <div
        className={
          "px-6 flex flex-col justify-center items-center text-center" +
          " " +
          `${templateConfig.bgColorStyles}`
        }
        style={templateDimensions}
      >
        <p
          className={
            "text-4xl text-gray-100 capitalize  font-poppins font-bold" +
            " " +
            `${templateConfig.mainContentPadding}`
          }
        >
          <span className={`${templateConfig.mainContentFontStyles}`}>
            {templateConfig.quote}
          </span>
        </p>
        <p className="font-poppins font-bold text-xl text-yellow-600 mt-6">
          <span className={`${templateConfig.subContentFontStyles}`}>
            {templateConfig.subQuote}
          </span>
        </p>
        <div className="flex justify-center gap-8 mt-6">
          <img
            className="w-36 h-36 object-cover rounded-full "
            src={templateConfig.imageURL}
          />
          <img
            className="w-36 h-36 object-cover rounded-full "
            src={templateConfig.imageURL2}
          />
        </div>
      </div>
    </div>
  );
};
