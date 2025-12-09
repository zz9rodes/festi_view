<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="card text-center">
        <div class="text-6xl mb-4">{{ badge }}</div>
        <h1 class="text-3xl font-bold text-foreground mb-2">
          Félicitations {{ name }} !
        </h1>
        <p class="text-xl text-muted-foreground mb-6">
          Vous avez obtenu {{ score }} / {{ total }} points
        </p>

        <div class="bg-muted rounded-lg p-6 mb-6">
          <div class="text-5xl font-bold text-primary mb-2">
            {{ percentage }}%
          </div>
          <p class="text-muted-foreground">{{ message }}</p>
        </div>

        <router-link to="/" class="btn btn-primary">
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import confetti from 'canvas-confetti'

const route = useRoute()

const name = computed(() => route.query.name || 'Participant')
const score = computed(() => parseInt(route.query.score) || 0)
const total = computed(() => parseInt(route.query.total) || 1)
const percentage = computed(() => Math.round((score.value / total.value) * 100))

const badge = computed(() => {
  if (percentage.value >= 80) return '🥇'
  if (percentage.value >= 60) return '🥈'
  if (percentage.value >= 40) return '🥉'
  return '🎄'
})

const message = computed(() => {
  if (percentage.value >= 80) return 'Incroyable ! Vous êtes un expert !'
  if (percentage.value >= 60) return 'Très bien ! Continuez comme ça !'
  if (percentage.value >= 40) return 'Pas mal ! Vous pouvez faire mieux !'
  return 'Continuez à apprendre !'
})

onMounted(() => {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  })
})
</script>
