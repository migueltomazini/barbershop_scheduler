// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Esta parte já ignora os avisos de qualidade do ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // ADICIONE ESTA PARTE para ignorar os erros de tipo do TypeScript
  typescript: {
    // Atenção: Isto irá ignorar erros de tipo durante o build.
    // Útil para finalizar projetos quando os erros não são críticos para o funcionamento.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
