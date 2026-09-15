// Real example sites shown from the header's "Примеры" dropdown — just add
// an entry here to list another one, no other wiring needed.
export interface ExampleLink {
  label: string;
  description: string;
  url: string;
}

export const EXAMPLE_LINKS: ExampleLink[] = [
  {
    label: 'Музыкальный подарок',
    description: 'Плеер с фото и песней-посвящением',
    url: 'https://elmir-present-two.vercel.app/',
  },
  {
    label: 'Открытка-письмо',
    description: 'Фото и тёплые строки с подписью',
    url: 'https://aidar-present.vercel.app/',
  },
];
