import { VueConstructor } from "vue";

let Vue: VueConstructor;
let storeManager: StoreManager;

type AnyObject = Record<string, unknown>;

class StoreManager {
  reacitveWrap = new Vue<{ $$state: AnyObject }, AnyObject, AnyObject, never>({
    data() {
      return {
        $$state: {},
      };
    },
  });

  get state() {
    return (this.reacitveWrap as any)._data.$$state;
  }
}

interface Action<Payload> {
  (payload: Payload): void;
}

interface InnerAction<State, Payload> {
  (state: State, payload: Payload): void;
}

export class Store<State> {
  namespace = "";

  constructor(namespace: string, defaultState: State) {
    this.namespace = namespace;
    Vue.set(
      (storeManager.reacitveWrap._data as any).$$state,
      namespace,
      defaultState
    );
  }

  get state(): State {
    return storeManager.state[this.namespace] as State;
  }

  createAction<Payload = any>(
    cb: InnerAction<State, Payload>
  ): Action<Payload> {
    const func = async function (this: Store<State>, payload: Payload) {
      return await cb(this.state, payload);
    }.bind(this);
    return func;
  }
}

function install(_Vue: VueConstructor): void {
  Vue = _Vue;
  storeManager = new StoreManager();
}

function createStore<State extends Record<string, unknown>>(
  namespace: string,
  defaultState: State
): Store<State> {
  return new Store(namespace, defaultState);
}

export default {
  install,
  Store,
  createStore,
};
