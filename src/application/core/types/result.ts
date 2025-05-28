export type Result<T, E> =
  | {
      type: 'success';
      value: T;
    }
  | {
      type: 'error';
      throwable: E;
    };
