import Vue from "vue";
import Vuex from "../f-vuex";

Vue.use(Vuex);

const store = Vuex.createStore("count", { count: 0 });

const addCount = store.createAction<number>((state, paylod) => {
  state.count += paylod;
});

export default store;

export { addCount };
