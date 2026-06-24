"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import HeroDetails from "../HeroDetails";
import HeroPicture from "../HeroPicture";

import styles from "./carousel.module.scss";

import { IHeroData } from "@/src/interface/heroes";

interface IProps {
  heroes: IHeroData[];
  activeId: string;
}

enum enPosition {
  FRONT = 0,
  MIDDLE = 1,
  BACK = 2,
}

export default function Carousel({ heroes, activeId }: IProps) {
  const [visibleItems, setVisibleItems] = useState<IHeroData[] | null>(null);
  const [activeIdex, setActiveIdex] = useState<number>(
    heroes.findIndex((hero) => hero.id === activeId),
  );

  useEffect(() => {
    const indexInArrayScope =
      ((activeIdex % heroes.length) + heroes.length) % heroes.length;

    const visibleItems = [...heroes, ...heroes].slice(
      indexInArrayScope,
      indexInArrayScope + 3,
    );

    setVisibleItems(visibleItems);
  }, [heroes, activeIdex]);


  useEffect(() => {

    const htmlEl = document.querySelector("html")

    if(!htmlEl || !visibleItems){
      return
    }

    const currentHeroid = visibleItems[enPosition.MIDDLE].id
    htmlEl.style.backgroundImage = `url("/spiders/${currentHeroid}-background.png")`;
    htmlEl.classList.add("hero-page");

    return () => {
      htmlEl.classList.remove("hero-page")
    }

  },[visibleItems])

  const handleChangeActiveIdex = (newDirection: number) => {
    setActiveIdex((prevActiveIdex) => prevActiveIdex + newDirection);
  };

  if (!visibleItems) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.carousel}>
        <div
          className={styles.wrapper}
          onClick={() => handleChangeActiveIdex(1)}
        >
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, position) => (
              <motion.div
                key={item.id}
                className={styles.hero}
                // ... (seus props iniciais)
                animate={{ x: 0, ...getItemStyles(position) }}
              >
                {/* REMOVA a prop isCarousel se ela estiver restringindo o tamanho */}
                <HeroPicture hero={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className={styles.details}>
        <HeroDetails data={heroes[0]} />
      </div>
    </div>
  );
}

const getItemStyles = (position: enPosition) => {
  if (position === enPosition.FRONT) {
    return {
      zIndex: 3,
      filter: "blur(10px)",
      scale: 1.2,
  
    };
  }

  if (position === enPosition.MIDDLE) {
    return {
      zIndex: 2,
      left: 300,
      scale: 0.8,
      top: "-10px",
    };
  }

  return {
    zIndex: 1,
    filter: "blur(10px)",
    left: 160,
    top: "-20%",
    scale: 0.6,
    opacity: 0.8,
  };
};
