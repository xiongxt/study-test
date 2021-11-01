export type AnyObject = Record<string, unknown>;

export interface Action<Payload> {
  (payload: Payload): void | Promise<void>;
}

export interface InnerAction<State, Payload> {
  (state: State, payload: Payload): void | Promise<void>;
}

export interface Commit<Payload> {
  (payload: Payload): void;
}

export interface InnerCommit<State, Payload> {
  (state: State, payload: Payload): void;
}

export interface Getter<State> {
  (state: State): any;
}

export type ReturnTypes<G extends Record<string, (...args: any) => any>> = {
  [K in keyof G]: ReturnType<G[K]>;
};

export type VueGetters = Record<string, (...args: any) => any>;
