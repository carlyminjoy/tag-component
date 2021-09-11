<template>
  <b-overlay :show="loading" spinner-large rounded="sm">
    <b-card
      title="Tags"
      class="tag-picker p-3"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div class="tags">
        <tag
          v-for="(tag, i) in userTags"
          :key="i"
          :tag="tag"
          @delete="deleteTag"
        />

        <transition name="fade">
          <template v-if="(hover || adding) && !loading">
            <div v-if="!adding" class="add-tag-container">
              <div class="add-tag" @click="showNewTagInput">
                <b-icon icon="plus" aria-hidden="true"></b-icon>
                <span class="sr-only">Add</span>
              </div>
              <span class="hover-text" aria-hidden="true">ADD</span>
            </div>
            <div class="new-tag" v-if="adding">
              <b-form-input
                ref="newTagInput"
                v-model="newTag"
                @keyup.enter="addTag(newTag)"
                @blur="closeDropdown"
                aria-label="New tag title"
              ></b-form-input>
              <ul v-if="newTag !== ''" class="shadow">
                <li
                  v-for="(guess, i) in guesses"
                  :key="i"
                  @click="addTag(guess.title)"
                  role="button"
                >
                  {{ guess.title }}
                </li>
                <li @click="addTag(newTag)" role="button">
                  <b-icon icon="plus" :aria-hidden="true"></b-icon>
                  CREATE TAG
                </li>
              </ul>
            </div>
          </template>
        </transition>
      </div>
    </b-card>
  </b-overlay>
</template>

<script>
import Tag from "./Tag.vue";
import {
  fetchTags,
  createTag,
  // fetchUser,
  fetchUserTags,
  assignUserTag,
  removeUserTag,
} from "../api.js";

export default {
  name: "TagPicker",
  components: { Tag },
  props: {
    userUuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      allTags: [],
      userTags: [],
      newTag: "",
      adding: false,
      hover: false,
      loading: false,
    };
  },
  async mounted() {
    await this.getTags();
  },
  computed: {
    guesses() {
      if (this.newTag === "") return [];

      return this.allTags.filter(
        (tag) =>
          tag.title
            .toLowerCase()
            .includes(this.newTag.toLowerCase()) &&
          !this.userTags.includes(tag)
      );
    },
  },
  methods: {
    async addTag(newTag) {
      if (newTag === "") return;
      this.loading = true;

      const newUserTag =
        this.allTags.find((t) => newTag === t.title) ||
        (await createTag(newTag));

      // As we're not waiting on a response & there's
      // no error handling, we won't await this
      // to save on loading time :)
      assignUserTag(this.userUuid, newUserTag.uuid);
      this.userTags.push(newUserTag);

      if (!this.allTags.map((tag) => tag.title).includes(newTag)) {
        this.allTags.push(newUserTag);
      }

      this.newTag = "";
      this.adding = false;
      this.loading = false;
    },
    deleteTag(tagUuid) {
      this.loading = true;

      // As we're not waiting on a response & there's
      // no error handling, we won't await this
      // to save on loading time :)
      removeUserTag(this.userUuid, tagUuid);
      const deleteIdx = this.userTags.findIndex((tag) => {
        return tag.uuid === tagUuid;
      });
      this.userTags.splice(deleteIdx, 1);

      this.loading = false;
    },
    async getTags() {
      this.loading = true;

      this.allTags = await fetchTags();
      const userTags = await fetchUserTags(this.userUuid);
      this.userTags = userTags.map((ut) =>
        this.allTags.find((t) => t.uuid === ut)
      );

      this.loading = false;
    },
    closeDropdown() {
      // Ensure we don't trigger blur if already typing
      // or selecting a tag to add
      if (this.newTag !== "") return;
      this.adding = false;
    },
    showNewTagInput() {
      this.adding = true;
      this.$nextTick(() => {
        this.$refs.newTagInput.focus();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/colors.scss";

.tag-picker {
  border: none;
  min-height: 9.5rem;

  .card-title {
    font-weight: 700;
    margin-bottom: 0;
  }

  .tags {
    margin-top: 1.5rem;
    display: flex;
    flex-wrap: wrap;
  }

  .add-tag-container {
    border: none;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    .hover-text {
      margin-left: 0.5rem;
      opacity: 0;
      transition: 0.3s ease;
      font-weight: 700;
      font-size: 0.875rem;
      color: $medpurple;
      letter-spacing: 1px;
    }

    &:hover {
      .hover-text {
        opacity: 1;
      }
    }
  }

  .add-tag {
    border-radius: 50%;
    width: auto;
    display: flex;
    align-content: center;
    justify-content: center;
    background: $offwhite;
    width: 2.375rem;
    color: $lightgray;
    border: 1px solid $offwhite;
    padding: 0.125rem;
    cursor: pointer;
    transition: 0.3s ease;
    height: 2.375rem;

    &:hover {
      color: $medpurple;
      border: 1px solid $lightgray;
    }

    .b-icon {
      width: 2rem;
      height: 2rem;
    }
  }

  .new-tag {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: stretch;

    input {
      border-radius: 1.6rem;
      border: 1px solid $lightgray;
      height: 2.375;
      width: 15.625rem;
    }

    ul {
      width: 15.625rem;
      border: 1px solid $purple;
      position: absolute;
      top: 3rem;
      border-radius: 1.6rem;
      list-style-type: none;
      background: $white;
      padding-inline-start: 0;
      padding: 0.5rem 0.25rem;

      li {
        border-radius: 1.6rem;
        margin: 0 0.25rem 0.25rem 0.25rem;
        padding: 0.5rem 0.75rem;
        display: flex;
        align-content: center;
        line-height: 1rem;
        font-weight: 700;
        color: $lightgray;
        transition: 0.3s cubic-bezier(0.2, 0, 0.1, 1);
        cursor: pointer;

        &:hover {
          background: $offwhite;
          color: $medpurple;
        }

        &:last-child {
          padding: 0.25rem;
          margin-bottom: 0;
          letter-spacing: 1px;
          line-height: 1.75rem;
          font-size: 0.875rem;
          color: $medpurple;
        }

        .b-icon {
          height: 1.5rem;
          width: 1.5rem;
          background: $offwhite;
          border-radius: 50%;
          margin-right: 0.75rem;
          color: $medpurple;
          font-weight: 700;
        }
      }
    }
  }
}
</style>

<style lang="scss">
@import "@/scss/colors.scss";

span.spinner-border {
  border-top-color: $purple;
  border-bottom-color: $purple;
  border-left-color: $purple;
}

div.card-body {
  padding: 0.75rem 0.75rem 0.25rem 0.75rem;
}
</style>
