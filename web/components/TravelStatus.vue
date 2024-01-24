<template>
  <div
    :class="{
      'px-2.5 py-1 rounded-lg': true,
      'bg-red-50': !isPublic,
      'bg-green-50': isPublic,
    }"
  >
    <span
      :class="{
        'text-red-400': !isPublic,
        'text-green-500': isPublic,
        'font-medium': true,
      }"
    >
      {{ !isPublic ? 'Private' : 'Public' }}
    </span>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'TravelStatus',
  props: {
    isPublic: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, ctx) {
    const { isPublic } = toRefs(props);
    return {};
  },
});
</script>
