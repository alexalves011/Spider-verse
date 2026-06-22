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
      <h1 className={`${spidermanFont.className} ${styles.title} `}>
        Personagens
      </h1>
      <section className={styles.heroes}>
        {heroes.map((hero) => (
          <HeroPicture key={hero.id} hero={hero} />
        ))}
      </section>
    </>
  );
}
