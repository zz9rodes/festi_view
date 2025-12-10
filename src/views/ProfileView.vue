<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-2xl mx-auto px-4 py-8">
      <div class="card">
        <div class="text-center mb-8">
          <div class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-4xl">👤</span>
          </div>
          <h1 class="text-2xl font-bold text-foreground">Mon Profil</h1>
          <p class="text-muted-foreground mt-2">
            Gérez vos informations personnelles
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Public Key (Read Only) -->
          <div class="bg-muted/50 p-4 rounded-lg border border-border">
            <label class="block text-xs font-medium text-muted-foreground uppercase mb-1">
              Ma Clé Publique (ID)
            </label>
            <div class="flex items-center gap-2">
              <code class="flex-1 font-mono text-sm bg-background p-2 rounded border border-border">
                {{ authStore.user?.public_key || 'Non disponible' }}
              </code>
              <button 
                type="button"
                @click="copyPublicKey"
                class="btn btn-ghost btn-sm"
                title="Copier"
              >
                <Copy v-if="!copied" class="w-4 h-4" />
                <Check v-else class="w-4 h-4 text-green-500" />
              </button>
            </div>
            <p class="text-xs text-muted-foreground mt-2">
              Utilisez cette clé pour recevoir des messages anonymes.
            </p>
          </div>

          <!-- Editable Fields -->
          <div class="space-y-4">
            <div>
              <label for="displayName" class="block text-sm font-medium text-foreground mb-2">
                Nom d'affichage
              </label>
              <input
                id="displayName"
                v-model="form.display_name"
                type="text"
                required
                class="input"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="input"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div v-if="authStore.error" class="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p class="text-sm text-destructive">{{ authStore.error }}</p>
          </div>

          <div v-if="successMessage" class="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p class="text-sm text-green-600 dark:text-green-400">{{ successMessage }}</p>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-border">
            <button 
              type="submit" 
              :disabled="authStore.loading"
              class="btn btn-primary"
            >
              <Loader2 v-if="authStore.loading" class="w-4 h-4 mr-2 animate-spin" />
              {{ authStore.loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2, Copy, Check } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const copied = ref(false)
const successMessage = ref('')

const form = ref({
  display_name: '',
  email: ''
})

onMounted(() => {
  if (authStore.user) {
    form.value = {
      display_name: authStore.user.display_name,
      email: authStore.user.email
    }
  }
})

async function handleSubmit() {
  successMessage.value = ''
  const success = await authStore.updateProfile(form.value)
  if (success) {
    successMessage.value = 'Profil mis à jour avec succès !'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}

async function copyPublicKey() {
  if (!authStore.user?.public_key) return
  
  try {
    await navigator.clipboard.writeText(authStore.user.public_key)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
