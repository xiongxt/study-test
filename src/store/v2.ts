import Vue from "vue";
import Vuex from "../f-vuex/v2";

Vue.use(Vuex);

export function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

const countStore = Vuex.createModule(
  { count: 0, name: "count" },
  {
    doubleCount(state) {
      return state.count * 2;
    },
    namedCount(state, getters) {
      return (name: string) => {
        return state.count + name + getters.doubleCount;
      };
    },
  }
);

const otherCount = Vuex.createModule({
  count: 1,
});

const dispatchAddCount = countStore.createAction<number>(
  async (state, paylod) => {
    await sleep(2000);
    commitCount(state.count + paylod);
    commitOtherCount(state.count + paylod);
  }
);

const commitOtherCount = otherCount.createCommit<number>((state, paylod) => {
  state.count = paylod;
});

const commitCount = countStore.createCommit<number>((state, paylod) => {
  state.count = paylod;
});

export { dispatchAddCount, otherCount, countStore };
