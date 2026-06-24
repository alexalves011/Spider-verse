import { Quicksand } from "next/font/google";
import Image from "next/image";

import styles from "./heroDetails.module.scss";

import { spidermanFont } from "@/src/fonts";
import { IHeroData } from "@/src/interface/heroes";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

interface IProps {
  data: IHeroData;
}

export default function HeroDetails({ data }: IProps) {
  const { name, universe, details, id } = data;

  return (
    <div className={quicksand.className}>
      <h1 className={`${spidermanFont.className} ${styles.title}`}>
        {name} (universo-{universe})
      </h1>

      <div className={styles.details}>
        <h2 className={styles.subTitle}> Informações</h2>
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.label}> Nome Completo</td>
              <td>{details.fullName}</td>
            </tr>
            <tr>
              <td className={styles.label}>Data de Nascimento </td> 
              <td>{new Date(details.birthday).toLocaleDateString("pt-BR")}</td>
            </tr>
            <tr>
              <td className={styles.label}> Terra Natal </td> 
              <td>{details.homeland}</td>
            </tr>
            <tr>
              <td className={styles.label}> Altura</td> 
              <td>{details.height.toFixed(2)}m</td>
            </tr>
            <tr>
              <td className={styles.label}> peso</td> 
              <td>{details.weight.toFixed(2)}kg</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.details}>
        <h2 className={styles.subtitle}>Primeira Aparição</h2>
        <Image src={`/spiders/${id}-comic-book`} alt="Quadrinho primeira Aparição" width={80} height={122}/>
      </div>

    </div>
  );
}
