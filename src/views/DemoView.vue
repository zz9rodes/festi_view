<template>
  <div class="min-h-screen">
    <FestiveHeader />

    <main class="max-w-4xl mx-auto px-4 py-16">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-foreground mb-4">Démo de Quiwiz</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez comment utiliser l'application en regardant cette vidéo de démonstration.
        </p>
      </div>

      <div class="card p-0 overflow-hidden">
        <div class="relative w-full" style="padding-top: 56.25%;">
          <video
            class="absolute inset-0 w-full h-full"
            controls
            poster="/quiz-logo.jpg"
            preload="auto"
            autoplay
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
      </div>

      <div class="text-center mt-10">
        <p class="text-muted-foreground mb-6">
          Prêt à essayer ? Créez votre compte et commencez à créer vos quiz !
        </p>
        <router-link
          to="/signup"
          class="btn btn-primary text-lg px-8 py-3"
        >
          Commencer gratuitement
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import FestiveHeader from "@/components/FestiveHeader.vue"
</script>
