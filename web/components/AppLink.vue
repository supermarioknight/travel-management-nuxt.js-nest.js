<template>
  <NuxtLink :to="to">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts" generic="N extends RoutesNamesList">
import type { RoutesParamsRecord, RoutesNamesList } from '@typed-router';

const props = defineProps<{
  name: N;
  params: RoutesParamsRecord[N] extends never ? null : RoutesParamsRecord[N];
}>();

const to = computed(() => ({
  name: props.name,
  params: props.params as RoutesParamsRecord[N],
}));
</script>
