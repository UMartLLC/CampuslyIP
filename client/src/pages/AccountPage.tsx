import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { UserPlus, Home, FileText, PlusCircle, Grid, Table2, User, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [showSuccess, setShowSuccess] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "Sierra",
    lastName: "Brooks",
    email: "sierra@example.com",
    password: "",
    address: "1234 Main St",
    city: "",
    state: "",
    zip: "",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Odio eaque, quidem, commodi soluta qui ipsa minima obcaecati quod iusto alias, assumenda egestas cumque?"
  });

  const sidebarItems = [
    { id: "blog-dashboard", label: "Blog Dashboard", icon: Home },
    { id: "blog-posts", label: "Blog Posts", icon: FileText },
    { id: "add-post", label: "Add New Post", icon: PlusCircle },
    { id: "forms", label: "Forms & Components", icon: Grid },
    { id: "tables", label: "Tables", icon: Table2 },
    { id: "profile", label: "User Profile", icon: User, active: true },
    { id: "errors", label: "Errors", icon: AlertCircle },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

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
                S
              </div>
              <span className="font-semibold">Shards Dashboards</span>
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
                          isActive={item.active}
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
          {/* Success Alert */}
          {showSuccess && (
            <Alert className="m-6 bg-green-500 text-white border-green-600">
              <AlertDescription className="flex items-center justify-between gap-2">
                <span>Success! Your profile has been updated!</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSuccess(false)}
                  className="text-white"
                  data-testid="button-close-alert"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">OVERVIEW</p>
              <h1 className="text-2xl font-bold">User Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center mb-6">
                      <Avatar className="h-32 w-32 mb-4">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=sierra" />
                        <AvatarFallback>SB</AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-bold mb-1">Sierra Brooks</h2>
                      <p className="text-sm text-muted-foreground mb-4">Project Manager</p>
                      <Button variant="outline" size="sm" className="gap-2" data-testid="button-follow">
                        <UserPlus className="h-4 w-4" />
                        Follow
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-sm font-medium">Workload</span>
                          <span className="text-sm font-medium">74%</span>
                        </div>
                        <Progress value={74} className="h-2" />
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground">
                          Lorem ipsum dolor sit amet consectetur adipiscing elit. Odio eaque, quidem, commodi soluta qui quae quod dolorum sit alias, possimus illum assumenda eligendi cumque?
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Account Details Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            data-testid="input-first-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            data-testid="input-last-name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            data-testid="input-email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            data-testid="input-password"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="1234 Main St"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          data-testid="input-address"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            data-testid="input-city"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                            <SelectTrigger id="state" data-testid="select-state">
                              <SelectValue placeholder="Choose" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ca">California</SelectItem>
                              <SelectItem value="ny">New York</SelectItem>
                              <SelectItem value="tx">Texas</SelectItem>
                              <SelectItem value="fl">Florida</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">Zip</Label>
                          <Input
                            id="zip"
                            value={formData.zip}
                            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                            data-testid="input-zip"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          data-testid="textarea-description"
                        />
                      </div>

                      <Button type="submit" data-testid="button-update-account">
                        Update Account
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
