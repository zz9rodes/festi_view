<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center gap-3 mb-8">
        <router-link to="/admin/quizzes" class="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </router-link>
        <h1 class="text-3xl font-bold text-foreground">Détails du quiz</h1>
      </div>

      <div v-if="loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>

      <template v-else-if="quiz">
        <!-- Quiz Info Card -->
        <div class="card mb-8">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <ClipboardList class="w-8 h-8 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-foreground">{{ quiz.title }}</h2>
              <p class="text-muted-foreground mt-1">
                Créé par <span class="font-medium text-foreground">{{ quiz.creator?.display_name }}</span>
                ({{ quiz.creator?.email }})
              </p>
              <p class="text-xs text-muted-foreground mt-2">
                {{ formatDate(quiz.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Questions Section -->
        <div>
          <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle class="w-5 h-5" />
            Questions ({{ quiz.questions?.length || 0 }})
          </h3>

          <div v-if="!quiz.questions || quiz.questions.length === 0" class="card text-center py-8">
            <p class="text-muted-foreground">Aucune question dans ce quiz</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="(question, index) in quiz.questions" 
              :key="question.id"
              class="card"
            >
              <div class="flex items-start gap-3 mb-4">
                <span class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                  {{ index + 1 }}
                </span>
                <p class="text-foreground font-medium flex-1">{{ question.question_text }}</p>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 ml-11">
                <div 
                  v-for="(option, optIndex) in question.options" 
                  :key="optIndex"
                  :class="[
                    'p-3 rounded-lg border text-sm',
                    optIndex === question.correct_option_index 
                      ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400' 
                      : 'bg-muted/50 border-border text-muted-foreground'
                  ]"
                >
                  <span class="font-medium mr-2">{{ ['A', 'B', 'C', 'D'][optIndex] }}.</span>
                  {{ option }}
                  <CheckCircle v-if="optIndex === question.correct_option_index" class="w-4 h-4 inline ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="card text-center py-12">
        <div class="text-4xl mb-4">😕</div>
        <p class="text-destructive">Quiz non trouvé</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ClipboardList, HelpCircle, CheckCircle, Loader2 } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { adminApi } from '@/services/api'

const route = useRoute()
const loading = ref(true)
const quiz = ref(null)

onMounted(async () => {
  const quizId = route.params.id
  if (!quizId) {
    loading.value = false
    return
  }

  try {
    const response = await adminApi.getQuiz(quizId)
    quiz.value = response.quiz
  } catch (e) {
    console.error('Failed to load quiz:', e)
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
