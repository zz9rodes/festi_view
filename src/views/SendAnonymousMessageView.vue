<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-md mx-auto px-4 py-16">
      <div class="card">
        <div class="text-center mb-8">
          <div class="text-4xl mb-4">🤫</div>
          <h1 class="text-2xl font-bold text-foreground">Message Secret</h1>
          <p class="text-muted-foreground mt-2">
            Envoyez un message anonyme à cet utilisateur. Il ne saura pas qui vous êtes !
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="success" class="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
            <p class="text-green-600 dark:text-green-400 font-medium">Message envoyé avec succès ! 🕵️‍♂️</p>
            <button @click="resetForm" class="text-sm text-primary hover:underline mt-2">
              Envoyer un autre message
            </button>
          </div>

          <template v-else>
            <div>
              <label for="content" class="block text-sm font-medium text-foreground mb-2">
                Votre message
              </label>
              <textarea
                id="content"
                v-model="content"
                required
                rows="5"
                class="input min-h-[120px] resize-none"
                placeholder="Écrivez quelque chose de gentil (ou de mystérieux)..."
                maxlength="1000"
              ></textarea>
              <p class="text-xs text-muted-foreground text-right mt-1">
                {{ content.length }}/1000
              </p>
            </div>

            <div v-if="messagesStore.error" class="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p class="text-sm text-destructive">{{ messagesStore.error }}</p>
            </div>

            <button 
              type="submit" 
              :disabled="messagesStore.loading || !content.trim()"
              class="btn btn-primary w-full py-3"
            >
              <Loader2 v-if="messagesStore.loading" class="w-4 h-4 mr-2 animate-spin" />
              {{ messagesStore.loading ? 'Envoi en cours...' : 'Envoyer anonymement' }}
            </button>
          </template>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { useMessagesStore } from '@/stores/messages'

const route = useRoute()
const messagesStore = useMessagesStore()

const content = ref('')
const success = ref(false)

async function handleSubmit() {
  const userId = route.params.userId
  if (!userId) return

  const result = await messagesStore.sendMessage(userId, content.value)
  if (result) {
    success.value = true
    content.value = ''
  }
}

function resetForm() {
  success.value = false
  content.value = ''
}
</script>
