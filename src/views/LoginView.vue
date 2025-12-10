<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-md mx-auto px-4 py-16">
      <div class="card">
        <div class="text-center mb-8">
          <div class="text-4xl mb-4">🔐</div>
          <h1 class="text-2xl font-bold text-foreground">Connexion</h1>
          <p class="text-muted-foreground mt-2">
            Accédez à votre espace quiz festif
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-foreground mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="input"
              placeholder="••••••••"
            />
          </div>

          <div v-if="authStore.error" class="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p class="text-sm text-destructive">{{ authStore.error }}</p>
          </div>

          <button 
            type="submit" 
            :disabled="authStore.loading"
            class="btn btn-primary w-full py-3 inline-flex justify-center items-center"
          >
            <Loader2 v-if="authStore.loading" class="w-4 h-4 mr-2 animate-spin" />
            {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <p class="text-center text-muted-foreground mt-6">
          Pas encore de compte ?
          <router-link to="/signup" class="text-primary hover:underline">
            Inscrivez-vous
          </router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/dashboard')
  }
}
</script>
