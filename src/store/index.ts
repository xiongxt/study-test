import Vue from "vue";
import Vuex from "../f-vuex/index";

Vue.use(Vuex);

export function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

const store = Vuex.createStore(
  { count: 0, name: "count" },
  {
    doubleCount(state) {
      return state.count * 2;
    },
    namedCount(state) {
      return (name: string) => {
        return name + state.count;
      };
    },
  }
);

const dispatchAddCount = store.createAction<number>(async (state, paylod) => {
  await sleep(2000);
  commitCount(state.count + paylod);
});

const commitCount = store.createCommit<number>((state, paylod) => {
  state.count = paylod;
});

export default store;

export { dispatchAddCount };
