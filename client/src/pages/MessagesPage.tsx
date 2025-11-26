import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
// Imports icons for sending messages and scheduling meetings.
import { Send, Calendar } from "lucide-react";

// -----------------------------------------------------------------------------
// 1. Mock Data and Interfaces
// -----------------------------------------------------------------------------

// Mock data defining the list of available conversations.
const mockConversations = [
  { id: 'support', name: 'Support Team', avatar: 'ST', lastMessage: 'How can we help you?', isPinned: true },
  { id: '1', name: 'John Doe', avatar: 'JD', lastMessage: 'Is the textbook still available?' },
  { id: '2', name: 'Jane Smith', avatar: 'JS', lastMessage: 'Thanks for the quick response!' },
];

// Interface defining the structure of a single message.
interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them'; // Indicates direction of the message.
  timestamp: string;
}

// Initial state for messages, mapping chat IDs to their message history arrays.
const initialMessages: Record<string, Message[]> = {
  'support': [
    { id: '1', text: 'How can we help you?', sender: 'them', timestamp: '10:30 AM' },
  ],
  '1': [
    { id: '1', text: 'Is the textbook still available?', sender: 'them', timestamp: '10:30 AM' },
  ],
  '2': [
    { id: '1', text: 'Thanks for the quick response!', sender: 'them', timestamp: '10:30 AM' },
  ],
};

// -----------------------------------------------------------------------------
// 2. MessagesPage Component
// -----------------------------------------------------------------------------

export default function MessagesPage() {
  // State tracks which conversation object is currently selected. Defaults to the first mock conversation.
  const [selectedChat, setSelectedChat] = useState(mockConversations[0]);
  // State for the text currently being typed in the message input.
  const [message, setMessage] = useState("");
  // State storing the message history for all chats.
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);

  // Handler for sending a new message.
  const handleSendMessage = () => {
    if (!message.trim()) return; // Only send if message is not empty.
    
    const now = new Date();
    // Formats the current time for the timestamp.
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    const newMessage: Message = {
      id: Date.now().toString(), // Unique ID based on timestamp.
      text: message,
      sender: 'me', // Always sent by the current user in this handler.
      timestamp: timeString,
    };

    // Updates the messages state by appending the new message to the selected chat's history.
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
    }));
    
    setMessage(""); // Clears the input field.
  };

  // Retrieves the message array for the currently selected chat.
  const currentMessages = messages[selectedChat.id] || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Grid container for the two-column layout. Fixed height is calculated relative to the viewport. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        
        {/* Conversations List (Left Column) */}
        <Card className="md:col-span-1 p-4">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          {/* Scrollable area for the list of conversations. */}
          <ScrollArea className="h-[calc(100%-3rem)]">
            <div className="space-y-2">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv)} // Sets the active chat on click.
                  className={`w-full p-3 rounded-md text-left hover-elevate ${
                    // Highlights the button if it matches the selected chat ID.
                    selectedChat.id === conv.id ? 'bg-accent' : ''
                  }`}
                  data-testid={`chat-${conv.id}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar Display */}
                    <Avatar>
                      {/* Uses DiceBear API for mock avatars based on chat ID. */}
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.id}`} />
                      <AvatarFallback>{conv.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{conv.name}</p>
                        {/* Pinned icon (Conditional) */}
                        {conv.isPinned && (
                          <span className="text-xs text-primary">📌</span>
                        )}
                      </div>
                      {/* Truncated preview of the last message. */}
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area (Right Column) */}
        <Card className="md:col-span-2 p-4 flex flex-col">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between gap-2 pb-4 border-b">
            <div className="flex items-center gap-3">
              {/* Active Chat Avatar and Name */}
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedChat.id}`} />
                <AvatarFallback>{selectedChat.avatar}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{selectedChat.name}</h3>
            </div>
            {/* Action button (Schedule Meeting) */}
            <Button variant="outline" size="sm" data-testid="button-calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>

          {/* Messages Display Area */}
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-4">
              {/* Maps through messages in the current chat */}
              {currentMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  // Aligns message bubble based on sender.
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`rounded-lg p-3 max-w-[70%] ${
                    // Styles the message bubble based on sender.
                    msg.sender === 'me' 
                      ? 'bg-primary text-primary-foreground' // Sent by me (primary color)
                      : 'bg-muted' // Received (muted background)
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      // Styles the timestamp color/opacity based on sender.
                      msg.sender === 'me' ? 'opacity-80' : 'text-muted-foreground'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                // Allows sending the message by pressing the Enter key.
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    handleSendMessage();
                  }
                }}
                data-testid="input-message"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim()} // Disabled if input is empty.
                data-testid="button-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}