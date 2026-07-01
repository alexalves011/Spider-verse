"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Link from "next/link";

import { spidermanFont } from "../../fonts";
import { IHeroData } from "../../interface/heroes";
import HeroPicture from "../HeroPicture";

import styles from "./heroesList.module.scss";

interface IProps {
  heroes: IHeroData[];
}

export default function HeroesList({ heroes }: IProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [startTouchPosition, setStartTouchPosition] = useState<number | null>(
    null,
  );
  const router = useRouter();

  const activeHero = heroes[activeIndex] ?? heroes[0];

  const secondaryHeroes = useMemo(
    () => heroes.filter((_, index) => index !== activeIndex),
    [heroes, activeIndex],
  );

  const nextCharacter = () => {
    setActiveIndex((current) => (current + 1) % heroes.length);
  };

  const previousCharacter = () => {
    setActiveIndex((current) => (current - 1 + heroes.length) % heroes.length);
  };

  const updateCharacter = (index: number) => {
    setActiveIndex(index);
  };

  const goToHero = (id: string) => {
    router.push(`/hero/${id}`);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setStartTouchPosition(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startTouchPosition === null) {
      return;
    }

    const endTouchPosition = event.changedTouches[0].clientX;
    const diff = endTouchPosition - startTouchPosition;

    if (Math.abs(diff) < 50) {
      setStartTouchPosition(null);
      return;
    }

    if (diff < 0) {
      nextCharacter();
    } else {
      previousCharacter();
    }

    setStartTouchPosition(null);
  };

  return (
    <>
      <motion.h1
        className={`${spidermanFont.className} ${styles.title} `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
      >
        Personagens
      </motion.h1>

      <motion.section
        className={styles.heroes}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
      >
        {heroes.map((hero) => (
          <Link key={hero.id} href={`hero/${hero.id}`}>
            <HeroPicture key={hero.id} hero={hero} />
          </Link>
        ))}
      </motion.section>

      <div className={styles.mobileSlider}>
        <div className={styles.mobileSliderWrapper}>
          <button
            type="button"
            aria-label="Personagem anterior"
            className={`${styles.mobileNavButton} ${styles.mobileNavButtonPrevious}`}
            onClick={previousCharacter}
          >
            ←
          </button>

          <div
            className={styles.mobileHeroCard}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="button"
            tabIndex={0}
            onClick={() => goToHero(activeHero.id)}
            onKeyDown={(e) => {
              if ((e as any).key === "Enter") goToHero(activeHero.id);
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHero.id}
                initial={{ opacity: 0, x: 48, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -48, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={styles.mobileHeroInner}
              >
                <HeroPicture hero={activeHero} isCarousel />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label="Próximo personagem"
            className={`${styles.mobileNavButton} ${styles.mobileNavButtonNext}`}
            onClick={nextCharacter}
          >
            →
          </button>
        </div>

        <div className={styles.mobileSecondary}>
          {secondaryHeroes.map((hero) => (
            <div
              key={hero.id}
              className={styles.secondaryHero}
              aria-hidden="true"
              role="button"
              tabIndex={0}
              onClick={() => goToHero(hero.id)}
              onKeyDown={(e) => {
                if ((e as any).key === "Enter") goToHero(hero.id);
              }}
            >
              <HeroPicture hero={hero} isCarousel />
            </div>
          ))}
        </div>

        <div className={styles.indicators}>
          {heroes.map((hero, index) => (
            <button
              key={hero.id}
              type="button"
              className={`${styles.indicatorButton} ${index === activeIndex ? styles.active : ""}`}
              aria-label={`Selecionar ${hero.name}`}
              aria-current={index === activeIndex ? "true" : "false"}
              onClick={() => updateCharacter(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
