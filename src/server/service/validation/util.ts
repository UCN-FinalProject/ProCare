export type ReturnMany<T> = {
  result: T;
  limit: number;
  offset: number;
  total: number;
};
