<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-foreground">Mes Quiz</h1>
          <p class="text-muted-foreground mt-1">
            Gérez et partagez vos quiz festifs
          </p>
        </div>
        <router-link to="/dashboard/create" class="btn btn-primary inline-flex items-center">
          <Plus class="w-4 h-4 mr-2" />
           Quiz
        </router-link>
      </div>

      <div v-if="quizStore.loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
        <p class="text-muted-foreground mt-2">Chargement...</p>
      </div>

      <div v-else-if="quizStore.quizzes.length === 0" class="card text-center py-12">
        <div class="text-6xl mb-4">🎄</div>
        <h2 class="text-xl font-semibold text-foreground mb-2">
          Aucun quiz pour le moment
        </h2>
        <p class="text-muted-foreground mb-6">
          Créez votre premier quiz festif et partagez-le avec vos proches !
        </p>
        <router-link to="/dashboard/create" class="btn btn-primary">
          Créer mon premier quiz
        </router-link>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="quiz in quizStore.quizzes" 
          :key="quiz.id"
          class="card hover:border-primary/50 transition-colors"
        >
          <div class="flex items-start justify-between mb-4">
            <h3 class="text-lg font-semibold text-foreground">{{ quiz.title }}</h3>
            <button 
              @click="handleDelete(quiz.id)"
              class="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
          
          <div class="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span class="flex items-center gap-1">
              <HelpCircle class="w-4 h-4" />
              {{ quiz.question_count || 0 }} questions
            </span>
            <span class="flex items-center gap-1">
              <Users class="w-4 h-4" />
              {{ quiz.participant_count || 0 }} participants
            </span>
          </div>

          <div class="flex gap-2">
            <router-link 
              :to="`/dashboard/preview/${quiz.id}`"
              class="btn btn-secondary flex-1 text-center inline-flex items-center"
            >
              <Share2 class="w-4 h-4 mr-1" />
              Partager
            </router-link>
            <router-link 
              :to="`/dashboard/results/${quiz.id}`"
              class="btn btn-ghost"
            >
              <BarChart3 class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="cancelDelete">
        <div class="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border p-6 animate-in fade-in zoom-in duration-200">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3 text-destructive">
              <div class="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle class="w-6 h-6" />
              </div>
              <h3 class="text-xl font-bold text-foreground">Supprimer le quiz ?</h3>
            </div>
            <button @click="cancelDelete" class="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <p class="text-muted-foreground mb-8">
            Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible et effacera toutes les données associées.
          </p>
          
          <div class="flex justify-end gap-3">
            <button @click="cancelDelete" class="btn btn-ghost">
              Annuler
            </button>
            <button @click="confirmDelete" class="btn btn-destructive">
              Supprimer
            </button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Plus,
  Loader2,
  Trash2,
  HelpCircle,
  Users,
  Share2,
  BarChart3,
  AlertTriangle,
  X,
} from "lucide-vue-next";
import FestiveHeader from "@/components/FestiveHeader.vue";
import { useQuizStore } from "@/stores/quiz";

const quizStore = useQuizStore();
const showDeleteModal = ref(false);
const quizToDelete = ref(null);

onMounted(() => {
  quizStore.fetchMyQuizzes();
});

async function handleDelete(id) {
  quizToDelete.value = id;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (quizToDelete.value) {
    await quizStore.deleteQuiz(quizToDelete.value);
    showDeleteModal.value = false;
    quizToDelete.value = null;
  }
}

function cancelDelete() {
  showDeleteModal.value = false;
  quizToDelete.value = null;
}
</script>
