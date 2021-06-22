import { designTemplateConfig } from "../../constants/template.config";

export const VerticalEncircledBottomImage = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-0",
    bgColorStyles: "bg-gray-900",
    ...templateData,
  };

  const templateDimensions = { width: "390px", height: "640px" };

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
            "text-4xl leading-snug text-gray-100 capitalize  font-poppins font-bold" +
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
        <div className="flex justify-center gap-8 mt-12">
          <img
            className="w-36 h-36 object-cover rounded-full "
            src={templateConfig.imageURL}
          />
        </div>
      </div>
    </div>
  );
};

export const VerticalBottomImage = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-0",
    bgColorStyles: "bg-yellow-700",
    ...templateData,
  };

  const templateDimensions = { width: "390px", height: "640px" };
  // const clipPath1 = "polygon(0% 100%, 0% 0%, 100% 15%, 100% 100%)";

  return (
    <div className="design-wrapper">
      <div
        className={
          "grid grid-rows-2 " + " " + `${templateConfig.bgColorStyles}`
        }
        style={templateDimensions}
      >
        <div className="px-6 flex flex-col items-center justify-center text-center">
          <p
            className={
              "text-4xl text-white capitalize  font-poppins font-bold" +
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

        <div className=" border-t-4 border-white">
          <img
            className="w-full h-full object-cover"
            src={templateConfig.imageURL}
          />
        </div>
      </div>
    </div>
  );
};

export const VerticalClippedBottomImage = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-0",
    bgColorStyles: "bg-gradient-to-b from-gray-200 to-white",
    ...templateData,
  };

  const templateDimensions = { width: "390px", height: "640px" };

  const clipPath1 =
    "polygon(0% 100%, 0% 10%, 4% 0%,  7% 5%, 15% 3%, 25% 6%, 30% 2%, 33% 4%, 35% 3%, 40% 7%, 48% 4%, 55% 6%, 59% 4%, 65% 6%, 70% 8%, 73% 5%, 80% 2%, 87% 6%, 95% 5%, 100% 6%, 100% 100%)";

  return (
    <div className="design-wrapper">
      <div
        className={
          "grid grid-rows-2 " + " " + `${templateConfig.bgColorStyles}`
        }
        style={templateDimensions}
      >
        <div className="px-6 flex flex-col items-center justify-center text-center">
          <p
            className={
              "text-4xl text-black capitalize  font-poppins font-bold" +
              " " +
              `${templateConfig.mainContentPadding}`
            }
          >
            <span className={`${templateConfig.mainContentFontStyles}`}>
              {templateConfig.quote}
            </span>
          </p>
          <p className="font-poppins font-bold text-xl text-gray-700 mt-6">
            <span className={`${templateConfig.subContentFontStyles}`}>
              {templateConfig.subQuote}
            </span>
          </p>
        </div>

        <div className=" " style={{ clipPath: clipPath1 }}>
          <img
            className="w-full h-full object-cover"
            src={templateConfig.imageURL}
          />
        </div>
      </div>
    </div>
  );
};
