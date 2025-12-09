<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>

      <template v-else-if="stats">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-foreground">{{ stats.quiz?.title }}</h1>
            <p class="text-muted-foreground mt-1">Résultats et statistiques</p>
          </div>
          <router-link to="/dashboard" class="btn btn-secondary items-center inline-flex">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Retour
          </router-link>
        </div>

        <!-- Stats cards -->
        <div class="grid md:grid-cols-3 gap-4 mb-8">
          <div class="card text-center">
            <Users class="w-8 h-8 mx-auto text-primary mb-2" />
            <div class="text-3xl font-bold text-foreground">{{ stats.participantCount }}</div>
            <p class="text-muted-foreground">Participants</p>
          </div>
          <div class="card text-center">
            <Target class="w-8 h-8 mx-auto text-accent mb-2" />
            <div class="text-3xl font-bold text-foreground">{{ stats.averageScore }}%</div>
            <p class="text-muted-foreground">Score moyen</p>
          </div>
          <div class="card text-center">
            <AlertCircle class="w-8 h-8 mx-auto text-destructive mb-2" />
            <div class="text-sm font-medium text-foreground text-xl">{{ stats?.mostMissedQuestion?.question_text || 'N/A' }}</div>
            <p class="text-muted-foreground">est la Question la plus ratée</p>
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="card">
          <h2 class="text-xl font-semibold text-foreground mb-4">🏆 Classement</h2>
          
          <div v-if="stats.participants?.length === 0" class="text-center py-8 text-muted-foreground">
            Aucun participant pour le moment
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="(participant, index) in stats.participants" 
              :key="participant.id"
              :class="[
                'flex items-center justify-between p-4 rounded-lg',
                index === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                index === 1 ? 'bg-gray-400/10 border border-gray-400/20' :
                index === 2 ? 'bg-orange-500/10 border border-orange-500/20' :
                'bg-muted'
              ]"
            >
              <div class="flex items-center gap-3">
                <span class="text-xl">
                  {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.` }}
                </span>
                <span class="font-medium text-foreground">{{ participant.participant_name }}</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-semibold text-primary">
                  {{ participant.score }} / {{ participant.total_questions }}
                </span>
                <button 
                  @click="openDetails(participant.id)"
                  class="p-2 hover:bg-background rounded-full transition-colors text-muted-foreground hover:text-primary"
                  title="Voir les détails"
                >
                  <Eye class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeDetails">
      <div class="bg-card w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] flex flex-col border border-border">
        <!-- Modal Header -->
        <div class="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card rounded-t-xl z-10">
          <div>
            <h3 class="text-xl font-bold text-foreground">Détails de la participation</h3>
            <p v-if="selectedParticipation" class="text-muted-foreground">
              {{ selectedParticipation.participant_name }} • {{ selectedParticipation.score }}/{{ selectedParticipation.total_questions }} ({{ selectedParticipation.percentage }}%)
            </p>
          </div>
          <button @click="closeDetails" class="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto custom-scrollbar">
          <div v-if="detailsLoading" class="flex justify-center py-12">
            <Loader2 class="w-8 h-8 animate-spin text-primary" />
          </div>
          
          <div v-else-if="selectedParticipation" class="space-y-6">
            <div 
              v-for="(result, index) in selectedParticipation.results" 
              :key="index"
              class="bg-muted/50 rounded-lg p-4 border border-border"
            >
              <div class="flex items-start gap-3 mb-3">
                <div class="mt-1">
                  <CheckCircle v-if="result.is_correct" class="w-5 h-5 text-green-500" />
                  <XCircle v-else class="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 class="font-medium text-foreground text-lg">{{ result.question_text }}</h4>
                </div>
              </div>

              <div class="pl-8 space-y-2">
                <div 
                  v-for="(option, optIndex) in result.options" 
                  :key="optIndex"
                  :class="[
                    'p-3 rounded-md text-sm border transition-colors',
                    optIndex === result.correct_option_index 
                      ? 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300' 
                      : optIndex === result.selected_option_index && !result.is_correct
                        ? 'bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-300'
                        : 'bg-card border-border text-muted-foreground'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span>{{ option }}</span>
                    <span v-if="optIndex === result.correct_option_index" class="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/20 text-green-700 dark:text-green-300">
                      Correct
                    </span>
                    <span v-else-if="optIndex === result.selected_option_index" class="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-700 dark:text-red-300">
                      Votre réponse
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2, ArrowLeft, Users, Target, AlertCircle, Eye, X, CheckCircle, XCircle } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { useQuizStore } from '@/stores/quiz'

const route = useRoute()
const quizStore = useQuizStore()

const loading = ref(true)
const stats = ref(null)

onMounted(async () => {
  stats.value = await quizStore.fetchQuizStats(route.params.id)
  loading.value = false
})

// Modal Logic
const showDetailsModal = ref(false)
const detailsLoading = ref(false)
const selectedParticipation = ref(null)

async function openDetails(participationId) {
  showDetailsModal.value = true
  detailsLoading.value = true
  selectedParticipation.value = null
  
  try {
    const details = await quizStore.fetchParticipationDetails(participationId)
    selectedParticipation.value = details
  } catch (error) {
    console.error('Failed to fetch details:', error)
  } finally {
    detailsLoading.value = false
  }
}

function closeDetails() {
  showDetailsModal.value = false
  selectedParticipation.value = null
}
</script>
