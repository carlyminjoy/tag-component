<template>
  <div id="app">
    <div class="container shadow">
      <TagPicker :userUuid="userUuid" />
    </div>
  </div>
</template>

<script>
import TagPicker from "./components/TagPicker.vue";

export default {
  name: "App",
  components: {
    TagPicker,
  },
  data() {
    return {
      userUuid: "1111-2222-3333-4444",
    };
  },
};
</script>

<style lang="scss">
@import "@/scss/colors.scss";
html {
  font-size: 14px;
}

#app {
  font-family: "objektiv-mk2", avenir;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $darkblue;
  margin-top: 6rem;
  line-height: 1.6;
  letter-spacing: 0em;
  padding: 0;

  .container {
    padding: 0;
    border-radius: 1.6rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: width 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  width: 0px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap; /* added line */
  border: 0;
}
</style>
