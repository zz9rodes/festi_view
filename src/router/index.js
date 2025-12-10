import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/views/SignupView.vue"),
  },
  {
    path: "/signup-success",
    name: "signup-success",
    component: () => import("@/views/SignupSuccessView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard/create",
    name: "create-quiz",
    component: () => import("@/views/CreateQuizView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard/preview/:id",
    name: "preview-quiz",
    component: () => import("@/views/PreviewQuizView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard/results/:id",
    name: "quiz-results",
    component: () => import("@/views/QuizResultsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/send/:publicKey",
    name: "send-message",
    component: () => import("@/views/SendAnonymousMessageView.vue"),
  },
  {
    path: "/messages",
    name: "messages",
    component: () => import("@/views/MessagesView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/quiz/:id",
    name: "play-quiz",
    component: () => import("@/views/PlayQuizView.vue"),
  },
  {
    path: "/quiz/:id/results",
    name: "participant-results",
    component: () => import("@/views/ParticipantResultsView.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()

//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next({ name: "login" })
//   } else {
//     next()
//   }
// })

export default router
