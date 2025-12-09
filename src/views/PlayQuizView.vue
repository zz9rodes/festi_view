<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
        <p class="text-muted-foreground mt-2">Chargement du quiz...</p>
      </div>

      <div v-else-if="error" class="card text-center">
        <div class="text-6xl mb-4">😕</div>
        <h1 class="text-2xl font-bold text-foreground mb-2">Quiz introuvable</h1>
        <p class="text-muted-foreground">Ce quiz n'existe pas ou a été supprimé.</p>
      </div>

      <!-- Intro screen -->
      <div v-else-if="phase === 'intro'" class="card text-center">
        <div class="text-6xl mb-4">🎄</div>
        <h1 class="text-2xl font-bold text-foreground mb-2">{{ quiz.title }}</h1>
        <p class="text-muted-foreground mb-6">
          {{ quiz.questions?.length || 0 }} questions vous attendent !
        </p>

        <form @submit.prevent="startQuiz" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-foreground mb-2">
              Votre prénom
            </label>
            <input
              id="name"
              v-model="participantName"
              type="text"
              required
              class="input text-center"
              placeholder="Entrez votre prénom"
            />
          </div>
          <button type="submit" :disabled="!participantName.trim()" class="btn btn-primary w-full py-3">
            Commencer le quiz
          </button>
        </form>
      </div>

      <!-- Question screen -->
      <div v-else-if="phase === 'playing'" class="card">
        <div class="flex items-center justify-between mb-6">
          <span class="text-sm text-muted-foreground">
            Question {{ currentQuestionIndex + 1 }} / {{ quiz.questions.length }}
          </span>
          <span class="text-sm font-medium text-primary">
            {{ score }} point(s)
          </span>
        </div>

        <div class="w-full bg-muted rounded-full h-2 mb-6">
          <div 
            class="bg-primary h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }"
          ></div>
        </div>

        <h2 class="text-xl font-semibold text-foreground mb-6">
          {{ currentQ.question_text }}
        </h2>
        
        <!-- {{option}} -->
        <!-- {{currentQ}} -->
        <div class="space-y-3">
          <button
            v-for="(option, index) in shuffledOptions"
            :key="index"
            @click="selectAnswer(option.originalIndex)"
            :disabled="selectedAnswer !== null"
            :class="[
              'w-full p-4 rounded-lg text-left transition-all',
              getOptionClass(option.originalIndex)
            ]"
          >
            {{ option.text }}
          </button>
        </div>

        <div v-if="selectedAnswer !== null" class="mt-6 text-center">
          <p :class="isCorrect ? 'text-accent' : 'text-destructive'" class="font-medium mb-4">
            {{ isCorrect ? feedbackMessages.correct : feedbackMessages.wrong }}
          </p>
          <button @click="nextQuestion" class="btn btn-primary">
            {{ currentQuestionIndex < quiz.questions.length - 1 ? 'Question suivante' : 'Voir les résultats' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { useQuizStore } from '@/stores/quiz'
import confetti from 'canvas-confetti'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()

const quiz = ref(null)
const loading = ref(true)
const error = ref(false)
const phase = ref('intro')
const participantName = ref('')
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const score = ref(0)
const answers = ref([])

const feedbackMessages = {
  correct: ['Bravo ! 🎉', 'Excellent ! ✨', 'Parfait ! 🌟', 'Super ! 🎄'],
  wrong: ['Dommage ! 😅', 'Pas tout à fait... 🤔', 'Presque ! 💫']
}

const currentQ = computed(() => quiz.value?.questions?.[currentQuestionIndex.value] || {})

const shuffledOptions = computed(() => {
  if (!currentQ.value.options) return []
  return currentQ.value.options
    .map((text, originalIndex) => ({ text, originalIndex }))
    .sort(() => Math.random() - 0.5)
})

const isCorrect = computed(() => selectedAnswer.value === currentQ.value.correct_option_index)

onMounted(async () => {
  try {
    quiz.value = await quizStore.fetchQuizForPlay(route.params.id)
    if (!quiz.value) error.value = true
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})

function startQuiz() {
  phase.value = 'playing'
}

function selectAnswer(index) {
  selectedAnswer.value = index
  const correct = index === currentQ.value.correct_option_index
  
  if (correct) {
    console.log("is Corect : ",correct)
    score.value++
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
  }

  console.log("score : ",score)
  
  answers.value.push({
    question_id: currentQ.value.id,
    selected_option_index: index,
    correct
  })
}

function getOptionClass(index) {
  if (selectedAnswer.value === null) {
    return 'bg-muted hover:bg-muted/80 text-foreground'
  }
  if (index === currentQ.value.correct_option_index) {
    return 'bg-accent/20 border-2 border-accent text-foreground'
  }
  if (index === selectedAnswer.value) {
    return 'bg-destructive/20 border-2 border-destructive text-foreground'
  }
  return 'bg-muted text-muted-foreground opacity-50'
}

async function nextQuestion() {
  if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
  } else {
    // Submit and go to results
    const result = await quizStore.submitParticipation(quiz.value.id, participantName.value, answers.value)
    if (result) {
      router.push({
        path: `/quiz/${quiz.value.id}/results`,
        query: {
          name: participantName.value,
          score: score.value,
          total: quiz.value.questions.length
        }
      })
    }
  }
}
</script>
