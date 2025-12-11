<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center gap-3 mb-8">
        <router-link to="/admin/users" class="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </router-link>
        <h1 class="text-3xl font-bold text-foreground">Détails utilisateur</h1>
      </div>

      <div v-if="loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>

      <template v-else-if="userData">
        <!-- User Info Card -->
        <div class="card mb-8">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                v-if="userData.user.avatar" 
                :src="userData.user.avatar" 
                :alt="userData.user.display_name" 
                class="w-full h-full object-cover"
              />
              <span v-else class="text-3xl">👤</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-2xl font-bold text-foreground">{{ userData.user.display_name }}</h2>
                <span v-if="userData.user.is_admin" class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  Admin
                </span>
              </div>
              <p class="text-muted-foreground">{{ userData.user.email }}</p>
              <code class="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                {{ userData.user.public_key }}
              </code>
            </div>
          </div>
        </div>

        <!-- Messages Section -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare class="w-5 h-5" />
            Messages reçus ({{ userData.messages?.length || 0 }})
          </h3>

          <div v-if="!userData.messages || userData.messages.length === 0" class="card text-center py-8">
            <p class="text-muted-foreground">Aucun message reçu</p>
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="message in userData.messages" 
              :key="message.id"
              class="card"
            >
              <p class="text-foreground whitespace-pre-wrap">{{ message.content }}</p>
              <p class="text-xs text-muted-foreground mt-2">
                {{ formatDate(message.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="card text-center py-12">
        <div class="text-4xl mb-4">😕</div>
        <p class="text-destructive">Utilisateur non trouvé</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, MessageSquare, Loader2 } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { adminApi } from '@/services/api'

const route = useRoute()
const loading = ref(true)
const userData = ref(null)

onMounted(async () => {
  const publicKey = route.params.publicKey
  if (!publicKey) {
    loading.value = false
    return
  }

  try {
    const response = await adminApi.getUserMessages(publicKey)
    userData.value = response
  } catch (e) {
    console.error('Failed to load user data:', e)
  } finally {
    loading.value = false
  }
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
</script>
