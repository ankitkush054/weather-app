
// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
// module.exports = {
//     images: {
//       remotePatterns: [
//         {
//           protocol: 'https',
//           hostname: 'assets.example.com',
//           port: '',
//           pathname: '/account123/**',
//           search: '',
//         },
//       ],
//     },
//   }
/** @format */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;

module.exports = nextConfig;


module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
      }
    ]
  }
};