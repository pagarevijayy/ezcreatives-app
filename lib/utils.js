/** Remove empty keys from the javascript object */
export const removeEmptyKeys = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => !!value)
  );
};

/** Get a random integer */
export const getRandomInteger = () => {
  // Returns a random integer from 0 to 100:
  return Math.floor(Math.random() * 101);
};
