import Vue from "vue";
import Vuex, { Store, ActionContext } from "vuex";

Vue.use(Vuex);

type F = (...args: any[]) => any;

type RestParams<T extends F> = T extends (arg1: any, ...rest: infer P) => any
  ? P
  : never;

export interface VuexStoreFunc<T extends F> {
  (...args: RestParams<T>): ReturnType<T>;
}

interface State {
  count: number;
}

export function addCount(
  this: Store<State>,
  store: ActionContext<State, State>,
  count: number
): void {
  store.commit("setCount", store.state.count + count);
}

export default new Vuex.Store<State>({
  state: {
    count: 0,
  },
  actions: {
    addCount,
  },
  mutations: {
    setCount(state, payload) {
      state.count = payload;
    },
  },
});
