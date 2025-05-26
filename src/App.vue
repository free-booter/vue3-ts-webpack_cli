<script setup lang="ts">
import axios from 'axios';
import EnvTest from './components/EnvTest.vue';

const handleData = () => {
  const env = process.env.NODE_ENV;
  const apiUrl = process.env.APP_API_URL;
  
  if(env === 'development'){
    axios.get(`${apiUrl}/posts`).then(res => {
      console.log(res);
    })
  }else{
    axios.get(`${apiUrl}/breeds/image/random`).then(res => {
      console.log(res);
    })
  }
};
</script>

<template>
  <div class="container">
    <h1>App vue</h1>
    <button @click="handleData">获取环境变量</button>
    <EnvTest />
  </div>
</template>

<style lang="scss" scoped>
.container {
  color: red;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  h1 {
    background-color: palegoldenrod;
  }
}
</style>
