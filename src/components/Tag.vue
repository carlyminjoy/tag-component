<template>
  <div
    class="tag"
    :style="colors"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <span>{{ tag.title }}</span>

    <transition name="slide">
      <template v-if="hover">
        <b-icon
          @click="deleteTag"
          icon="x"
          aria-hidden="true"
        ></b-icon>
      </template>
    </transition>

    <span @click="deleteTag" class="sr-only">Delete</span>
  </div>
</template>

<script>
export default {
  name: "Tag",
  props: {
    tag: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    colors() {
      return {
        background: this.tag.color.background,
        border: `1px solid ${this.tag.color.text}`,
        color: this.tag.color.text,
      };
    },
  },
  methods: {
    async deleteTag() {
      this.$emit("delete", this.tag.uuid);
    },
  },
};
</script>

<style lang="scss" scoped>
.tag {
  border-radius: 1.6rem;
  padding: 0.4rem 1rem;
  font-weight: 700;
  margin-right: 0.75rem;
  margin-bottom: 0.75rem;
  line-height: 1.5rem;
  display: flex;
  align-items: center;
  cursor: default;

  .b-icon {
    margin-left: 0.25rem;
    margin-right: -0.25rem;
    font-size: 1.25rem;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
      filter: brightness(0.8);
    }
  }
}
</style>
