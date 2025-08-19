// +
      // `Số ghế trống: ${trip.available_seats || 'N/A'}\n` +
      // `Trạng thái: ${trip.status || 'N/A'}\n`
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../User/ChatBot.css';
import ChatbotIcon from '../User/ChatBotIcon';
import { FaPaperPlane, FaRobot } from 'react-icons/fa'; 

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user', timestamp: new Date().toLocaleTimeString() };
    setMessages([...messages, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/chat', { question: input });
      const data = response.data.response;

      let reply;
      if (typeof data === 'string') {
        reply = data;
      } else if (Array.isArray(data)) {
        reply = formatTripsResponse(data);
        const tripIds = data.map(trip => trip.id || trip.trip_id).filter(id => id);
        saveTripHistory(tripIds);
      } else {
        reply = 'Không thể xử lý phản hồi từ server.';
      }

      setMessages(prev => [...prev, { text: reply, sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Lỗi khi gọi API: ' + error.message, sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
    }

    setInput('');
    setIsLoading(false);
  };

  const formatTripsResponse = (trips) => {
    if (trips.length === 0) return 'Không tìm thấy chuyến xe phù hợp.';
    return trips.map(trip => (
      `**Chuyến xe ${trip.bus_name || 'N/A'} (${trip.bus_type || 'N/A'})**\n` +
      `**Từ**: ${trip.from_station} (${trip.from_province})\n` +
      `**Đến**: ${trip.to_station} (${trip.to_province})\n` +
      `**Khởi hành**: ${trip.departure_time}\n` +
      `**Giá**: ${trip.price} VND\n`
    )).join('\n---\n');
  };

  const saveTripHistory = (tripIds) => {
    let history = JSON.parse(localStorage.getItem('tripHistory') || '[]');
    history = [...new Set([...tripIds, ...history])].slice(0, 3);
    localStorage.setItem('tripHistory', JSON.stringify(history));
  };

  const handleRecommend = async () => {
    const history = JSON.parse(localStorage.getItem('tripHistory') || '[]');
    if (history.length === 0) {
      setMessages(prev => [...prev, { text: 'Chưa có lịch sử xem chuyến xe.', sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/recommend', { trip_ids: history });
      const data = response.data.response;
      const reply = formatTripsResponse(data);
      setMessages(prev => [...prev, { text: 'Đề xuất chuyến xe:\n' + reply, sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Lỗi khi lấy đề xuất: ' + error.message, sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      {!isOpen && <ChatbotIcon onClick={toggleChatbot} />}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <FaRobot className="header-icon" />
            <h3>Chatbot Tìm Kiếm Chuyến Xe</h3>
            <button onClick={toggleChatbot} aria-label="Close chatbot">×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-content">
                  <pre>{msg.text}</pre>
                  <span className="timestamp">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <div className="spinner"></div>
                <span>Đang xử lý...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="VD: Ngày mai có chuyến từ Hà Nội tới TP.HCM không?"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} aria-label="Send message">
              <FaPaperPlane />
            </button>
          </form>
          <button onClick={handleRecommend} className="recommend-button" disabled={isLoading}>
            Đề xuất chuyến xe
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;