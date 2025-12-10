<template>
  <header class="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span class="text-2xl">🎄</span>
        <span class="text-xl font-bold text-foreground">Quiz Festif</span>
        <span class="text-2xl">🎅</span>
      </router-link>
      
      <nav class="flex items-center gap-2 md:gap-4">
        <template v-if="authStore.isAuthenticated">
          <router-link 
            to="/dashboard" 
            class="btn btn-ghost flex items-center"
            title="Mes Quiz"
          >
            <LayoutDashboard class="w-5 h-5 md:mr-2" />
            <span class="hidden md:inline">Mes Quiz</span>
          </router-link>
          
          <router-link 
            to="/messages" 
            class="btn btn-ghost flex items-center"
            title="Messages"
          >
            <MessageSquare class="w-5 h-5 md:mr-2" />
            <span class="hidden md:inline">Messages</span>
          </router-link>
          
          <router-link 
            to="/profile" 
            class="btn btn-ghost flex items-center"
            title="Mon Profil"
          >
            <User class="w-5 h-5 md:mr-2" />
            <span class="hidden md:inline">Mon Profil</span>
          </router-link>

          <button 
            @click="handleLogout"
            class="btn bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center"
            title="Déconnexion"
          >
            <LogOut class="w-4 h-4 md:mr-2" />
            <span class="hidden md:inline">Out</span>
          </button>
        </template>

        <router-link to="/login" class="btn btn-ghost" v-else>
          Connexion
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { LogOut, LayoutDashboard, MessageSquare, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>
