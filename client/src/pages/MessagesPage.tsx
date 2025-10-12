import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Calendar } from "lucide-react";

const mockConversations = [
  { id: 'support', name: 'Support Team', avatar: 'ST', lastMessage: 'How can we help you?', isPinned: true },
  { id: '1', name: 'John Doe', avatar: 'JD', lastMessage: 'Is the textbook still available?' },
  { id: '2', name: 'Jane Smith', avatar: 'JS', lastMessage: 'Thanks for the quick response!' },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(mockConversations[0]);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    console.log('Sending message:', message);
    setMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <Card className="md:col-span-1 p-4">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          <ScrollArea className="h-[calc(100%-3rem)]">
            <div className="space-y-2">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv)}
                  className={`w-full p-3 rounded-md text-left hover-elevate ${
                    selectedChat.id === conv.id ? 'bg-accent' : ''
                  }`}
                  data-testid={`chat-${conv.id}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.id}`} />
                      <AvatarFallback>{conv.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{conv.name}</p>
                        {conv.isPinned && (
                          <span className="text-xs text-primary">📌</span>
                        )}
                      </div>
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

        {/* Chat Area */}
        <Card className="md:col-span-2 p-4 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedChat.id}`} />
                <AvatarFallback>{selectedChat.avatar}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{selectedChat.name}</h3>
            </div>
            <Button variant="outline" size="sm" data-testid="button-calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">{selectedChat.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">Hi, yes I'm interested!</p>
                  <p className="text-xs opacity-80 mt-1">10:32 AM</p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                data-testid="input-message"
              />
              <Button onClick={handleSendMessage} data-testid="button-send">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
