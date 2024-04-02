import { Enemy, EnemyTypes } from '../../../shared/src';

export const ENEMIES_MOCK: Enemy[] = [
  {
    _id: 1,
    name: 'Enemy1',
    type: EnemyTypes.BEAST,
    attributes: [],
  },
  {
    _id: 2,
    name: 'Enemy2',
    type: EnemyTypes.HUMANOID,
    attributes: [],
  },
  {
    _id: 3,
    name: 'Enemy3',
    type: EnemyTypes.DEMON,
    attributes: [],
  },
];
