<template>
  <button
    type="button"
    class="text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
    :class="{
      'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50':
        !unstyled,
      '!bg-brand hover:!bg-brand-600 !text-white !border-transparent':
        variant === 'primary',
      '!text-brand !bg-white hover:!bg-gray-50': variant === 'secondary',
    }"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  unstyled?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>
