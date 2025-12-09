<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-2xl mx-auto px-4 py-8">
      <div v-if="quizStore.loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>

      <div v-else-if="quiz" class="card text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h1 class="text-2xl font-bold text-foreground mb-2">
          {{ quiz.title }}
        </h1>
        <p class="text-muted-foreground mb-6">
          Votre quiz est prêt à être partagé !
        </p>

        <div class="bg-muted rounded-lg p-4 mb-6">
          <p class="text-sm text-muted-foreground mb-2">Lien de partage</p>
          <div class="flex items-center gap-2">
            <input
              :value="shareUrl"
              readonly
              class="input text-center"
            />
            <button 
              @click="copyLink"
              class="btn btn-primary"
            >
              <Check v-if="copied" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="flex gap-3 justify-center">
          <router-link to="/dashboard" class="btn btn-secondary items-center inline-flex">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Retour
          </router-link>
          <router-link :to="`/dashboard/results/${quiz.id}`" class="btn btn-primary  align-center inline-flex">
            <BarChart3 class="w-4 h-4 mr-2" />
            Voir les résultats
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2, Copy, Check, ArrowLeft, BarChart3 } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { useQuizStore } from '@/stores/quiz'

const route = useRoute()
const quizStore = useQuizStore()

const quiz = ref(null)
const copied = ref(false)

const shareUrl = computed(() => {
  if (!quiz.value) return ''
  return `${window.location.origin}/quiz/${quiz.value.id}`
})

onMounted(async () => {
  quiz.value = await quizStore.fetchQuiz(route.params.id)
})

function copyLink() {
  navigator.clipboard.writeText(shareUrl.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
