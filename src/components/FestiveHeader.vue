<template>
  <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span class="text-2xl">🎄</span>
        <span class="text-xl font-bold text-foreground">Quiz Festif</span>
        <span class="text-2xl">🎅</span>
      </router-link>
      
      <nav class="flex items-center gap-4">
        <router-link 
          to="/dashboard" 
          class="text-muted-foreground hover:text-foreground transition-colors"
          v-if="authStore.isAuthenticated"
        >
          Mes Quiz
        </router-link>
        <router-link 
          to="/messages" 
          class="text-muted-foreground hover:text-foreground transition-colors"
          v-if="authStore.isAuthenticated"
        >
          Messages
        </router-link>
        <button 
          @click="handleLogout"
          class="btn text-white bg-red-700 hover:text-foreground inline-flex items-center transition-colors"
          v-if="authStore.isAuthenticated"
        >
          <LogOut class="w-4 h-4 mr-2" />
          Out
        </button>
        <router-link to="/login" class="btn btn-ghost" v-else>
          Connexion
        </router-link>
        <!-- <router-link to="/signup" class="btn btn-primary" v-else>
          Inscription
        </router-link> -->
      </nav>
    </div>
  </header>
</template>

<script setup>
import { LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>
