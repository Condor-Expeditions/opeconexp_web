// src/data/core/catalog.repository.ts
// Repository pattern para catálogos — factory genérico DRY

import type {
  Category,
  Region,
  Tag,
  MeetingPoint,
  Difficulty,
  Operator,
} from "./types";

type CatalogItem = Category | Region | Tag | MeetingPoint | Difficulty | Operator;

let _catalog: Record<string, CatalogItem[]> = {};

export function setCatalog(catalog: Record<string, CatalogItem[]>): void {
  _catalog = catalog;
}

function makeGetter<T extends CatalogItem>(key: string): {
  getAll: () => T[];
  getById: (id: string) => T | undefined;
} {
  return {
    getAll: () => (_catalog[key] as T[]) ?? [],
    getById: (id: string) =>
      (_catalog[key] as T[])?.find((c) => c.id === id),
  };
}

export const {
  getAll: getCategories,
  getById: getCategory,
} = makeGetter<Category>("categories");

export const {
  getAll: getRegions,
  getById: getRegion,
} = makeGetter<Region>("regions");

export const {
  getAll: getTags,
  getById: getTag,
} = makeGetter<Tag>("tags");

export const {
  getAll: getMeetingPoints,
  getById: getMeetingPoint,
} = makeGetter<MeetingPoint>("meetingPoints");

export const {
  getAll: getDifficulties,
  getById: getDifficulty,
} = makeGetter<Difficulty>("difficulties");

export const {
  getAll: getOperators,
  getById: getOperator,
} = makeGetter<Operator>("operators");