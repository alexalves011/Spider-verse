"use client";

import { motion } from "framer-motion";

import { spidermanFont } from "../../fonts";
import { IHeroData } from "../../interface/heroes";
import HeroPicture from "../HeroPicture";

import styles from "./heroesList.module.scss";

interface IProps {
  heroes: IHeroData[];
}

export default function HeroesList({ heroes }: IProps) {
  return (
    <>
      <motion.h1
        className={`${spidermanFont.className} ${styles.title} `}
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{ duration: 2, delay: 2 }}
      >
        Personagens
      </motion.h1>

      <motion.section
        className={styles.heroes}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 2 }}
      >
        {heroes.map((hero) => (
          <HeroPicture key={hero.id} hero={hero} />
        ))}
      </motion.section>
    </>
  );
}
