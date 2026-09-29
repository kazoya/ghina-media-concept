import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // تصوّر تجريبي: يُمنع الفهرسة على مستوى الترويسات أيضاً
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
