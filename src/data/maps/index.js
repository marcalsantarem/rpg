import { cinzalva, cabana, pousada, loja, capela, casa_anciao } from './cinzalva.js';
import { bosque } from './bosque.js';
import { caverna1, caverna2 } from './caverna.js';
import { mata1, mata2 } from './mata.js';

export const MAPS = { cinzalva, cabana, pousada, loja, capela, casa_anciao, bosque, caverna1, caverna2, mata1, mata2 };

export const MAP_NAMES = Object.fromEntries(Object.values(MAPS).map((m) => [m.id, m.name]));
