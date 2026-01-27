/** @type {import('next').NextConfig} */
const nextConfig = {
  // 将 agora-rtm 标记为客户端专用包
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 在服务端构建时忽略 agora-rtm
      config.externals = config.externals || [];
      config.externals.push('agora-rtm');
    }
    return config;
  },
};

module.exports = nextConfig;
