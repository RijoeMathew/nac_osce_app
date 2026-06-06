/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  basePath: isGithubPages ? "/nac_osce_app" : undefined,
  assetPrefix: isGithubPages ? "/nac_osce_app/" : undefined,
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;
