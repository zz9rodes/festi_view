<template>
  <div class="min-h-screen">
    <FestiveHeader />

    <main class="max-w-4xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-foreground mb-2">Quiz populaires</h1>
        <p class="text-muted-foreground">Decouvrez les quiz les mieux notes de la communaute</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
        <p class="text-muted-foreground mt-2">Chargement des quiz...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="card text-center">
        <div class="text-4xl mb-4">😕</div>
        <p class="text-destructive">{{ error }}</p>
        <button @click="loadQuizzes(1)" class="btn btn-primary mt-4">Reessayer</button>
      </div>

      <!-- Empty -->
      <div v-else-if="quizzes.length === 0" class="card text-center">
        <div class="text-4xl mb-4">📭</div>
        <p class="text-muted-foreground">Aucun quiz disponible pour le moment.</p>
      </div>

      <!-- Quiz grid -->
      <template v-else>
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <div v-for="quiz in quizzes" :key="quiz.id" class="card flex flex-col">
            <h3 class="text-lg font-semibold text-foreground mb-2">{{ quiz.title }}</h3>
            <p class="text-sm text-muted-foreground mb-1">
              Par <span class="font-medium">{{ quiz.author_name }}</span>
            </p>
            <p class="text-sm text-muted-foreground mb-4">
              {{ quiz.question_count }} question{{ quiz.question_count > 1 ? 's' : '' }}
            </p>
            <div class="mt-auto flex items-center gap-2">
              <router-link :to="`/quiz/${quiz.id}`" class="btn btn-primary flex-1 text-center">
                Jouer
              </router-link>
              <router-link
                :to="`/quiz/${quiz.id}/podium`"
                class="btn bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 p-2.5"
                title="Voir le classement"
              >
                <Trophy class="w-5 h-5" />
              </router-link>
              <router-link
                v-if="quiz.author_public_key"
                :to="`/send/${quiz.author_public_key}`"
                class="btn bg-accent text-accent-foreground hover:bg-accent/80 p-2.5"
                title="Envoyer un message anonyme"
              >
                <MessageCircle class="w-5 h-5" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.total_pages > 1" class="flex justify-center gap-2">
          <button
            @click="loadQuizzes(pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="btn btn-ghost"
          >
            Precedent
          </button>
          <span class="flex items-center px-4 text-sm text-muted-foreground">
            Page {{ pagination.page }} / {{ pagination.total_pages }}
          </span>
          <button
            @click="loadQuizzes(pagination.page + 1)"
            :disabled="pagination.page >= pagination.total_pages"
            class="btn btn-ghost"
          >
            Suivant
          </button>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2, MessageCircle, Trophy } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { quizApi } from '@/services/api'

const quizzes = ref([])
const pagination = ref(null)
const loading = ref(true)
const error = ref(null)

async function loadQuizzes(page = 1) {
  loading.value = true
  error.value = null
  try {
    const data = await quizApi.getPublicQuizzes(page)
    quizzes.value = data.quizzes
    pagination.value = data.pagination
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => loadQuizzes())
</script>
