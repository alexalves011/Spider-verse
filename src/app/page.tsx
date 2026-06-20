import HeroesList from "../components";
import { IHeroData } from "../interface/heroes";

import styles from "./page.module.scss";

async function getHeroesData(): Promise<IHeroData[]> {
  const baseUrl =
    process.env.API_URL ?? "https://6a35c45a766b831960f8c26b.mockapi.io";
  const res = await fetch(new URL("/api/heroes", baseUrl).toString(), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to request heroes list");
  }

  const data = await res.json();

  return Array.isArray(data) ? data : (data.data ?? []);
}

export default async function Home() {
  const heroes = await getHeroesData();

  return (
    <>
      <main className={styles.main}>
        <HeroesList heroes={heroes} />  
      </main>
    </>
  );
}
