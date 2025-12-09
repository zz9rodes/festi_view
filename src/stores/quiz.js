import { defineStore } from "pinia"
import { ref } from "vue"
import { quizApi, questionsApi, participantsApi } from "@/services/api"

export const useQuizStore = defineStore("quiz", () => {
    const quizzes = ref([])
    const currentQuiz = ref(null)
    const loading = ref(false)
    const error = ref(null)

    async function fetchMyQuizzes() {
        loading.value = true
        error.value = null

        try {
            const response = await quizApi.getMyQuizzes()
            quizzes.value = response.quizzes || []
        } catch (e) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    async function fetchQuiz(id) {
        loading.value = true
        error.value = null

        try {
            const response = await quizApi.getQuiz(id)
            currentQuiz.value = response.quiz
            return response.quiz
        } catch (e) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    async function fetchQuizForPlay(id) {
        loading.value = true
        error.value = null

        try {
            const response = await quizApi.getQuizWithQuestions(id)
            currentQuiz.value = response.quiz
            return response.quiz
        } catch (e) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    async function createQuiz(title) {
        loading.value = true
        error.value = null

        try {
            const response = await quizApi.createQuiz({ title })
            return response.quiz
        } catch (e) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    async function addQuestion(quizId, questionData) {
        loading.value = true
        error.value = null

        try {
            const response = await questionsApi.addQuestion(quizId, questionData)
            return response.question
        } catch (e) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    async function deleteQuiz(id) {
        loading.value = true
        error.value = null

        try {
            await quizApi.deleteQuiz(id)
            quizzes.value = quizzes.value.filter((q) => q.id !== id)
            return true
        } catch (e) {
            error.value = e.message
            return false
        } finally {
            loading.value = false
        }
    }

    async function submitParticipation(quizId, participantName, answers) {
        loading.value = true
        error.value = null

        try {
            const response = await participantsApi.submitParticipation(quizId, {
                participant_name: participantName,
                answers,
            })
            return response
        } catch (e) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    async function fetchQuizStats(id) {
        loading.value = true
        error.value = null

        try {
            const response = await quizApi.getQuizStats(id)
            return response
        } catch (e) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    async function fetchParticipationDetails(participationId) {
        loading.value = true
        error.value = null

        try {
            const response = await participantsApi.getParticipationDetails(participationId)
            return response.participation
        } catch (e) {
            error.value = e.message
            return null
        } finally {
            loading.value = false
        }
    }

    return {
        quizzes,
        currentQuiz,
        loading,
        error,
        fetchMyQuizzes,
        fetchQuiz,
        fetchQuizForPlay,
        createQuiz,
        addQuestion,
        deleteQuiz,
        submitParticipation,
        fetchQuizStats,
        fetchParticipationDetails,
    }
})
