module.exports = {
  pluginOptions: {
    s3Deploy: {
      region: "us-west-2",
      bucket: "taipei-youbike",
      assetPath: "dist",
      deployPath: "/",
      pwa: false,
      enableCloudfront: false,
      uploadConcurrency: 5
    }
  }
};
