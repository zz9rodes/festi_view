// API Configuration - Replace with your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api"

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Une erreur est survenue" }))
    throw new Error(error.message || "Une erreur est survenue")
  }

  return response.json()
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
  sendMessage: (userId, content) =>
    apiCall(`/users/${userId}/messages`, {
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

export default {
  auth: authApi,
  quiz: quizApi,
  questions: questionsApi,
  participants: participantsApi,
  messages: messagesApi,
}
