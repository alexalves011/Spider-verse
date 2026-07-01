import Carousel from "@/src/components/Carousel";
import { IHeroData } from "@/src/interface/heroes";

// O params é uma Promise que resolve para o objeto com o id
interface IProps {
  params: Promise<{ id: string }>;
}

async function getHeroesData(): Promise<{ data: IHeroData[] }> {
  const res = await fetch(
    "https://6a35c45a766b831960f8c26b.mockapi.io/api/heroes",
  );

  if (!res.ok) {
    throw new Error("Failed to request heroes list");
  }

  return res.json();
}

export default async function Hero({ params }: IProps) {
  // Você DEVE usar o await aqui para extrair o id
  const { id } = await params;

  const heroesResponse = await getHeroesData();
  // API may return { data: IHeroData[] } or an array directly depending on environment.
  const heroesArray: IHeroData[] = Array.isArray(heroesResponse)
    ? (heroesResponse as unknown as IHeroData[])
    : (heroesResponse as any).data || (heroesResponse as any).items || [];

  return <Carousel heroes={heroesArray} activeId={id} />;
}
