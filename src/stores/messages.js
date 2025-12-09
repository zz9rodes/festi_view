import { defineStore } from "pinia"
import { ref } from "vue"
import { messagesApi } from "@/services/api"

export const useMessagesStore = defineStore("messages", () => {
    const messages = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function fetchMessages() {
        loading.value = true
        error.value = null

        try {
            const response = await messagesApi.getMessages()
            messages.value = response.messages || []
        } catch (e) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    async function sendMessage(userId, content) {
        loading.value = true
        error.value = null

        try {
            await messagesApi.sendMessage(userId, content)
            return true
        } catch (e) {
            error.value = e.message
            return false
        } finally {
            loading.value = false
        }
    }

    async function deleteMessage(id) {
        loading.value = true
        error.value = null

        try {
            await messagesApi.deleteMessage(id)
            messages.value = messages.value.filter((m) => m.id !== id)
            return true
        } catch (e) {
            error.value = e.message
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        messages,
        loading,
        error,
        fetchMessages,
        sendMessage,
        deleteMessage,
    }
})
