
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '@/components/shared/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, User, Mail, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { authAPI, communityAPI } from '@/services/api';

// Form validation schemas
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password")
});

const communitySchema = z.object({
  communityName: z.string().min(2, "Community name must be at least 2 characters")
});

const searchCommunitySchema = z.object({
  location: z.string().min(2, "Please enter a valid location")
});

const Registration = () => {
  const [activeTab, setActiveTab] = useState('signup');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize forms
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const createCommunityForm = useForm({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      communityName: ''
    }
  });

  const searchCommunityForm = useForm({
    resolver: zodResolver(searchCommunitySchema),
    defaultValues: {
      location: ''
    }
  });

  // Form submission handlers
  const handleSignup = async (data) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      if (response.success) {
        toast({
          title: "Account created successfully",
          description: "You can now log in with your credentials",
          variant: "default",
        });
        // Reset form after successful registration
        signupForm.reset();
        // Switch to login tab
        setActiveTab('login');
        // We don't store token or navigate automatically after signup
      } else {
        toast({
          title: "Registration failed",
          description: response.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({
        email: data.email,
        password: data.password
      });
      
      if (response.success && response.token) {
        // Only store token and redirect after proper login
        localStorage.setItem('token', response.token);
        
        // Get user profile after login
        const profileResponse = await authAPI.getProfile();
        
        if (profileResponse.success) {
          toast({
            title: "Login successful",
            description: `Welcome back, ${profileResponse.data.name || 'User'}!`,
            variant: "default",
          });
          navigate('/data-collection');
        } else {
          toast({
            title: "Login successful",
            description: "Welcome back!",
            variant: "default",
          });
          navigate('/data-collection');
        }
      } else {
        toast({
          title: "Login failed",
          description: response.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCommunity = async (data) => {
    setIsLoading(true);
    try {
      const response = await communityAPI.createCommunity({
        name: data.communityName
      });
      
      if (response.success) {
        toast({
          title: "Community created",
          description: "Your community has been created successfully",
          variant: "default",
        });
        createCommunityForm.reset();
      } else {
        toast({
          title: "Failed to create community",
          description: response.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to create community",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchCommunity = async (data) => {
    setIsLoading(true);
    try {
      const response = await communityAPI.searchCommunities(data.location);
      
      if (response.success) {
        toast({
          title: "Communities found",
          description: `Found ${response.data.length} communities in your area`,
          variant: "default",
        });
        // Additional UI logic can be added here to display the communities
      } else {
        toast({
          title: "Search failed",
          description: response.message || "No communities found",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Section className="pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-right">
            <div className="inline-flex items-center space-x-2">
              <span className="rounded-full bg-primary/10 p-1">
                <UserPlus className="h-4 w-4 text-primary" />
              </span>
              <span className="text-sm font-medium text-primary">User Registration & Community</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Join the Solar Revolution Today
            </h1>
            <p className="text-xl text-muted-foreground">
              Create an account to join existing solar communities or start your own. Together, we can make renewable energy more accessible and affordable.
            </p>
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Easy Sign-Up</h3>
                  <p className="text-sm text-muted-foreground">Create your account in minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Find Your Community</h3>
                  <p className="text-sm text-muted-foreground">Join or create local solar groups</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto animate-slide-in-left">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
              <TabsContent value="signup">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Enter your information to get started with your solar journey.
                    </CardDescription>
                  </CardHeader>
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(handleSignup)}>
                      <CardContent className="space-y-4">
                        <FormField
                          control={signupForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder="John Doe" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </TabsContent>
              <TabsContent value="login">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>
                      Login to your account to continue your solar journey.
                    </CardDescription>
                  </CardHeader>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                      <CardContent className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <a href="#" className="text-sm text-primary hover:underline">
                                  Forgot password?
                                </a>
                              </div>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </FormControl>
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                          disabled={isLoading}
                        >
                          {isLoading ? "Logging in..." : "Login"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Section>

      <Section className="bg-muted/30">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="section-title">Join a Community or Create Your Own</h2>
          <p className="section-subtitle">
            Connect with neighbors and friends to form solar communities, share costs, and maximize your impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-soft animate-scale-in [animation-delay:100ms]">
            <CardHeader>
              <CardTitle>Join an Existing Community</CardTitle>
              <CardDescription>
                Find and join solar communities in your area that are already established.
              </CardDescription>
            </CardHeader>
            <Form {...searchCommunityForm}>
              <form onSubmit={searchCommunityForm.handleSubmit(handleSearchCommunity)}>
                <CardContent className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80" 
                      alt="Community meeting" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white font-medium">20+ Communities Available</div>
                  </div>
                  <FormField
                    control={searchCommunityForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search by Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your city or ZIP code" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    variant="outline" 
                    className="w-full button-animation"
                    disabled={isLoading}
                  >
                    {isLoading ? "Searching..." : "Browse Communities"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card className="shadow-soft animate-scale-in [animation-delay:200ms]">
            <CardHeader>
              <CardTitle>Create a New Community</CardTitle>
              <CardDescription>
                Start your own solar community and invite neighbors to join your initiative.
              </CardDescription>
            </CardHeader>
            <Form {...createCommunityForm}>
              <form onSubmit={createCommunityForm.handleSubmit(handleCreateCommunity)}>
                <CardContent className="space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80" 
                      alt="People starting a community" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white font-medium">Create in Minutes</div>
                  </div>
                  <FormField
                    control={createCommunityForm.control}
                    name="communityName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter a name for your community" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Community"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </Section>
    </div>
  );
};

export default Registration;
