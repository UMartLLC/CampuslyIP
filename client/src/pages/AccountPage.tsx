import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Package, Gavel, ShoppingCart, Megaphone, AlertTriangle, Plus, Trash2, History, RotateCcw, Pencil } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Item } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import EditItemDialog from "@/components/EditItemDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check for tab query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveSection(tab);
    }
  }, []);

  // Fetch user's items for My Market
  const { data: userItems = [], isLoading: isLoadingItems } = useQuery<Item[]>({
    queryKey: [`/api/items?sellerId=${user?.id}`],
    enabled: !!user?.id && activeSection === "market",
  });

  // Fetch all user's items for history (including deleted)
  const { data: allUserItems = [], isLoading: isLoadingHistory } = useQuery<Item[]>({
    queryKey: [`/api/items?sellerId=${user?.id}&includeDeleted=true`],
    enabled: !!user?.id && activeSection === "history",
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          typeof query.queryKey[0] === 'string' && 
          query.queryKey[0].startsWith('/api/items')
      });
      toast({
        title: "Item Deleted",
        description: "Your listing has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const repostItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/items/${itemId}/repost`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to repost item');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          typeof query.queryKey[0] === 'string' && 
          query.queryKey[0].startsWith('/api/items')
      });
      toast({
        title: "Item Reposted",
        description: "Your listing is now active again.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to repost item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const editItemMutation = useMutation({
    mutationFn: async ({ itemId, formData }: { itemId: string; formData: FormData }) => {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update item');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          typeof query.queryKey[0] === 'string' && 
          query.queryKey[0].startsWith('/api/items')
      });
      setEditingItem(null);
      toast({
        title: "Item Updated",
        description: "Your listing has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditItem = (itemId: string, formData: FormData) => {
    editItemMutation.mutate({ itemId, formData });
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: User },
    { id: "market", label: "My Market", icon: Package },
    { id: "history", label: "Items History", icon: History },
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
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-2xl font-bold">${item.price}</span>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setEditingItem(item)}
                                data-testid={`button-edit-item-${item.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    data-testid={`button-delete-item-${item.id}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{item.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel data-testid={`button-cancel-delete-${item.id}`}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteItemMutation.mutate(item.id)}
                                      data-testid={`button-confirm-delete-${item.id}`}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Items History Section */}
            {activeSection === "history" && (
              <>
                <div className="mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">ALL YOUR LISTINGS</p>
                    <h1 className="text-2xl font-bold">Items History</h1>
                    <p className="text-sm text-muted-foreground mt-2">View all items you've posted, including sold and deleted items. You can repost deleted items anytime.</p>
                  </div>
                </div>
                
                {isLoadingHistory ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading your history...</p>
                  </div>
                ) : allUserItems.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">No items in history</p>
                      <p className="text-muted-foreground mb-4">Items you post will appear here</p>
                      <Button onClick={() => setLocation('/sell')} data-testid="button-start-selling-history">
                        <Plus className="h-4 w-4 mr-2" />
                        List Your First Item
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {/* Available Items */}
                    {allUserItems.filter(item => !item.deletedAt && item.status === 'available').length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">Available ({allUserItems.filter(item => !item.deletedAt && item.status === 'available').length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allUserItems.filter(item => !item.deletedAt && item.status === 'available').map((item) => (
                            <Card key={item.id} className="overflow-hidden" data-testid={`card-history-item-${item.id}`}>
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
                                  <Badge variant="default">Available</Badge>
                                </div>
                                <CardDescription className="line-clamp-2">
                                  {item.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex justify-between items-center">
                                  <span className="text-xl font-bold">${item.price}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sold Items */}
                    {allUserItems.filter(item => !item.deletedAt && item.status === 'sold').length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">Sold ({allUserItems.filter(item => !item.deletedAt && item.status === 'sold').length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allUserItems.filter(item => !item.deletedAt && item.status === 'sold').map((item) => (
                            <Card key={item.id} className="overflow-hidden opacity-75" data-testid={`card-history-item-${item.id}`}>
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
                                  <Badge variant="secondary">Sold</Badge>
                                </div>
                                <CardDescription className="line-clamp-2">
                                  {item.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex justify-between items-center">
                                  <span className="text-xl font-bold">${item.price}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Deleted Items */}
                    {allUserItems.filter(item => item.deletedAt).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Deleted ({allUserItems.filter(item => item.deletedAt).length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allUserItems.filter(item => item.deletedAt).map((item) => (
                            <Card key={item.id} className="overflow-hidden opacity-60" data-testid={`card-history-item-${item.id}`}>
                              {item.images && item.images.length > 0 && (
                                <div className="aspect-video overflow-hidden">
                                  <img 
                                    src={item.images[0]} 
                                    alt={item.title}
                                    className="w-full h-full object-cover grayscale"
                                  />
                                </div>
                              )}
                              <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                  <CardTitle className="text-lg">{item.title}</CardTitle>
                                  <Badge variant="outline">Deleted</Badge>
                                </div>
                                <CardDescription className="line-clamp-2">
                                  {item.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex justify-between items-center gap-2">
                                  <span className="text-xl font-bold">${item.price}</span>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => repostItemMutation.mutate(item.id)}
                                    disabled={repostItemMutation.isPending}
                                    data-testid={`button-repost-item-${item.id}`}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Repost
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
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
                  <CardDescription>
                    Describe your issue in detail so we can help you resolve it quickly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="concern-type" className="text-base font-semibold">
                      What type of issue are you experiencing? <span className="text-destructive">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger id="concern-type" data-testid="select-concern-type">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purchase" data-testid="select-item-purchase">Purchase Related Issue</SelectItem>
                        <SelectItem value="fraud" data-testid="select-item-fraud">Fraud or Scam</SelectItem>
                        <SelectItem value="site" data-testid="select-item-site">Website or Technical Issue</SelectItem>
                        <SelectItem value="other" data-testid="select-item-other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Choose the category that best describes your concern
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="concern-description" className="text-base font-semibold">
                      Describe EXACTLY what the issue is <span className="text-destructive">*</span>
                    </Label>
                    <Textarea 
                      id="concern-description" 
                      placeholder="Please provide specific details:&#10;&#10;• What happened?&#10;• When did it occur?&#10;• What item or transaction is involved (if applicable)?&#10;• What did you expect to happen?&#10;• Include any relevant order numbers, usernames, or item IDs" 
                      rows={10}
                      data-testid="textarea-concern-description"
                      className="resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      The more specific you are, the faster we can resolve your issue. Include dates, times, item names, transaction details, and any error messages you received.
                    </p>
                  </div>

                  <Button data-testid="button-submit-report" className="w-full">
                    Submit Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Item Dialog */}
      {editingItem && (
        <EditItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onSubmit={handleEditItem}
          isLoading={editItemMutation.isPending}
        />
      )}
    </SidebarProvider>
  );
}
