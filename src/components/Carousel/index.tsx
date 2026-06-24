"use client";

import { useEffect, useState } from "react";

import HeroDetails from "../HeroDetails";
import HeroPicture from "../HeroPicture";

import styles from "./carousel.module.scss";

import { IHeroData } from "@/src/interface/heroes";

interface IProps {
  heroes: IHeroData[];
  activeId: string;
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

  if (!visibleItems) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.carousel}>
        <div className={styles.wrapper}>
          {visibleItems.map((item) => (
            <div key={item.id} className={styles.hero}>
              <HeroPicture hero={item} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.details}>
        <HeroDetails data={heroes[0]} />
      </div>
    </div>
  );
}
