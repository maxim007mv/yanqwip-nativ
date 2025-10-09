export type WizardField =
  | 'start_time'
  | 'duration'
  | 'walk_type'
  | 'start_point'
  | 'budget'
  | 'preferences'
  | 'activities'
  | 'food'
  | 'transport'
  | 'limitations';

export interface WizardQuestion {
  id: number;
  field: WizardField;
  title: string;
  description: string;
  placeholder: string;
  suggestions?: string[];
}

export const ROUTE_WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 1,
    field: 'start_time',
    title: 'Когда начнём приключение?',
    description: 'Укажи желаемое время старта прогулки.',
    placeholder: 'Например: 11:00',
    suggestions: ['08:00', '10:00', '13:00', '16:00'],
  },
  {
    id: 2,
    field: 'duration',
    title: 'Сколько времени в твоём распоряжении?',
    description: 'Сколько часов хочешь посвятить маршруту.',
    placeholder: 'Например: 5 часов',
    suggestions: ['2 часа', '4 часа', '6 часов', 'Весь день'],
  },
  {
    id: 3,
    field: 'walk_type',
    title: 'Какую атмосферу ищем?',
    description: 'Выбери стиль прогулки — культурная, романтическая, активная и т.д.',
    placeholder: 'Например: культурная прогулка',
    suggestions: ['Культурная', 'Историческая', 'Романтическая', 'Семейная'],
  },
  {
    id: 4,
    field: 'start_point',
    title: 'Откуда стартуем?',
    description: 'Опиши удобную отправную точку или адрес.',
    placeholder: 'Например: метро Арбатская',
    suggestions: ['Красная площадь', 'Патриаршие пруды', 'ВДНХ'],
  },
  {
    id: 5,
    field: 'budget',
    title: 'Какой бюджет комфортен?',
    description: 'Эконом, средний, премиум — или укажи сумму.',
    placeholder: 'Например: до 3000 ₽',
    suggestions: ['Эконом', 'Средний', 'Премиум'],
  },
  {
    id: 6,
    field: 'preferences',
    title: 'Есть ли места мечты?',
    description: 'Если хочешь включить конкретные точки — укажи их.',
    placeholder: 'Например: Третьяковка, вкусные завтраки',
  },
  {
    id: 7,
    field: 'activities',
    title: 'Что хочется делать?',
    description: 'Расскажи про активности: музеи, прогулки, концерты, шоппинг.',
    placeholder: 'Например: прогулки по паркам, смотровые площадки',
  },
  {
    id: 8,
    field: 'food',
    title: 'Какая еда вдохновляет?',
    description: 'Предпочтения по кухне, формату, атмосфере.',
    placeholder: 'Например: кофейни с десертами',
    suggestions: ['Авторская кухня', 'Стритфуд', 'Вегетарианская', 'Кофейни'],
  },
  {
    id: 9,
    field: 'transport',
    title: 'Как будем передвигаться?',
    description: 'Пешком, такси, общественный транспорт — что удобно?',
    placeholder: 'Например: пешком и метро',
    suggestions: ['Пешком', 'Метро', 'Велосипед', 'Такси'],
  },
  {
    id: 10,
    field: 'limitations',
    title: 'Есть ли особые пожелания?',
    description: 'Расскажи про ограничения или важные нюансы.',
    placeholder: 'Например: без острых блюд, без лестниц',
  },
];
