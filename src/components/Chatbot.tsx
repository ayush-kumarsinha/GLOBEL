import { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi Ayush! How can I help you today?" }
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Temporary "typing"
    setMessages((prev) => [...prev, { from: "bot", text: "Typing..." }]);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are Ayush's helpful assistant." },
            { role: "user", content: input }
          ]
        }),
      });

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || "Sorry, I didn’t understand.";

      // Remove "Typing..." and add real reply
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m.text !== "Typing...");
        return [...withoutTyping, { from: "bot", text: botReply }];
      });

    } catch (error) {
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m.text !== "Typing...");
        return [...withoutTyping, { from: "bot", text: "Something went wrong." }];
      });
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg"
      >
        Chat
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col border">
          <div className="bg-blue-600 text-white p-3 flex justify-between">
            <span>Ayush Chatbot</span>
            <button onClick={() => setIsOpen(false)}>X</button>
          </div>

          <div className="flex-1 p-3 overflow-auto">
            {messages.map((m, i) => (
              <p
                key={i}
                className={`my-1 p-2 rounded-lg ${
                  m.from === "user"
                    ? "bg-blue-600 text-white ml-auto max-w-[75%]"
                    : "bg-gray-200 text-black mr-auto max-w-[75%]"
                }`}
              >
                {m.text}
              </p>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border px-2 py-1 rounded text-black"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
