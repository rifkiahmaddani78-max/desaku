<template>
  <div class="sm:col-span-1">
    <dt class="text-sm font-medium text-gray-500">
      {{ label }}
    </dt>
    <dd class="mt-1 text-sm text-gray-900">
      <slot>{{ value || '-' }}</slot>
    </dd>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: ''
  }
})
</script>