<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    {{ count }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import countStore, { addCount } from "@/store";

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  get count(): number {
    return countStore.state.count;
  }

  created(): void {
    setInterval(() => {
      addCount(1);
    }, 1000);
  }
}
</script>
