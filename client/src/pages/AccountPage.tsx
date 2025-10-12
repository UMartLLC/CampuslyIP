import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { User, Package, Gavel, ShoppingCart, Megaphone, AlertTriangle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccountPage() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const initialTab = params.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'market', label: 'My Market', icon: Package },
    { id: 'bids', label: 'My Bids', icon: Gavel },
    { id: 'purchases', label: 'My Purchases', icon: ShoppingCart },
    { id: 'locoloco', label: 'My LocoLoco', icon: Megaphone },
    { id: 'report', label: 'Report a Concern', icon: AlertTriangle },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className={cn(
        "border-r bg-card transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-0 overflow-hidden"
      )}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Account Menu</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            data-testid="button-close-sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  activeTab === item.id && "bg-secondary"
                )}
                onClick={() => setActiveTab(item.id)}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Hamburger */}
        {!sidebarOpen && (
          <div className="p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              data-testid="button-open-sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="p-6">
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <Card>
              <CardHeader>
                <CardTitle>Account Dashboard</CardTitle>
                <CardDescription>Manage your account settings and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=student" />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">Student User</h3>
                    <p className="text-sm text-muted-foreground">student@university.edu</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Student User" data-testid="input-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="student@university.edu" data-testid="input-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Change Password</Label>
                    <Input id="password" type="password" placeholder="New password" data-testid="input-password" />
                  </div>
                  <Button data-testid="button-save-changes">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Market Content */}
          {activeTab === 'market' && (
            <Card>
              <CardHeader>
                <CardTitle>My Market</CardTitle>
                <CardDescription>Items you're currently selling or have sold</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No items listed yet. Start selling!</p>
              </CardContent>
            </Card>
          )}

          {/* My Bids Content */}
          {activeTab === 'bids' && (
            <Card>
              <CardHeader>
                <CardTitle>My Bids</CardTitle>
                <CardDescription>Items you've placed bids on</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No active bids.</p>
              </CardContent>
            </Card>
          )}

          {/* My Purchases Content */}
          {activeTab === 'purchases' && (
            <Card>
              <CardHeader>
                <CardTitle>My Purchases</CardTitle>
                <CardDescription>Your purchase history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No purchases yet.</p>
              </CardContent>
            </Card>
          )}

          {/* My LocoLoco Content */}
          {activeTab === 'locoloco' && (
            <Card>
              <CardHeader>
                <CardTitle>My LocoLoco</CardTitle>
                <CardDescription>Manage your advertisements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Under Construction</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report a Concern Content */}
          {activeTab === 'report' && (
            <Card>
              <CardHeader>
                <CardTitle>Report a Concern</CardTitle>
                <CardDescription>Let us know about any issues or concerns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="concern-title">Title</Label>
                  <Input id="concern-title" placeholder="Brief description of the concern" data-testid="input-concern-title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concern-type">Type of Concern</Label>
                  <Select>
                    <SelectTrigger id="concern-type" data-testid="select-concern-type">
                      <SelectValue placeholder="Select concern type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scam">Scam or Fraud</SelectItem>
                      <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concern-description">Description</Label>
                  <Textarea 
                    id="concern-description" 
                    placeholder="Please provide details about your concern" 
                    rows={5}
                    data-testid="textarea-concern-description"
                  />
                </div>
                <Button data-testid="button-submit-report">Submit Report</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
