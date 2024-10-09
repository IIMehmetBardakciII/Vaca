/** @type {import('next').NextConfig} */
const nextConfig = {
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
