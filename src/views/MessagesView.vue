<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-foreground">Mes Messages Secrets</h1>
          <p class="text-muted-foreground mt-1">
            Consultez les messages anonymes que vous avez reçus
          </p>
        </div>
        
        <div class="card py-2 px-4 inline-flex justify-center items-center gap-2 bg-muted/50">
          <!-- <span class="text-sm text-muted-foreground">Votre lien  :</span> -->
          <code class="text-xs bg-background px-2 py-1 rounded border border-border select-all">
            {{ shareLink }}
          </code>
          <button 
            @click="copyLink" 
            class="btn btn-ghost btn-sm h-8 w-8 p-0"
            title="Copier le lien"
          >
            <Copy v-if="!copied" class="w-4 h-4" />
            <Check v-else class="w-4 h-4 text-green-500" />
          </button>
        </div>
      </div>

      <div v-if="messagesStore.loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>

      <div v-else-if="messagesStore.messages.length === 0" class="card text-center py-12">
        <div class="text-6xl mb-4">📭</div>
        <h2 class="text-xl font-semibold text-foreground mb-2">
          Aucun message pour le moment
        </h2>
        <p class="text-muted-foreground mb-6">
          Partagez votre lien pour recevoir des messages anonymes !
        </p>
        <button @click="copyLink" class="btn btn-primary inline-flex justify-center items-center">
          <Copy class="w-4 h-4 mr-2" />
          Copier mon lien
        </button>
      </div>

      <div v-else class="grid gap-4">
        <div 
          v-for="message in messagesStore.messages" 
          :key="message.id"
          class="card hover:border-primary/50 transition-colors"
        >
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <p class="text-foreground whitespace-pre-wrap">{{ message.content }}</p>
              <p class="text-xs text-muted-foreground mt-4">
                Reçu le {{ formatDate(message.created_at) }}
              </p>
            </div>
            <button 
              @click="handleDelete(message.id)"
              class="text-muted-foreground hover:text-destructive transition-colors p-2 -mr-2"
              title="Supprimer"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Loader2, Copy, Check, Trash2 } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { useMessagesStore } from '@/stores/messages'
import { useAuthStore } from '@/stores/auth'

const messagesStore = useMessagesStore()
const authStore = useAuthStore()
const copied = ref(false)

const shareLink = computed(() => {
  const baseUrl = window.location.origin
  return `${baseUrl}/send/${authStore.user?.public_key}`
})

onMounted(() => {
  messagesStore.fetchMessages()
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

async function handleDelete(id) {
  if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
    await messagesStore.deleteMessage(id)
  }
}
</script>
