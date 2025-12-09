<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-2xl mx-auto px-4 py-8">
      <!-- Step indicator -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div 
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
            step === 'title' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          ]"
        >
          1
        </div>
        <div class="w-12 h-0.5 bg-border"></div>
        <div 
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
            step === 'questions' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          ]"
        >
          2
        </div>
      </div>

      <!-- Title step -->
      <div v-if="step === 'title'" class="card">
        <div class="text-center mb-6">
          <div class="text-4xl mb-4">✨</div>
          <h1 class="text-2xl font-bold text-foreground">Créer un nouveau quiz</h1>
          <p class="text-muted-foreground mt-2">Donnez un titre à votre quiz festif</p>
        </div>

        <form @submit.prevent="handleCreateQuiz" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-foreground mb-2">
              Titre du quiz
            </label>
            <input
              id="title"
              v-model="quizTitle"
              type="text"
              required
              class="input"
              placeholder="Ex: Quiz de Noël en famille"
            />
          </div>

          <div class="flex gap-3">
            <router-link to="/dashboard" class="btn btn-ghost flex-1 text-center py-3">
              Annuler
            </router-link>
            <button 
              type="submit" 
              :disabled="quizStore.loading || !quizTitle.trim()"
              class="btn btn-primary flex-1 py-3"
            >
              <Loader2 v-if="quizStore.loading" class="w-4 h-4 mr-2 animate-spin" />
              Continuer
            </button>
          </div>
        </form>
      </div>

      <!-- Questions step -->
      <div v-else-if="step === 'questions'" class="card">
        <div class="text-center mb-6">
          <div class="text-4xl mb-4">❓</div>
          <h1 class="text-2xl font-bold text-foreground">
            Question {{ questions.length + 1 }}
          </h1>
          <p class="text-muted-foreground mt-2">
            Ajoutez vos questions une par une
          </p>
        </div>

        <form @submit.prevent="handleAddQuestion" class="space-y-4">
          <div>
            <label for="question" class="block text-sm font-medium text-foreground mb-2">
              Question
            </label>
            <input
              id="question"
              v-model="currentQuestion.text"
              type="text"
              required
              class="input"
              placeholder="Posez votre question..."
            />
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-medium text-foreground">
              Options de réponse
            </label>
            <div 
              v-for="(option, index) in currentQuestion.options" 
              :key="index"
              class="flex items-center gap-2"
            >
              <input
                type="radio"
                :id="`option-${index}`"
                :value="index"
                v-model="currentQuestion.correctIndex"
                class="w-4 h-4 text-primary"
              />
              <input
                v-model="currentQuestion.options[index]"
                type="text"
                required
                class="input flex-1"
                :placeholder="`Option ${index + 1}`"
              />
            </div>
            <p class="text-xs text-muted-foreground">
              Sélectionnez la bonne réponse
            </p>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="submit" 
              :disabled="quizStore.loading || !isQuestionValid"
              class="btn btn-primary flex-1 inline-flex items-center justify-center"
            >
              <Loader2 v-if="quizStore.loading" class="w-4 h-4 mr-2 animate-spin" />
              <Plus v-else class="w-4 h-4 mr-2" />
              Ajouter la question
            </button>
          </div>
        </form>

        <div v-if="questions.length > 0" class="mt-6 pt-6 border-t border-border">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-muted-foreground">
              {{ questions.length }} question(s) ajoutée(s)
            </p>
            <button 
              @click="handleFinish"
              class="btn btn-secondary"
            >
              Terminer et partager
              <ArrowRight class="w-4 h-4 ml-2" />
            </button>
          </div>
          
          <div class="space-y-2">
            <div 
              v-for="(q, index) in questions" 
              :key="index"
              class="bg-muted rounded-lg px-4 py-2 text-sm text-foreground"
            >
              {{ index + 1 }}. {{ q.text }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2, Plus, ArrowRight } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { useQuizStore } from '@/stores/quiz'

const quizStore = useQuizStore()
const router = useRouter()

const step = ref('title')
const quizTitle = ref('')
const quizId = ref(null)
const questions = ref([])

const currentQuestion = ref({
  text: '',
  options: ['', '', '', ''],
  correctIndex: 0
})

const isQuestionValid = computed(() => {
  return currentQuestion.value.text.trim() &&
    currentQuestion.value.options.every(o => o.trim()) &&
    currentQuestion.value.correctIndex !== null
})

async function handleCreateQuiz() {
  const quiz = await quizStore.createQuiz(quizTitle.value)
  if (quiz) {
    quizId.value = quiz.id
    step.value = 'questions'
  }
}

async function handleAddQuestion() {
  const question = await quizStore.addQuestion(quizId.value, {
    question_text: currentQuestion.value.text,
    options: currentQuestion.value.options,
    correct_option_index: currentQuestion.value.correctIndex
  })
  
  if (question) {
    questions.value.push({
      text: currentQuestion.value.text,
      options: [...currentQuestion.value.options],
      correctIndex: currentQuestion.value.correctIndex
    })
    
    // Reset form
    currentQuestion.value = {
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0
    }
  }
}

function handleFinish() {
  router.push(`/dashboard/preview/${quizId.value}`)
}
</script>
