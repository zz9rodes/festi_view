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
    path: "/demo",
    name: "demo",
    component: () => import("@/views/DemoView.vue"),
  },
  {
    path: "/explore",
    name: "explore",
    component: () => import("@/views/PublicQuizzesView.vue"),
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
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
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
  // Admin routes
  {
    path: "/admin",
    name: "admin-dashboard",
    component: () => import("@/views/admin/AdminDashboardView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/users",
    name: "admin-users",
    component: () => import("@/views/admin/AdminUsersView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/users/:publicKey",
    name: "admin-user-detail",
    component: () => import("@/views/admin/AdminUserDetailView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/quizzes",
    name: "admin-quizzes",
    component: () => import("@/views/admin/AdminQuizzesView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/quizzes/:id",
    name: "admin-quiz-detail",
    component: () => import("@/views/admin/AdminQuizDetailView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Attendre que le store soit initialisé avant de vérifier l'authentification
  while (!authStore.initialized) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" })
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: "dashboard" })
  } else {
    next()
  }
})

export default router
