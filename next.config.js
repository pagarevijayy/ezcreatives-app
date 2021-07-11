module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/image-builder/single-mode",
        permanent: true,
      },
      {
        source: "/image-builder",
        destination: "/image-builder/single-mode",
        permanent: true,
      },
    ];
  },
};
