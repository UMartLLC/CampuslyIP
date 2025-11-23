// Referenced from blueprint:javascript_auth_all_persistance
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  // Form states
  const [loginData, setLoginData] = useState({ username: "", password: "", rememberMe: false });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetData, setResetData] = useState({ username: "", newPassword: "", confirmPassword: "" });
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { username: string; newPassword: string }) => {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password.",
      });
      setResetPasswordOpen(false);
      setResetData({ username: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }
    resetPasswordMutation.mutate({
      username: resetData.username,
      newPassword: resetData.newPassword,
    });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">UniMart</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">Log In</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Log in to your UniMart account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        type="text"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                        data-testid="input-login-username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        data-testid="input-login-password"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-me"
                          checked={loginData.rememberMe}
                          onCheckedChange={(checked) => setLoginData({ ...loginData, rememberMe: checked as boolean })}
                          data-testid="checkbox-remember-me"
                        />
                        <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                          Remember me
                        </Label>
                      </div>
                      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="px-0 text-sm" data-testid="button-forgot-password">
                            Forgot password?
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reset Password</DialogTitle>
                            <DialogDescription>
                              Enter your username and choose a new password.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="reset-username">Username</Label>
                              <Input
                                id="reset-username"
                                type="text"
                                value={resetData.username}
                                onChange={(e) => setResetData({ ...resetData, username: e.target.value })}
                                required
                                data-testid="input-reset-username"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reset-password">New Password</Label>
                              <Input
                                id="reset-password"
                                type="password"
                                value={resetData.newPassword}
                                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                                required
                                data-testid="input-reset-password"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reset-confirm-password">Confirm New Password</Label>
                              <Input
                                id="reset-confirm-password"
                                type="password"
                                value={resetData.confirmPassword}
                                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                                required
                                data-testid="input-reset-confirm-password"
                              />
                            </div>
                            <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending} data-testid="button-reset-submit">
                              {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-login-submit">
                      {loginMutation.isPending ? "Logging in..." : "Log In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create account</CardTitle>
                  <CardDescription>Join the UniMart community</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username *</Label>
                      <Input
                        id="register-username"
                        type="text"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        required
                        data-testid="input-register-username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password *</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                        data-testid="input-register-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email (optional)</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        data-testid="input-register-email"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstName">First Name (optional)</Label>
                        <Input
                          id="register-firstName"
                          type="text"
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                          data-testid="input-register-firstName"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-lastName">Last Name (optional)</Label>
                        <Input
                          id="register-lastName"
                          type="text"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                          data-testid="input-register-lastName"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={registerMutation.isPending} data-testid="button-register-submit">
                      {registerMutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex bg-primary text-primary-foreground p-12 items-center justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Student Marketplace</h1>
          <p className="text-xl mb-8 opacity-90">
            Buy, sell, and trade items with fellow students on campus. From textbooks to electronics, find everything you need.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
              <div>
                <div className="font-semibold">Safe & Verified</div>
                <div className="text-sm opacity-80">Trade within your campus community</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
              <div>
                <div className="font-semibold">Easy Payments</div>
                <div className="text-sm opacity-80">Multiple secure payment options</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
              <div>
                <div className="font-semibold">Direct Messaging</div>
                <div className="text-sm opacity-80">Chat with buyers and sellers instantly</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
