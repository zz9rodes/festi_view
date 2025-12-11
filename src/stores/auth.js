import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { authApi } from "@/services/api"

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null)
  const token = ref(localStorage.getItem("auth_token"))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.is_admin === true)

  async function login(email, password) {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.login(email, password)
      token.value = response.token
      user.value = response.user
      localStorage.setItem("auth_token", response.token)
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function signup(email, password, displayName) {
    loading.value = true
    error.value = null

    try {
      await authApi.signup(email, password, displayName)
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return

    loading.value = true
    try {
      const response = await authApi.getProfile()
      user.value = response.user
    } catch (e) {
      // Token invalid, clear auth
      logout()
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data) {
    loading.value = true
    error.value = null

    try {
      const response = await authApi.updateProfile(data)
      user.value = response.user
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem("auth_token")
  }

  // Initialize - fetch profile if token exists
  if (token.value) {
    fetchProfile()
  }


  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    fetchProfile,
    updateProfile,
    logout,
  }
})
