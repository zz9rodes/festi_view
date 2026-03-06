<template>
  <div class="min-h-screen">
    <FestiveHeader />

    <main class="max-w-4xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <!-- <div class="text-6xl mb-4">🎄 🎁 ❄️</div> -->
        <h1 class="text-4xl font-bold text-foreground mb-4">
          Bienvenue sur
          <span
            class="gooey backdrop-blur-xl bg-white/10 border border-white/30 py-1 px-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
          >
            <span class="badge">Quiwiz</span>
          </span>

          <svg width="0" height="0">
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="4"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 20 -10"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </svg>
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Créez des quiz amusants pour vos amis et votre famille, partagez-les
          et découvrez qui  vous connaît le mieux !
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
import FestiveHeader from "@/components/FestiveHeader.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
</script>

<style scoped>
.gooey {
  position: relative;
  display: inline-block;
  /* filter: url(#goo); */
}

.badge {
  padding: 6px 12px;
  border-radius: 9999px;
  /* color: black; */
  font-weight: 600;
  position: relative;
}
</style>
