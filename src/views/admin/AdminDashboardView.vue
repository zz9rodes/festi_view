<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Shield class="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-foreground">Administration</h1>
          <p class="text-muted-foreground">Tableau de bord admin</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="loading" class="text-center py-12">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card hover:border-primary/50 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users class="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p class="text-3xl font-bold text-foreground">{{ stats.users }}</p>
              <p class="text-sm text-muted-foreground">Utilisateurs</p>
            </div>
          </div>
        </div>

        <div class="card hover:border-primary/50 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <ClipboardList class="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p class="text-3xl font-bold text-foreground">{{ stats.quizzes }}</p>
              <p class="text-sm text-muted-foreground">Quiz créés</p>
            </div>
          </div>
        </div>

        <div class="card hover:border-primary/50 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Trophy class="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p class="text-3xl font-bold text-foreground">{{ stats.participations }}</p>
              <p class="text-sm text-muted-foreground">Participations</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <router-link to="/admin/users" class="card hover:border-primary/50 transition-colors group">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <Users class="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <h3 class="text-lg font-semibold text-foreground">Gérer les utilisateurs</h3>
                <p class="text-sm text-muted-foreground">Voir tous les comptes et leurs activités</p>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </router-link>

        <router-link to="/admin/quizzes" class="card hover:border-primary/50 transition-colors group">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <ClipboardList class="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <h3 class="text-lg font-semibold text-foreground">Voir tous les quiz</h3>
                <p class="text-sm text-muted-foreground">Consulter les quiz créés par les utilisateurs</p>
              </div>
            </div>
            <ChevronRight class="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Shield, Users, ClipboardList, Trophy, ChevronRight, Loader2 } from 'lucide-vue-next'
import FestiveHeader from '@/components/FestiveHeader.vue'
import { adminApi } from '@/services/api'

const loading = ref(true)
const stats = ref({
  users: 0,
  quizzes: 0,
  participations: 0
})

onMounted(async () => {
  try {
    const [usersRes, quizzesRes, participationsRes] = await Promise.all([
      adminApi.getUsers(),
      adminApi.getQuizzes(),
      adminApi.getParticipations()
    ])
    
    stats.value = {
      users: usersRes.users?.length || 0,
      quizzes: quizzesRes.quizzes?.length || 0,
      participations: participationsRes.participations?.length || 0
    }
  } catch (e) {
    console.error('Failed to load admin stats:', e)
  } finally {
    loading.value = false
  }
})
</script>
