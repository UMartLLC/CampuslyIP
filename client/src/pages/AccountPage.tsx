import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { User, Package, Gavel, ShoppingCart, Megaphone, AlertTriangle } from "lucide-react";

export default function AccountPage() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const initialTab = params.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="flex gap-6">
        <TabsList className="flex flex-col h-auto w-48 bg-card p-2">
          <TabsTrigger value="dashboard" className="w-full justify-start gap-3" data-testid="tab-dashboard">
            <User className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="market" className="w-full justify-start gap-3" data-testid="tab-market">
            <Package className="h-4 w-4" />
            <span>My Market</span>
          </TabsTrigger>
          <TabsTrigger value="bids" className="w-full justify-start gap-3" data-testid="tab-bids">
            <Gavel className="h-4 w-4" />
            <span>My Bids</span>
          </TabsTrigger>
          <TabsTrigger value="purchases" className="w-full justify-start gap-3" data-testid="tab-purchases">
            <ShoppingCart className="h-4 w-4" />
            <span>Purchases</span>
          </TabsTrigger>
          <TabsTrigger value="locoloco" className="w-full justify-start gap-3" data-testid="tab-locoloco">
            <Megaphone className="h-4 w-4" />
            <span>My LocoLoco</span>
          </TabsTrigger>
          <TabsTrigger value="report" className="w-full justify-start gap-3" data-testid="tab-report">
            <AlertTriangle className="h-4 w-4" />
            <span>Report</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
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
          </TabsContent>

          {/* My Market Tab */}
          <TabsContent value="market">
            <Card>
              <CardHeader>
                <CardTitle>My Market</CardTitle>
                <CardDescription>Items you're currently selling or have sold</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No items listed yet. Start selling!</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Bids Tab */}
          <TabsContent value="bids">
            <Card>
              <CardHeader>
                <CardTitle>My Bids</CardTitle>
                <CardDescription>Items you've placed bids on</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No active bids.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Purchases Tab */}
          <TabsContent value="purchases">
            <Card>
              <CardHeader>
                <CardTitle>My Purchases</CardTitle>
                <CardDescription>Your purchase history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No purchases yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My LocoLoco Tab */}
          <TabsContent value="locoloco">
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
          </TabsContent>

          {/* Report a Concern Tab */}
          <TabsContent value="report">
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
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
