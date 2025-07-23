import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Send, Bot, User, Settings, Upload, Trash2 } from 'lucide-react'

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Xin chào! Tôi là Integrated Manus AI. Tôi có thể giúp bạn với các tác vụ sử dụng OpenManus hoặc Blackbox AI. Bạn cần hỗ trợ gì?',
      timestamp: new Date(),
      mode: 'system'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiMode, setAiMode] = useState('hybrid')
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      mode: aiMode
    }

    setMessages(prev => [...prev, newMessage])
    const currentMessage = inputMessage
    setInputMessage('')
    setIsLoading(true)

    try {
      // Import API service dynamically
      const { default: ApiService } = await import('../services/api.js')
      const response = await ApiService.sendMessage(currentMessage, aiMode)
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(response.timestamp),
        mode: response.mode
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Lỗi khi gửi tin nhắn: ${error.message}. Vui lòng kiểm tra kết nối mạng và thử lại.`,
        timestamp: new Date(),
        mode: 'system'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Lịch sử chat đã được xóa. Tôi có thể giúp gì cho bạn?',
        timestamp: new Date(),
        mode: 'system'
      }
    ])
  }

  const getModeColor = (mode) => {
    switch (mode) {
      case 'blackbox': return 'bg-purple-500'
      case 'openmanus': return 'bg-blue-500'
      case 'hybrid': return 'bg-gradient-to-r from-purple-500 to-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getModeLabel = (mode) => {
    switch (mode) {
      case 'blackbox': return 'Blackbox AI'
      case 'openmanus': return 'OpenManus'
      case 'hybrid': return 'Hybrid AI'
      default: return 'System'
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Integrated Manus AI
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            OpenManus + Blackbox AI Integration
          </p>
        </div>

        {/* AI Mode Selection */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            Chế độ AI
          </label>
          <Select value={aiMode} onValueChange={setAiMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hybrid">🔄 Hybrid Mode</SelectItem>
              <SelectItem value="blackbox">🟣 Blackbox AI</SelectItem>
              <SelectItem value="openmanus">🔵 OpenManus</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {aiMode === 'hybrid' && 'Blackbox AI điều khiển OpenManus'}
            {aiMode === 'blackbox' && 'Chỉ sử dụng Blackbox AI'}
            {aiMode === 'openmanus' && 'Chỉ sử dụng OpenManus Agent'}
          </p>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Lịch sử Chat
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-slate-500 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-slate-500 dark:text-slate-400 p-2 bg-slate-100 dark:bg-slate-700 rounded">
              Phiên chat hiện tại - {messages.length - 1} tin nhắn
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`flex-1 max-w-3xl ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="secondary" className={`text-xs ${getModeColor(message.mode)} text-white`}>
                      {getModeLabel(message.mode)}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <Card className={`${
                    message.role === 'user' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'bg-white dark:bg-slate-800'
                  }`}>
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <Card className="bg-white dark:bg-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <span className="text-sm text-slate-500 ml-2">Đang xử lý...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFileUpload}
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf"
              multiple
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface

