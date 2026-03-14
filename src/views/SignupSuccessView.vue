<template>
  <div class="min-h-screen">
    <FestiveHeader />
    
    <main class="max-w-md mx-auto px-4 py-16">
      <div class="card text-center">
        <div class="text-6xl mb-4">📧</div>
        <!-- <h1 class="text-2xl font-bold text-foreground mb-4">
          Vérifiez votre email
        </h1> -->
        <p class="text-muted-foreground mb-6">
          Votre Compte A bien ete Cree !
        </p>
        <router-link to="/login" class="btn btn-primary">
          Retour à la connexion
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import FestiveHeader from '@/components/FestiveHeader.vue'
</script>
