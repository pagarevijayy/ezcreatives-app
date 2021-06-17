module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/image-builder",
        permanent: true,
      },
    ];
  },
};
