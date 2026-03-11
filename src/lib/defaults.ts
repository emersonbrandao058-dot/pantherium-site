import type {
  HeroData,
  AboutData,
  TimelineItem,
  IdentityData,
  ContactData,
} from "@/types";

export const defaultHero: HeroData = {
  badge: "Atlética de Enfermagem · UNEF",
  title: "PANTHERIUM",
  subtitle: "Força · Sabedoria · União",
  tagline: "A força da pantera. A sabedoria da cobra. O poder da enfermagem.",
  secondaryText:
    "Somos mais que uma atlética. Somos a identidade de uma geração que cuida, luta e vence.",
  logoUrl: "",
};

export const defaultAbout: AboutData = {
  title: "Quem Somos",
  text1:
    "A Pantherium é a Atlética de Enfermagem da UNEF, nascida da paixão de estudantes que acreditam que a vida universitária vai muito além das salas de aula. Somos movimento, esporte, cultura e comunidade.",
  text2:
    "Representamos a força da pantera e a sabedoria da cobra — símbolos que carregamos com orgulho e que definem quem somos: guerreiros do cuidado, atletas da vida, unidos por um propósito maior.",
};

export const defaultTimeline: TimelineItem[] = [
  {
    id: "1",
    year: "2019",
    title: "Fundação",
    description:
      "A Pantherium foi fundada por um grupo de estudantes visionários do curso de Enfermagem da UNEF.",
    order: 1,
  },
  {
    id: "2",
    year: "2020",
    title: "Primeiros Campeonatos",
    description:
      "Mesmo diante da pandemia, nos reinventamos e fortalecemos nossos laços como comunidade.",
    order: 2,
  },
  {
    id: "3",
    year: "2021",
    title: "Crescimento",
    description:
      "Expandimos nossas modalidades esportivas e conquistamos novos títulos para a história da atlética.",
    order: 3,
  },
  {
    id: "4",
    year: "2022",
    title: "Nova Identidade",
    description:
      "Redesenhamos nossa identidade visual e consolidamos os símbolos da pantera e da cobra.",
    order: 4,
  },
  {
    id: "5",
    year: "2023",
    title: "Consolidação",
    description:
      "Tornamo-nos referência entre as atléticas universitárias da região, com presença marcante nos campeonatos.",
    order: 5,
  },
];

export const defaultIdentity: IdentityData = {
  pantherTitle: "A Pantera",
  pantherText:
    "Símbolo de força, agilidade e determinação. A pantera representa o espírito combativo dos nossos atletas, sempre prontos para superar qualquer desafio com garra e precisão.",
  pantherImageUrl: "",
  snakeTitle: "A Cobra",
  snakeText:
    "Símbolo de sabedoria, cura e renovação — diretamente ligada à enfermagem. A cobra representa o conhecimento e a dedicação ao cuidar, pilares que nos definem como estudantes e profissionais.",
  snakeImageUrl: "",
  centerArtUrl: "",
  unionText:
    "Juntos, a pantera e a cobra formam a essência da Pantherium: força para lutar, sabedoria para cuidar.",
};

export const defaultContact: ContactData = {
  instagram: "@pantherium",
  email: "pantherium@unef.edu.br",
  cta: "Faça parte da nossa história",
  finalText:
    "Entre em contato e venha fazer parte de algo maior. A Pantherium é para todos que acreditam no poder da união.",
};
