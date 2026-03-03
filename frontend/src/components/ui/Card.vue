<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 v-if="title" class="text-lg font-medium text-gray-900">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="mt-1 text-sm text-gray-500">
            {{ subtitle }}
          </p>
        </div>
        <div v-if="$slots.header">
          <slot name="header" />
        </div>
      </div>
    </div>

    <div :class="contentClasses">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'default',
    validator: (value) => ['none', 'sm', 'default', 'lg'].includes(value)
  },
  shadow: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: true
  }
})

const cardClasses = computed(() => {
  const classes = ['bg-white rounded-lg']

  if (props.shadow) classes.push('shadow')
  if (props.border) classes.push('border border-gray-200')

  return classes.join(' ')
})

const contentClasses = computed(() => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  }

  return paddingClasses[props.padding]
})
</script>
