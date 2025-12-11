<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex items-center gap-3 mb-8">
        <router-link to="/admin" class="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </router-link>
        <div>
          <h1 class="text-3xl font-bold text-foreground">Quiz</h1>
          <p class="text-muted-foreground">{{ quizzes.length }} quiz créé(s)</p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>

      <div v-else-if="quizzes.length === 0" class="card text-center py-12">
        <div class="text-6xl mb-4">📝</div>
        <p class="text-muted-foreground">Aucun quiz pour le moment</p>
      </div>

      <div v-else class="space-y-3">
        <router-link 
          v-for="quiz in quizzes" 
          :key="quiz.id"
          :to="`/admin/quizzes/${quiz.id}`"
          class="card flex items-center gap-4 hover:border-primary/50 transition-colors"
        >
          <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <ClipboardList class="w-6 h-6 text-primary" />
          </div>
          
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-foreground truncate">{{ quiz.title }}</h3>
            <p class="text-sm text-muted-foreground">
              Par {{ quiz.creator?.display_name || 'Inconnu' }}
            </p>
          </div>

          <div class="text-right hidden md:block">
            <p class="text-xs text-muted-foreground">Créé le</p>
            <p class="text-sm text-foreground">{{ formatDate(quiz.created_at) }}</p>
          </div>

          <ChevronRight class="w-5 h-5 text-muted-foreground" />
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft, ChevronRight, ClipboardList, Loader2 } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { adminApi } from '@/services/api'

const loading = ref(true)
const quizzes = ref([])

onMounted(async () => {
  try {
    const response = await adminApi.getQuizzes()
    quizzes.value = response.quizzes || []
  } catch (e) {
    console.error('Failed to load quizzes:', e)
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
