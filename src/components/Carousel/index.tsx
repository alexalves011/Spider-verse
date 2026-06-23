import HeroDetails from "../HeroDetails";

import { IHeroData } from "@/src/interface/heroes";

interface IProps {
  heroes: IHeroData[];
  activeId: string;
}

export default function Carousel({ heroes, activeId }: IProps) {
  return
  <>
    <h1>componente de carrosel: {activeId}</h1>;
    <HeroDetails data={heroes[0]} />
  </>;
}
