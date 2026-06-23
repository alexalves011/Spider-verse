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
}

export default function HeroPicture({ hero }: IProps) {
  const heroImage = heroesImage[hero.id];
  const heroHeight = heroHeights[hero.id];

  if (!heroImage || !heroHeight) {
    return null;
  }

  const heroWidth = Math.round(
    (heroImage.width * heroHeight) / heroImage.height,
  );

  return (
    // 3. Troque <div> por <motion.div>
    <motion.div
      style={{
        position: "relative",
        width: heroWidth,
        height: heroHeight,
      }}
      // 4. Adicione as animações aqui
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.8 }}
      transition={{ duration: 0.8 }}
    >
      <Image
        src={heroImage}
        alt={`${hero.name} (Universo-${hero.universe})`}
        fill
        sizes={`${heroWidth}px`}
        style={{ objectFit: "contain", objectPosition: "bottom" }}
        priority
      />
    </motion.div>
  );
}