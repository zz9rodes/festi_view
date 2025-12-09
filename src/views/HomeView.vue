<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-4xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <div class="text-6xl mb-4">🎄 🎁 ❄️</div>
        <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Bienvenue sur Quiz Festif !
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Créez des quiz amusants pour vos amis et votre famille, 
          partagez-les et découvrez qui connaît le mieux les fêtes !
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <div class="card text-center">
          <div class="text-4xl mb-4">✨</div>
          <h3 class="text-lg font-semibold text-foreground mb-2">Créez</h3>
          <p class="text-muted-foreground">
            Concevez vos propres quiz avec des questions personnalisées
          </p>
        </div>
        
        <div class="card text-center">
          <div class="text-4xl mb-4">🔗</div>
          <h3 class="text-lg font-semibold text-foreground mb-2">Partagez</h3>
          <p class="text-muted-foreground">
            Envoyez un lien unique à vos proches pour qu'ils participent
          </p>
        </div>
        
        <div class="card text-center">
          <div class="text-4xl mb-4">🏆</div>
          <h3 class="text-lg font-semibold text-foreground mb-2">Découvrez</h3>
          <p class="text-muted-foreground">
            Consultez les résultats et trouvez le champion du quiz !
          </p>
        </div>
      </div>

      <div class="text-center">
        <router-link 
          to="/dashboard"
          class="btn btn-primary text-lg px-8 py-3"
          v-if="authStore.isAuthenticated"
        >
          Accéder à mes quiz
        </router-link>
        <router-link 
          to="/signup"
          class="btn btn-primary text-lg px-8 py-3"
          v-else
        >
          Commencer gratuitement
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import FestiveHeader from '@/components/FestiveHeader.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
