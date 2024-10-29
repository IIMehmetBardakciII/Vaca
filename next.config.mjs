/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**", //Tüm yolları kapsayak şekilde ayarlandı.
      },
    ],
  },
};

export default nextConfig;
