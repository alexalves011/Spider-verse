"use client"; // 1. Adicione isso no topo
import { motion } from "framer-motion"; // 2. Importe o motion
import Image, { StaticImageData } from "next/image";
import imageSpiderMan616 from "@public/spiders/spider-man-616 (1).png";
import imageMulherAranha65 from "@public/spiders/mulher-aranha-65 (1).png";
import imageSpiderMan1610 from "@public/spiders/spider-man-1610 (1).png";
import imageSpDr14512 from "@public/spiders/sp-dr-14512 (1).png";
import imageSpiderMan8311 from "@public/spiders/spider-ham-8311 (1).png";
import imageSpiderMan90214 from "@public/spiders/spider-man-90214 (1).png";
import imageSpiderMan928 from "@public/spiders/spider-man-928 (1).png";

import { IHeroData } from "@/src/interface/heroes";

const heroHeights: Record<string, number> = {
  "spider-man-616": 360,
  "mulher-aranha-65": 300,
  "spider-man-1610": 324,
  "spider-ham-8311": 146,
  "spider-man-90214": 376,
  "spider-man-928": 360,
  "sp-dr-14512": 324,
};

const heroesImage: Record<string, StaticImageData> = {
  "spider-man-616": imageSpiderMan616,
  "mulher-aranha-65": imageMulherAranha65,
  "spider-man-1610": imageSpiderMan1610,
  "sp-dr-14512": imageSpDr14512,
  "spider-ham-8311": imageSpiderMan8311,
  "spider-man-90214": imageSpiderMan90214,
  "spider-man-928": imageSpiderMan928,
};

interface IProps {
  hero: IHeroData;
  isCarousel?: boolean; // Nova prop opcional
}

export default function HeroPicture({ hero, isCarousel = false }: IProps) {
  const heroImage = heroesImage[hero.id];
  const heroHeight = heroHeights[hero.id];

  if (!heroImage || !heroHeight) return null;

  return (
    <motion.div
      style={{
        position: "relative",
        // No carrossel, o tamanho é gerenciado pelo CSS do .hero (motion.div pai)
        width: isCarousel ? "100%" : `${Math.round((heroImage.width * heroHeight) / heroImage.height)}px`,
        height: isCarousel ? "100%" : `${heroHeight}px`,
      }}
    >
      <Image
        src={heroImage}
        alt={hero.name}
        fill
        // Remova o tamanho fixo do sizes quando estiver no carrossel
        sizes={isCarousel ? "100vw" : `${Math.round((heroImage.width * heroHeight) / heroImage.height)}px`}
        style={{ 
          objectFit: "contain", 
          objectPosition: isCarousel ? "center" : "bottom" 
        }}
        priority
      />
    </motion.div>
  );
}