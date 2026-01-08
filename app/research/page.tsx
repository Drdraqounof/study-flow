"use client";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Settings, ChevronDown, ChevronUp } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ResearchPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationInput, setConversationInput] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [topicError, setTopicError] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is admin
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  // Get question limit based on user role
  const questionLimit = isAdmin ? 30 : 20;
  const userQuestions = messages.filter(m => m.role === "user").length;

  const handleSendMessage = async () => {
    if (!conversationInput.trim()) {
      setError("Please enter a message");
      return;
    }

    if (!systemPrompt.trim()) {
      setError("Please set a topic in the AI Focus Settings before asking questions");
      setShowSettings(true);
      return;
    }

    // Check question limit
    if (userQuestions >= questionLimit) {
      setError(`You have reached your question limit (${questionLimit} questions). ${isAdmin ? 'As an admin, you have a limit of 30 questions.' : 'Regular users can ask up to 20 questions.'}`);
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: conversationInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setConversationInput("");
    setSending(true);
    setError("");
    setTopicError("");

    try {
      const formData = new FormData();
      formData.append("message", conversationInput);
      formData.append("systemPrompt", systemPrompt.trim());
      formData.append("conversationHistory", JSON.stringify(messages));

      const res = await fetch("/api/research/converse", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (!data.result) {
        throw new Error("No response received from AI");
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.result,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      // Remove the failed user message from history
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="Research" />
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">AI Research Assistant</h2>
          <p className="text-black">Ask questions and get AI-powered answers to help with your studies.</p>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-lg font-semibold text-black mb-4 hover:text-indigo-600 transition-colors w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              AI Focus Settings {!systemPrompt.trim() && <span className="text-red-500 text-sm">(Required)</span>}
            </div>
            {showSettings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {showSettings && (
            <div>
              <label htmlFor="systemPrompt" className="block text-sm font-medium text-black mb-2">
                What topic would you like to discuss? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => {
                  setSystemPrompt(e.target.value);
                  setTopicError("");
                }}
                placeholder="e.g., Biology - specifically cell biology and genetics. Stay focused on these topics only."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-black"
                rows={3}
              />
              {topicError && (
                <p className="text-xs text-red-600 mt-2">
                  {topicError}
                </p>
              )}
              <p className="text-xs text-gray-600 mt-2">
                Set your topic here. The AI will stay focused on this topic throughout your conversation. You can change it anytime during the conversation.
              </p>
              {messages.length > 0 && (
                <p className="text-xs text-amber-600 mt-2 font-semibold">
                  ⚠ Changing the topic mid-conversation will apply to all future messages.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Ask Questions</h3>
            <div className="text-sm text-black">
              <span className={userQuestions >= questionLimit ? "text-red-600 font-semibold" : ""}>
                {userQuestions} / {questionLimit}
              </span>
              <span className="text-gray-500 ml-1">questions {isAdmin && '(Admin)'}</span>
            </div>
          </div>
          
          {/* Conversation Messages */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Start a conversation by asking a question below</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-200 text-black"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user" ? "text-indigo-200" : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Input Section */}
          <div className="flex gap-2">
            <input
              type="text"
              value={conversationInput}
              onChange={(e) => setConversationInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
              placeholder="Ask a question..."
              disabled={sending}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
            />
            <button
              onClick={handleSendMessage}
              disabled={!conversationInput.trim() || sending}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}





