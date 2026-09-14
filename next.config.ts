import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' va.vercel-scripts.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' blob: data: integrano-bucket.s3.sa-east-1.amazonaws.com https://d1k3d9s7og4dh2.cloudfront.net https://img.youtube.com https://i.ytimg.com https://sb24horas.com.br https://www.google-analytics.com https://www.googletagmanager.com;
    font-src 'self' fonts.gstatic.com;
    connect-src 'self' https://api.integrano.api.br https://homolog.api.integrano.api.br http://localhost:3030 https://www.google-analytics.com *.google-analytics.com https://api.opencnpj.org https://viacep.com.br https://brasilapi.com.br;
    frame-src 'self' https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com;
    media-src 'self' blob: https://d1k3d9s7og4dh2.cloudfront.net integrano-bucket.s3.sa-east-1.amazonaws.com;
    worker-src 'self' blob:;
    frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'integrano-bucket.s3.sa-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd1k3d9s7og4dh2.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sb24horas.com.br',
        port: '',
        pathname: '/**',
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
