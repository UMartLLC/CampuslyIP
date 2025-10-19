import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Package, Gavel, ShoppingCart, Megaphone, AlertTriangle, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import type { Item } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarHeader,
} from "@/components/ui/sidebar";

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user's items for My Market
  const { data: userItems = [], isLoading: isLoadingItems } = useQuery<Item[]>({
    queryKey: [`/api/items?sellerId=${user?.id}`],
    enabled: !!user?.id && activeSection === "market",
  });

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: User },
    { id: "market", label: "My Market", icon: Package },
    { id: "bids", label: "My Bids", icon: Gavel },
    { id: "purchases", label: "My Purchases", icon: ShoppingCart },
    { id: "locoloco", label: "My LocoLoco", icon: Megaphone },
    { id: "report", label: "Report a Concern", icon: AlertTriangle },
  ];

  const sidebarStyle = {
    "--sidebar-width": "13rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-[calc(100vh-4rem)] w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                U
              </div>
              <span className="font-semibold">UniMart Account</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activeSection === item.id}
                          onClick={() => setActiveSection(item.id)}
                          data-testid={`nav-${item.id}`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-muted/20">
          <div className="p-6">
            {/* Dashboard Section */}
            {activeSection === "dashboard" && (
              <>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">OVERVIEW</p>
                  <h1 className="text-2xl font-bold">Account Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Card */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <Avatar className="h-32 w-32 mb-4">
                            <AvatarImage src={user?.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
                            <AvatarFallback>
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <h2 className="text-xl font-bold mb-1" data-testid="text-username">
                            {user?.firstName} {user?.lastName}
                          </h2>
                          <p className="text-sm text-muted-foreground mb-4" data-testid="text-email">
                            {user?.email}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Account Details Form */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue={user?.firstName || ""} data-testid="input-firstName" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue={user?.lastName || ""} data-testid="input-lastName" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user?.email || ""} disabled data-testid="input-email" />
                        </div>
                        <Button data-testid="button-save-changes">Save Changes</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {/* My Market Section */}
            {activeSection === "market" && (
              <>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">YOUR LISTINGS</p>
                    <h1 className="text-2xl font-bold">My Market</h1>
                  </div>
                  <Button onClick={() => setLocation('/sell')} data-testid="button-sell-item">
                    <Plus className="h-4 w-4 mr-2" />
                    Sell Item
                  </Button>
                </div>
                
                {isLoadingItems ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading your items...</p>
                  </div>
                ) : userItems.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">No items listed yet</p>
                      <p className="text-muted-foreground mb-4">Start selling by creating your first listing!</p>
                      <Button onClick={() => setLocation('/sell')} data-testid="button-start-selling">
                        <Plus className="h-4 w-4 mr-2" />
                        List Your First Item
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden" data-testid={`card-item-${item.id}`}>
                        {item.images && item.images.length > 0 && (
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={item.images[0]} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {item.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold">${item.price}</span>
                            <Button variant="outline" size="sm" data-testid={`button-view-item-${item.id}`}>
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* My Bids Section */}
            {activeSection === "bids" && (
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

            {/* My Purchases Section */}
            {activeSection === "purchases" && (
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

            {/* My LocoLoco Section */}
            {activeSection === "locoloco" && (
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

            {/* Report a Concern Section */}
            {activeSection === "report" && (
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
                        <SelectItem value="scam" data-testid="select-item-scam">Scam or Fraud</SelectItem>
                        <SelectItem value="inappropriate" data-testid="select-item-inappropriate">Inappropriate Content</SelectItem>
                        <SelectItem value="technical" data-testid="select-item-technical">Technical Issue</SelectItem>
                        <SelectItem value="other" data-testid="select-item-other">Other</SelectItem>
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
    </SidebarProvider>
  );
}
