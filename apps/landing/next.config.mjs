/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // This remains the same for handling images from Cloudinary
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv)$/, // Video file extensions
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/videos/", // Where the videos are served from
          outputPath: "static/videos/", // Where the videos are stored in the build
          name: "[name].[hash].[ext]", // Naming convention with hash to avoid caching issues
        },
      },
    });

    return config;
  },
};

export default nextConfig;
