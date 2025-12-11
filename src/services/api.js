// API Configuration - Replace with your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL

import { toast } from "vue3-toastify"

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem("auth_token")

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.error === true) {
      const errorMessage = data.message || "Request Failed"
      toast.error(errorMessage, {
        theme: "light",
        position: "top-right",
      })
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    // Si ce n'est pas une erreur que nous avons déjà levée (avec le toast déjà affiché)
    if (error.message === "Failed to fetch") {
      toast.error("Erreur de connexion serveur", {
        theme: "light",
        position: "top-right",
      })
    }
    throw error
  }
}

// Auth API
export const authApi = {
  login: (email, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (email, password, displayName) =>
    apiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name: displayName }),
    }),

  logout: () => apiCall("/auth/logout", { method: "POST" }),

  getProfile: () => apiCall("/auth/profile"),

  updateProfile: (data) =>
    apiCall("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// Quiz API
export const quizApi = {
  // Get all quizzes for the authenticated user
  getMyQuizzes: () => apiCall("/quizzes"),

  // Get a single quiz by ID
  getQuiz: (id) => apiCall(`/quizzes/${id}`),

  // Get quiz with questions (for playing)
  getQuizWithQuestions: (id) => apiCall(`/quizzes/${id}/play`),

  // Create a new quiz
  createQuiz: (data) =>
    apiCall("/quizzes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update a quiz
  updateQuiz: (id, data) =>
    apiCall(`/quizzes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete a quiz
  deleteQuiz: (id) => apiCall(`/quizzes/${id}`, { method: "DELETE" }),

  // Get quiz statistics (for creator)
  getQuizStats: (id) => apiCall(`/quizzes/${id}/stats`),
}

// Questions API
export const questionsApi = {
  // Add a question to a quiz
  addQuestion: (quizId, data) =>
    apiCall(`/quizzes/${quizId}/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update a question
  updateQuestion: (questionId, data) =>
    apiCall(`/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete a question
  deleteQuestion: (questionId) => apiCall(`/questions/${questionId}`, { method: "DELETE" }),
}

// Participants API
export const participantsApi = {
  // Submit quiz participation
  submitParticipation: (quizId, data) =>
    apiCall(`/quizzes/${quizId}/participate`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get participation result
  getParticipationResult: (participationId) => apiCall(`/participations/${participationId}`),

  // Get all participants for a quiz (for creator)
  getQuizParticipants: (quizId) => apiCall(`/quizzes/${quizId}/participants`),

  // Get detailed participation result (PROTECTED - owner only)
  getParticipationDetails: (participationId) => apiCall(`/participations/${participationId}/details`),
}

// Messages API
export const messagesApi = {
  // Send an anonymous message (PUBLIC)
  sendMessage: (publicKey, content) =>
    apiCall(`/users/${publicKey}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  // List received messages (PROTECTED)
  getMessages: () => apiCall("/messages"),

  // Show a single message (PROTECTED)
  getMessage: (id) => apiCall(`/messages/${id}`),

  // Delete a message (PROTECTED)
  deleteMessage: (id) => apiCall(`/messages/${id}`, { method: "DELETE" }),
}

// Users API
export const usersApi = {
  // Get user public info by public key (PUBLIC)
  getUserByPublicKey: (publicKey) => apiCall(`/users/${publicKey}`),
}

// Admin API (requires admin privileges)
export const adminApi = {
  // List all users
  getUsers: () => apiCall("/admin/users"),

  // List all quizzes
  getQuizzes: () => apiCall("/admin/quizzes"),

  // Get quiz details with questions
  getQuiz: (id) => apiCall(`/admin/quizzes/${id}`),

  // List all participations
  getParticipations: () => apiCall("/admin/participations"),

  // Get messages for a specific user
  getUserMessages: (publicKey) => apiCall(`/admin/users/${publicKey}/messages`),
}

export default {
  auth: authApi,
  quiz: quizApi,
  questions: questionsApi,
  participants: participantsApi,
  messages: messagesApi,
  users: usersApi,
  admin: adminApi,
}
