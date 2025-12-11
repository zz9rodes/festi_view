<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex items-center gap-3 mb-8">
        <router-link to="/admin" class="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </router-link>
        <div>
          <h1 class="text-3xl font-bold text-foreground">Utilisateurs</h1>
          <p class="text-muted-foreground">{{ users.length }} utilisateur(s) inscrit(s)</p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>

      <div v-else-if="users.length === 0" class="card text-center py-12">
        <div class="text-6xl mb-4">👥</div>
        <p class="text-muted-foreground">Aucun utilisateur pour le moment</p>
      </div>

      <div v-else class="space-y-3">
        <router-link 
          v-for="user in users" 
          :key="user.id"
          :to="`/admin/users/${user.public_key}`"
          class="card flex items-center gap-4 hover:border-primary/50 transition-colors"
        >
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              v-if="user.avatar" 
              :src="user.avatar" 
              :alt="user.display_name" 
              class="w-full h-full object-cover"
            />
            <span v-else class="text-xl">👤</span>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-foreground truncate">{{ user.display_name }}</h3>
              <span v-if="user.is_admin" class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                Admin
              </span>
            </div>
            <p class="text-sm text-muted-foreground truncate">{{ user.email }}</p>
          </div>

          <div class="text-right hidden md:block">
            <p class="text-xs text-muted-foreground">Inscrit le</p>
            <p class="text-sm text-foreground">{{ formatDate(user.created_at) }}</p>
          </div>

          <ChevronRight class="w-5 h-5 text-muted-foreground" />
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft, ChevronRight, Loader2 } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { adminApi } from '@/services/api'

const loading = ref(true)
const users = ref([])

onMounted(async () => {
  try {
    const response = await adminApi.getUsers()
    users.value = response.users || []
  } catch (e) {
    console.error('Failed to load users:', e)
  } finally {
    loading.value = false
  }
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>
