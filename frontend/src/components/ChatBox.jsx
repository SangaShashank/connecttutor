import { useState, useEffect, useRef } from 'react'
import { socket } from '../socket'
import { getMessages } from '../api/message'

function ChatBox({ bookingId, currentUserId, onClose }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Load past messages
    getMessages(bookingId).then(setMessages).catch(console.error)

    // Join this booking's chat room
    socket.emit('join_room', bookingId)

    // Listen for new incoming messages
    const handleReceive = (message) => {
      setMessages((prev) => [...prev, message])
    }
    socket.on('receive_message', handleReceive)

    // Cleanup: stop listening when component unmounts
    return () => {
      socket.off('receive_message', handleReceive)
    }
  }, [bookingId])

  useEffect(() => {
    // Auto-scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    socket.emit('send_message', {
      bookingId,
      senderId: currentUserId,
      text: newMessage.trim()
    })

    setNewMessage('')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-navy/10 flex flex-col h-96 w-full max-w-sm">
      <div className="flex justify-between items-center px-4 py-3 border-b border-navy/10 bg-navy text-cream rounded-t-2xl">
        <span className="font-medium text-sm">Chat</span>
        <button onClick={onClose} className="text-cream/70 hover:text-amber text-sm">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => {
          const isMine = msg.senderId._id === currentUserId || msg.senderId === currentUserId
          return (
            <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                isMine ? 'bg-navy text-cream' : 'bg-navy/10 text-charcoal'
              }`}>
                {msg.text}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-navy/10">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-navy/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
        />
        <button
          type="submit"
          className="bg-navy text-cream px-4 rounded-lg text-sm font-medium hover:bg-navy-dark transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatBox