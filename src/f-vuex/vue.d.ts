/**
 * Augment the typings of Vue.js
 */

// import Vue from "vue";
import { Store } from "./index";

type AnyObject = Record<string, unknown>;

declare module "vue/types/vue" {
  //   interface Vue {}
  //   interface VueConstructor<V extends Vue = Vue> {
  //     new <
  //       Data,
  //       Methods = AnyObject,
  //       Computed = AnyObject,
  //       PropNames extends string = never
  //     >(
  //       options?: ThisTypedComponentOptionsWithArrayProps<
  //         V,
  //         Data,
  //         Methods,
  //         Computed,
  //         PropNames
  //       >
  //     ): CombinedVueInstance<V, Data, Methods, Computed, Record<PropNames, any>>;
  //   }
}

declare module "vue/types/options" {
  interface ComponentOptions {
    store?: Store;
  }
}
