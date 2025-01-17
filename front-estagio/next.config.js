/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none", // Mais permissivo
          },
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
