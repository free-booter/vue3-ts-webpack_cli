<template>
  <div>
    <h2>环境变量测试</h2>
    <p>当前环境: {{ env }}</p>
  </div>
</template>

<script setup lang="ts">
const env = process.env.NODE_ENV;
</script> 