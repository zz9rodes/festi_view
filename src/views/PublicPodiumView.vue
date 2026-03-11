<template>
  <div class="min-h-screen">
    <FestiveHeader />

    <main class="max-w-3xl mx-auto px-4 py-16">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
        <p class="text-muted-foreground mt-2">Chargement du classement...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="card text-center">
        <div class="text-4xl mb-4">😕</div>
        <p class="text-destructive">{{ error }}</p>
        <router-link to="/explore" class="btn btn-primary mt-4 inline-block">Retour</router-link>
      </div>

      <template v-else-if="stats">
        <!-- Quiz title -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-foreground mb-2">{{ stats.quiz.title }}</h1>
          <p class="text-muted-foreground">Classement public</p>
        </div>

        <!-- Stats cards -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="card text-center">
            <Users class="w-6 h-6 mx-auto mb-2 text-primary" />
            <p class="text-2xl font-bold text-foreground">{{ stats.participantCount }}</p>
            <p class="text-xs text-muted-foreground">Participants</p>
          </div>
          <div class="card text-center">
            <HelpCircle class="w-6 h-6 mx-auto mb-2 text-primary" />
            <p class="text-2xl font-bold text-foreground">{{ stats.questionCount }}</p>
            <p class="text-xs text-muted-foreground">Questions</p>
          </div>
          <div class="card text-center">
            <BarChart3 class="w-6 h-6 mx-auto mb-2 text-primary" />
            <p class="text-2xl font-bold text-foreground">{{ stats.averagePercentage }}%</p>
            <p class="text-xs text-muted-foreground">Moyenne</p>
          </div>
        </div>

        <!-- Top 5 -->
        <div class="card">
          <h2 class="text-xl font-semibold text-foreground mb-4">Top 5</h2>

          <div v-if="stats.top5.length === 0" class="text-center py-6">
            <p class="text-muted-foreground">Aucune participation pour le moment.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(entry, index) in stats.top5"
              :key="index"
              class="flex items-center gap-4 p-3 rounded-lg"
              :class="{
                'bg-yellow-500/10': index === 0,
                'bg-gray-400/10': index === 1,
                'bg-orange-400/10': index === 2,
              }"
            >
              <span class="text-2xl w-10 text-center flex-shrink-0">
                {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}` }}
              </span>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-foreground truncate">{{ entry.participant_name }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ formatDate(entry.completed_at) }}
                </p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="font-bold text-foreground">{{ entry.score }}/{{ entry.total_questions }}</p>
                <p class="text-xs text-muted-foreground">{{ entry.percentage }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Back button -->
        <div class="text-center mt-8">
          <router-link to="/explore" class="btn btn-ghost flex justify-center items-center">
            <ArrowLeft class="w-4 h-4 mr-2" />
            <span>  Retour aux quiz</span>
          </router-link>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2, Users, HelpCircle, BarChart3, ArrowLeft } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { quizApi } from '@/services/api'

const route = useRoute()

const stats = ref(null)
const loading = ref(true)
const error = ref(null)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

async function loadStats() {
  loading.value = true
  error.value = null
  try {
    stats.value = await quizApi.getPublicStats(route.params.id)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>
