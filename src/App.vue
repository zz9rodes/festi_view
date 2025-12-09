<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Snowflakes decoration -->
    <div class="snowflakes" aria-hidden="true">
      <span
        v-for="i in 10"
        :key="i"
        class="snowflake"
        :style="{
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 2}s`,
        }"
      >
        ❄
      </span>
    </div>
    
    <router-view />
  </div>
</template>

<script setup>
</script>
