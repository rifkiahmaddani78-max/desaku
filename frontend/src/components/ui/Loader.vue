<template>
  <div :class="loaderClasses">
    <svg :class="spinnerClasses" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span v-if="text" :class="textClasses">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  centered: {
    type: Boolean,
    default: false
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})

const loaderClasses = computed(() => {
  const classes = ['flex items-center']

  if (props.centered) {
    classes.push('justify-center')
  }

  if (props.fullScreen) {
    classes.push('fixed inset-0 z-50 bg-white bg-opacity-75')
  }

  return classes.join(' ')
})

const spinnerClasses = computed(() => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return ['animate-spin', sizeClasses[props.size]].join(' ')
})

const textClasses = computed(() => {
  const sizeClasses = {
    sm: 'ml-2 text-sm',
    md: 'ml-3 text-base',
    lg: 'ml-4 text-lg',
    xl: 'ml-5 text-xl'
  }

  return ['text-gray-700', sizeClasses[props.size]].join(' ')
})
</script>
