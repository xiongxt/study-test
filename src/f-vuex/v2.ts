import { VueConstructor } from "vue";
import {
  AnyObject,
  ReturnTypes,
  InnerAction,
  Action,
  InnerCommit,
  Commit,
} from "./type";

let Vue: VueConstructor;
let storeInstance: Store;

interface Getter<State> {
  (state: State, getters: any): any;
}

const getUUID = (() => {
  let timestamp = new Date().getTime();
  return () => {
    timestamp += 1;
    return `uuid_${timestamp}`;
  };
})();

function deepCopy(json: AnyObject = {}) {
  return JSON.parse(JSON.stringify(json));
}

const devtoolHook = (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__;

function emitHook(order: string, args: any[]) {
  if (devtoolHook) {
    devtoolHook.emit(order, ...args);
  }
}

class Store {
  private modules = new Map<string, Module>();
  private _mutations: any = {};
  public _vm?: InstanceType<VueConstructor>;

  constructor() {
    this.resetVM();
  }

  get state() {
    return (this._vm as any)._data.$$state;
  }

  addModule(module: Module<any, any>) {
    this.modules.set(module.uuid, module);
    this.resetVM();
    emitHook("vuex:init", [this]);
  }

  addMutations(name: string, cb: any) {
    this._mutations[name] = cb;
  }

  partial(fn: (...args: any[]) => any, module: Module) {
    return function () {
      return fn(module.state, module.getters);
    };
  }

  resetVM() {
    const oldVM = this._vm;
    let oldState: any = {};
    const state: any = {};
    const computed: any = {};
    if (oldVM) {
      oldState = deepCopy(this.state);
    }

    this.modules.forEach((module, moduleName) => {
      state[moduleName] = oldState[moduleName] ?? module.state;
      for (const getterName in module.renamedGetters) {
        computed[getterName] = this.partial(
          module.renamedGetters[getterName],
          module
        );
      }
    });
    this._vm = new Vue({
      data: {
        $$state: state,
      },
      computed,
    });
    if (oldVM) {
      oldVM.$destroy();
    }
  }

  replaceState(state: AnyObject) {
    (this._vm as any)._data.$$state = state;
  }
}

export class Module<
  State = any,
  Getters extends Record<string, Getter<State>> = any
> {
  public uuid: string;
  public renamedGetters?: Getters;
  private defaultState: State;
  public getters: ReturnTypes<Getters>;

  constructor(defaultState: State, getters?: Getters) {
    getters = getters ?? ({} as Getters);
    this.defaultState = defaultState;
    this.uuid = getUUID();
    this.getters = {} as ReturnTypes<Getters>;
    this.proxyGetters(getters!);
    this.renamedGetters = this.renameGetters(getters!);
    storeInstance.addModule(this);
  }

  private renameGetters(getters: Getters): Getters {
    const newGetters: AnyObject = {};
    for (const name in getters || {}) {
      newGetters[`${this.uuid}/${name}`] = getters[name];
    }
    return newGetters as Getters;
  }

  private proxyGetters(getters: Getters) {
    for (const name in getters || {}) {
      if (name) {
        Object.defineProperty(this.getters, name, {
          get: () => {
            return (storeInstance._vm as any)[`${this.uuid}/${name}`];
          },
          enumerable: true,
        });
      }
    }
  }

  public get state(): State {
    return (storeInstance.state[this.uuid] as State) ?? this.defaultState;
  }

  public createAction<Payload = any>(
    callback: InnerAction<State, Payload>
  ): Action<Payload> {
    const func = async function (
      this: Module<State, Getters>,
      payload: Payload
    ) {
      return await callback(this.state, payload);
    }.bind(this);
    return func;
  }

  public createCommit<Payload = any>(
    callback: InnerCommit<State, Payload>,
    order?: string
  ): Commit<Payload> {
    const func = function (this: Module<State, Getters>, payload: Payload) {
      callback(this.state, payload);
      emitHook("vuex:mutation", [
        {
          type: `${this.uuid}/${order ?? "commit"}`,
          payload: payload,
        },
      ]);
    }.bind(this);
    return func;
  }
}

function install(_Vue: VueConstructor): void {
  Vue = _Vue;
  storeInstance = new Store();
}

function createModule<State, Getters extends Record<string, Getter<State>>>(
  defaultState: State,
  getters?: Getters
): Module<State, Getters> {
  return new Module(defaultState, getters);
}

export default {
  install,
  createModule,
};
