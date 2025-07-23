const API_BASE_URL = 'http://localhost:5000/api'

class ApiService {
  async sendMessage(message, mode = 'hybrid') {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          mode
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  async getChatHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting chat history:', error)
      throw error
    }
  }

  async getConfig() {
    try {
      const response = await fetch(`${API_BASE_URL}/config`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting config:', error)
      throw error
    }
  }

  async updateConfig(config) {
    try {
      const response = await fetch(`${API_BASE_URL}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating config:', error)
      throw error
    }
  }

  async getModels() {
    try {
      const response = await fetch(`${API_BASE_URL}/models`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting models:', error)
      throw error
    }
  }
}

export default new ApiService()

