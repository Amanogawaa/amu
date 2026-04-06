export const vueTemplate = {
  files: {
    "/src/App.vue": `<template>
  <div class="app">
    <h1>Hello Vue!</h1>
    <p>Start building your component here.</p>
    
    <div class="info">
      <p>✨ You can use:</p>
      <ul>
        <li>Vue Composition API (ref, reactive, computed)</li>
        <li>Vue Options API</li>
        <li>Single File Components (SFC)</li>
        <li>External packages</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Your Vue logic here
const message = ref('Welcome to Vue 3!');
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #2d2d2d;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

h1 {
  color: #42b883;
  margin-top: 0;
}

.info {
  margin-top: 2rem;
  padding: 1rem;
  background: #1e1e1e;
  border-radius: 4px;
  border-left: 4px solid #42b883;
}

ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

li {
  margin: 0.5rem 0;
}
</style>`,
    "/src/main.js": `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');`,
  },
  dependencies: {
    vue: "^3.3.0",
  },
};

/**
 * Vue starter code for exercise lessons
 */
export const vueExerciseStarter = `<template>
  <div>
    <h1>Exercise</h1>
    <!-- TODO: Complete the exercise -->
  </div>
</template>

<script setup>
// Your code here
</script>

<style scoped>
/* Your styles here */
</style>`;
