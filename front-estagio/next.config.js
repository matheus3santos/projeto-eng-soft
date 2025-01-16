/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" }, // Mais permissivo que "require-corp"
        ],
      },
    ];
  },
  async redirects() {
    return [
      // {
      //   source: '/orientador-dashboard',
      //   destination: '/',
      //   permanent: false, // Redirecionamento temporário
      // },
      // {
      //   source: '/admin-dashboard',
      //   destination: '/login',
      //   permanent: false, // Redirecionamento temporário
      // },
    ];
  },
};

module.exports = nextConfig;
