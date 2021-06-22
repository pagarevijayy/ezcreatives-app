import { designTemplateConfig } from "../../constants/template.config";

export const SquareBottomImage = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-4",
    ...templateData,
  };

  return (
    <div className="design-wrapper">
      <div className="design-template flex flex-col justify-end w-96 h-auto font-poppins text-left text-base bg-black text-gray-200">
        <section>
          <p className={"my-4" + " " + `${templateConfig.mainContentPadding}`}>
            <span className={`${templateConfig.mainContentFontStyles}`}>
              "{templateConfig.quote}"
            </span>{" "}
            <span
              className={
                "whitespace-nowrap" +
                " " +
                `${templateConfig.subContentFontStyles}`
              }
            >
              {templateConfig.subQuote}
            </span>
          </p>
          <div className="relative">
            <div>
              <img
                className="w-full max-h-56 object-cover"
                src={templateConfig.imageURL}
                alt={templateConfig.quote}
              />
            </div>
            <p className="flex items-center justify-start text-sm mb-1.5 absolute bottom-0 left-1/2 -translate-x-1/2 transform scale-75  py-1 px-2">
              <span className={`${templateConfig.brandingFontStyles}`}>
                {templateConfig.brandHandle}
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

/** SquareRightImage - Image on the right side and content one the left */
export const SquareEncircledTopImage = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-4",
    ...templateData,
  };

  return (
    <div className="design-wrapper">
      <div className="w-96 h-96 p-6 flex flex-col items-center justify-end bg-gray-900 text-gray-50 text-center">
        <img
          className="w-36 h-36 object-cover rounded-full"
          src={templateConfig.imageURL}
          alt={templateConfig.quote}
        />
        <p
          className={
            "mt-6 font-poppins text-lg" +
            " " +
            `${templateConfig.mainContentPadding}`
          }
        >
          <span className={`${templateConfig.mainContentFontStyles}`}>
            {templateConfig.quote}
          </span>
        </p>
        <p className="mt-4 mb-6 text-xs text-gray-200 font-medium tracking-wider uppercase">
          <span className={`${templateConfig.subContentFontStyles}`}>
            {templateConfig.subQuote}
          </span>
        </p>
      </div>
    </div>
  );
};

/** SquareClippedTopImage - Image with the clipped path on the top and the content at the bottom */
export const SquareClippedTopImage = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-4",
    ...templateData,
  };

  const clipPath1 =
    "polygon(0% 100%, 0% 0%, 100% 0%, 100% 99%, 96% 95%, 92% 100%, 87% 98%, 83% 100%, 72% 99%, 63% 94%, 59% 97%, 59% 98%, 45% 98%, 37% 100%, 36% 95%, 31% 97%, 20% 94%, 16% 100%, 11% 97%)";

  return (
    <div className="design-wrapper">
      <div className="w-96 h-96 bg-white grid grid-rows-2">
        <div style={{ clipPath: clipPath1 }}>
          <img
            className="w-full h-48 object-cover"
            src={templateConfig.imageURL}
            alt={templateConfig.quote}
          />
        </div>
        <div className="flex flex-col items-center justify-end text-center">
          <p
            className={
              "mt-4 font-poppins text-lg" +
              " " +
              `${templateConfig.mainContentPadding}`
            }
          >
            <span className={`${templateConfig.mainContentFontStyles}`}>
              {templateConfig.quote}
            </span>
          </p>
          <p className="mt-4 text-xs font-medium tracking-wider uppercase whitespace-nowrap">
            <span className={`${templateConfig.subContentFontStyles}`}>
              {templateConfig.subQuote}
            </span>
          </p>
          <p className="my-3 font-poppins text-sm transform scale-75 text-gray-500">
            <span className={`${templateConfig.brandingFontStyles}`}>
              {templateConfig.brandHandle}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

/** SquareEncircledTopImage - Image encircled like an avatar at the top, and the content at bottom */
export const SquareRightImage = ({ templateData }) => {
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-4",
    ...templateData,
  };

  return (
    <div className="design-wrapper">
      <div className="relative w-96 h-96">
        <div className="grid grid-cols-2">
          <div className="flex flex-col justify-center text-center bg-white">
            <div className={"" + " " + `${templateConfig.mainContentPadding}`}>
              <p className="font-merriweather text-lg">
                <span className={`${templateConfig.mainContentFontStyles}`}>
                  {templateConfig.quote}
                </span>
              </p>
              <p className="mt-4 text-xs font-semibold uppercase">
                <span className={`${templateConfig.subContentFontStyles}`}>
                  {templateConfig.subQuote}
                </span>
              </p>
            </div>
          </div>
          <div>
            <img
              className="w-48 h-96 object-cover"
              src={templateConfig.imageURL}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/** SquareWisdom - Image in the background and the content on top of it */
export const SquareWisdom = ({ templateData }) => {
  /** templateConfig: import config parameters, set default, override with user data */
  const templateConfig = {
    ...designTemplateConfig,
    mainContentPadding: "px-4",
    bgOpacity: "bg-opacity-80",
    ...templateData,
  };

  return (
    <div className="design-wrapper">
      <div className="relative w-96 h-96">
        <section className="relative">
          <img
            className="w-96 h-96 object-cover"
            src={templateConfig.imageURL}
            alt={templateConfig.quote}
          />
          <aside
            className={
              "absolute w-full h-full bg-black top-0" +
              " " +
              `${templateConfig.bgOpacity}`
            }
          ></aside>
        </section>
        <div className="absolute w-full h-full top-0 flex flex-col justify-end text-center text-lg ">
          <div
            className={
              "opacity-95" + " " + `${templateConfig.mainContentPadding}`
            }
          >
            <p className={"text-gray-50 font-merriweather italic"}>
              <span className={`${templateConfig.mainContentFontStyles}`}>
                {templateConfig.quote}
              </span>
            </p>
            <hr className="mt-8 mx-auto border-none w-8 h-0.5 bg-gray-50" />
            <p className="mt-7 text-xs font-bold tracking-widest uppercase text-gray-200 transform scale-90">
              <span className={`${templateConfig.subContentFontStyles}`}>
                {templateConfig.subQuote}
              </span>
            </p>
          </div>
          <div className="px-16 mb-8 mt-6 transform scale-75 origin-center">
            <span className="w-min text-left text-sm leading-snug font-poppins font-medium text-gray-300">
              <span className={`${templateConfig.brandingFontStyles}`}>
                {templateConfig.brandHandle}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/** SquareTwitter -  Tweet-like card hovered over a background. */
export const SquareTwitter = ({
  quote,
  author,
  imageURL,
  socialHandle,
  mainContentPadding,
}) => {
  // quote = `"The less people know, the more stubbornly they know it."`;
  // author = "Osho";
  // imageURL = `https://pbs.twimg.com/media/E3tVluFVoAcLfpI.jpg`;
  mainContentPadding = mainContentPadding || "px-4";

  return (
    <div className="design-wrapper">
      <div className="w-96 h-96 flex flex-col items-center justify-center bg-blue-500">
        <div className="bg-white m-6 p-4 rounded-lg bg-opacity-95 ">
          <div className="flex items-center">
            <img
              className="w-16 h-16 object-cover rounded-full"
              src={imageURL}
              alt={quote}
            />
            <div className="px-3">
              <p className="font-semibold capitalize"> {author}</p>
              <p className="text-sm">{socialHandle}</p>
            </div>
          </div>
          <p className={"mt-4" + " " + `${mainContentPadding}`}>{quote}</p>
        </div>
      </div>
    </div>
  );
};

/**  SquareQuote - Quote-lines with a background-color and the author at right bottom. */
export const SquareQuote = ({
  quote,
  author,
  imageURL,
  socialHandle,
  mainContentPadding,
  mainContentTextSize,
}) => {
  // quote = `"The less people know, the more stubbornly they know it."`;
  // author = "Osho";
  // imageURL = `https://pbs.twimg.com/media/E3tVluFVoAcLfpI.jpg`;
  mainContentPadding = mainContentPadding || "px-2";
  mainContentTextSize = mainContentTextSize || "text-2xl";

  return (
    <div className="design-wrapper">
      <div className="p-8 w-96 h-96 flex flex-col justify-between bg-white">
        <div className="text-left">
          <p className="text-7xl text-gray-400 font-poppins h-12">“</p>
          <p
            className={
              "mt-4 inline bg-yellow-300 font-poppins italic font-medium leading-relaxed text-gray-700 decoration-clone" +
              " " +
              `${mainContentPadding} ${mainContentTextSize}`
            }
          >
            {quote}
          </p>
        </div>
        <div className="flex items-center mr-0 ml-auto">
          <div className="px-4 text-right">
            <p className="font-semibold capitalize"> {author}</p>
            <p className="mt-1 text-sm font-poppins text-gray-500 whitespace-nowrap">
              {socialHandle}
            </p>
          </div>
          <img
            className="w-16 h-16 object-cover rounded-full"
            src={imageURL}
            alt={quote}
          />
        </div>
      </div>
    </div>
  );
};
