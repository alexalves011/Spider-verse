import Image, { StaticImageData } from "next/image";
import imageSpiderMan616 from "@public/spiders/spider-man-616 (1).png";
import imageMulherAranha65 from "@public/spiders/mulher-aranha-65 (1).png";
import imageSpiderMan1610 from "@public/spiders/spider-man-1610 (1).png";
import imageSpDr14512 from "@public/spiders/sp-dr-14512 (1).png";
import imageSpiderMan8311 from "@public/spiders/spider-ham-8311 (1).png";
import imageSpiderMan90214 from "@public/spiders/spider-man-90214 (1).png";
import imageSpiderMan928 from "@public/spiders/spider-man-928 (1).png";

import { IHeroData } from "@/src/interface/heroes";

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

  if (!heroImage) {
    return null;
  }

  return (
    <Image
      src={heroImage}
      alt={`${hero.name} (Universo-${hero.universe})`}
      priority
    />
  );
}
