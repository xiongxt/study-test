import { VueConstructor } from "vue";
import {
  ReturnTypes,
  Getter,
  VueGetters,
  InnerAction,
  Action,
  InnerCommit,
  Commit,
} from "./type";

let Vue: VueConstructor;

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`[vuex] ${msg}`);
}

export class Store<State, Getters extends Record<string, Getter<State>>> {
  #defaultState?: State = undefined;
  #vm?: InstanceType<VueConstructor> = undefined;
  #commiting = false;

  getters: ReturnTypes<Getters> = {} as ReturnTypes<Getters>;

  constructor(defaultState: State, getters?: Getters) {
    this.#defaultState = defaultState;
    if (getters) {
      this.wrapGetters(getters);
    }

    this.#vm = new Vue({
      data: {
        $$state: defaultState,
      },
      computed: (getters || {}) as VueGetters,
    });

    for (const name in getters || {}) {
      if (name) {
        Object.defineProperty(this.getters, name, {
          get: () => (this.#vm as any)[name],
          enumerable: true,
        });
      }
    }

    (this.#vm as any).$watch(
      function (this: any) {
        return this._data.$$state;
      },
      () => {
        assert(
          this.#commiting,
          `do not mutate vuex store state outside mutation handlers.`
        );
      },
      { deep: true, sync: true }
    );
  }

  private wrapGetters(getters: Getters) {
    for (const name in getters || {}) {
      if (name) {
        const getter = getters[name];
        getters[name] = getter.bind(this, this.state) as any;
      }
    }
  }

  get state(): State {
    if (this.#vm) {
      return (this.#vm as any)._data.$$state;
    }
    return this.#defaultState!;
  }

  createAction<Payload = any>(
    callback: InnerAction<State, Payload>
  ): Action<Payload> {
    const func = async function (
      this: Store<State, Getters>,
      payload: Payload
    ) {
      return await callback(this.state, payload);
    }.bind(this);
    return func;
  }

  createCommit<Payload = any>(
    callback: InnerCommit<State, Payload>
  ): Commit<Payload> {
    const func = function (this: Store<State, Getters>, payload: Payload) {
      this.#commiting = true;
      callback(this.state, payload);
      this.#commiting = false;
    }.bind(this);
    return func;
  }
}

function install(_Vue: VueConstructor): void {
  Vue = _Vue;
}

function createStore<
  State extends Record<string, unknown>,
  Getters extends Record<string, Getter<State>>
>(defaultState: State, getters?: Getters): Store<State, Getters> {
  return new Store(defaultState, getters);
}

export default {
  install,
  Store,
  createStore,
};
