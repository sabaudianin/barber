import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //zmienjszamy minimalny serwer node , w runtime nie musisz kopiowac całego node modules
  output: "standalone",
};

export default nextConfig;
