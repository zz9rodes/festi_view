<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-md mx-auto px-4 py-16">
      <div class="card">
        <div class="text-center mb-8">
          <div class="text-4xl mb-4">🎉</div>
          <h1 class="text-2xl font-bold text-foreground">Inscription</h1>
          <p class="text-muted-foreground mt-2">
            Créez votre compte pour commencer
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="displayName" class="block text-sm font-medium text-foreground mb-2">
              Nom d'affichage
            </label>
            <input
              id="displayName"
              v-model="displayName"
              type="text"
              required
              class="input"
              placeholder="Votre prénom"
            />
          </div>

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
              minlength="6"
              class="input"
              placeholder="••••••••"
            />
            <p class="text-xs text-muted-foreground mt-1">
              Minimum 6 caractères
            </p>
          </div>

          <div v-if="authStore.error" class="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p class="text-sm text-destructive">{{ authStore.error }}</p>
          </div>

          <button 
            type="submit" 
            :disabled="authStore.loading"
            class="btn btn-primary w-full py-3"
          >
            <Loader2 v-if="authStore.loading" class="w-4 h-4 mr-2 animate-spin" />
            {{ authStore.loading ? 'Inscription...' : "S'inscrire" }}
          </button>
        </form>

        <p class="text-center text-muted-foreground mt-6">
          Déjà un compte ?
          <router-link to="/login" class="text-primary hover:underline">
            Connectez-vous
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

const displayName = ref('')
const email = ref('')
const password = ref('')

async function handleSubmit() {
  const success = await authStore.signup(email.value, password.value, displayName.value)
  if (success) {
    router.push('/signup-success')
  }
}
</script>
