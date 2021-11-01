<template>
  <div class="home">
    other {{ dataCount }}/ {{ namedCount }}/
    {{ count }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { countStore, dispatchAddCount, otherCount } from "@/store/v2";
import { Action } from "vuex-class";
import { addCount, VuexStoreFunc } from "@/vuexStore";

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  get dataCount(): number {
    return otherCount.state.count;
  }

  get count(): number {
    return countStore.state.count;
  }

  get doubleCount(): number {
    return countStore.getters.doubleCount;
  }

  get namedCount(): string {
    return countStore.getters.namedCount("shawn");
  }

  @Action("addCount")
  private addCount!: VuexStoreFunc<typeof addCount>;

  async created(): Promise<void> {
    this.addCount(1);
    // new Array(100).fill(null).forEach(async () => {});
    await dispatchAddCount(1);
    await dispatchAddCount(1);
    await dispatchAddCount(1);
    await dispatchAddCount(1);
    await dispatchAddCount(1);
  }
}
</script>
