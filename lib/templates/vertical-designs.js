export const VerticalEncircledBottomImage = ({
  quote,
  subQuote,
  imageURL,
  socialHandle,
  mainContentPadding,
  mainContentTextSize,
  backgroundColor,
}) => {
  // quote = `Learn how to make delicious pizzas under 15mins.`;
  // subQuote = "#TastyBites";
  // imageURL =
  //   "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=714&q=80";

  backgroundColor = backgroundColor || "bg-gray-900";
  mainContentPadding = mainContentPadding || "px-0";
  mainContentTextSize = mainContentTextSize || "text-2xl";

  const templateDimensions = { width: "390px", height: "640px" };

  return (
    <div className="design-wrapper">
      <div
        className={
          "px-6 flex flex-col justify-center items-center text-center" +
          " " +
          `${backgroundColor}`
        }
        style={templateDimensions}
      >
        <p
          className={
            "text-4xl text-gray-100 capitalize  font-poppins font-bold" +
            " " +
            `${mainContentPadding}`
          }
        >
          {quote}
        </p>
        <p className="font-poppins font-bold text-xl text-yellow-600 mt-6">
          {subQuote}
        </p>
        <div className="flex justify-center gap-8 mt-12">
          <img
            className="w-36 h-36 object-cover rounded-full "
            src={imageURL}
            alt={quote}
          />
        </div>
      </div>
    </div>
  );
};

export const VerticalBottomImage = ({
  quote,
  subQuote,
  imageURL,
  socialHandle,
  mainContentPadding,
  mainContentTextSize,
  backgroundColor,
}) => {
  // quote = `Learn how to make delicious pizzas under 15mins.`;
  // subQuote = "#TastyBites";
  // imageURL =
  //   "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=714&q=80";

  backgroundColor = backgroundColor || "bg-yellow-700";
  mainContentPadding = mainContentPadding || "px-0";
  mainContentTextSize = mainContentTextSize || "text-2xl";

  const templateDimensions = { width: "390px", height: "640px" };
  // const clipPath1 = "polygon(0% 100%, 0% 0%, 100% 15%, 100% 100%)";

  return (
    <div className="design-wrapper">
      <div
        className={"grid grid-rows-2 " + " " + `${backgroundColor}`}
        style={templateDimensions}
      >
        <div className="px-6 flex flex-col items-center justify-center text-center">
          <p
            className={
              "text-4xl text-white capitalize  font-poppins font-bold" +
              " " +
              `${mainContentPadding}`
            }
          >
            {quote}
          </p>
          <p className="font-poppins font-bold text-xl text-gray-200 mt-6">
            {subQuote}
          </p>
        </div>

        <div className=" border-t-4 border-white">
          <img
            className="w-full h-full object-cover"
            src={imageURL}
            alt={quote}
          />
        </div>
      </div>
    </div>
  );
};

export const VerticalClippedBottomImage = ({
  quote,
  subQuote,
  imageURL,
  socialHandle,
  mainContentPadding,
  mainContentTextSize,
  backgroundColor,
}) => {
  // quote = `Learn how to make delicious pizzas under 15mins.`;
  // subQuote = "#TastyBites";
  // imageURL =
  //   "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=714&q=80";

  backgroundColor =
    backgroundColor || "bg-gradient-to-b from-gray-200 to-white";
  mainContentPadding = mainContentPadding || "px-0";
  mainContentTextSize = mainContentTextSize || "text-2xl";

  const templateDimensions = { width: "390px", height: "640px" };

  const clipPath1 =
    "polygon(0% 100%, 0% 10%, 4% 0%,  7% 5%, 15% 3%, 25% 6%, 30% 2%, 33% 4%, 35% 3%, 40% 7%, 48% 4%, 55% 6%, 59% 4%, 65% 6%, 70% 8%, 73% 5%, 80% 2%, 87% 6%, 95% 5%, 100% 6%, 100% 100%)";

  return (
    <div className="design-wrapper">
      <div
        className={"grid grid-rows-2 " + " " + `${backgroundColor}`}
        style={templateDimensions}
      >
        <div className="px-6 flex flex-col items-center justify-center text-center">
          <p
            className={
              "text-4xl text-black capitalize  font-poppins font-bold" +
              " " +
              `${mainContentPadding}`
            }
          >
            {quote}
          </p>
          <p className="font-poppins font-bold text-xl text-gray-700 mt-6">
            {subQuote}
          </p>
        </div>

        <div className=" " style={{ clipPath: clipPath1 }}>
          <img
            className="w-full h-full object-cover"
            src={imageURL}
            alt={quote}
          />
        </div>
      </div>
    </div>
  );
};
