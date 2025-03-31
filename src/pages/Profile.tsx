
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '@/components/shared/Section';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Camera } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/registration');
        return;
      }

      try {
        const response = await authAPI.getProfile();
        if (response.success) {
          setUser(response.data);
          // Set form default values
          form.reset({
            name: response.data.name,
            email: response.data.email,
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to load profile. Please log in again.",
            variant: "destructive",
          });
          navigate('/registration');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile. Please log in again.",
          variant: "destructive",
        });
        navigate('/registration');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, toast, form]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(data);
      if (response.success) {
        setUser({
          ...user,
          ...data
        });
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
          variant: "default",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24">
        <Section>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6 mb-10">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              View and manage your personal profile information.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Button type="button" variant="outline" className="flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          Change Avatar
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Your name" 
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
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input 
                                  placeholder="Your email" 
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

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={loading}
                          className="bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Full Name</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">{user?.name}</p>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-muted-foreground">Email Address</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t bg-muted/20 pt-6 flex justify-between">
                {!isEditing && (
                  <>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                      Back
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600"
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Solar Community Membership</CardTitle>
                <CardDescription>
                  Your solar community participation information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Current Communities</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user?.communities?.length > 0 
                        ? `You are a member of ${user.communities.length} solar communities.`
                        : "You are not currently a member of any solar communities."}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium">Solar Plans</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user?.plans?.length > 0 
                        ? `You have ${user.plans.length} active solar plans.`
                        : "You don't have any active solar plans yet."}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t bg-muted/20 pt-6">
                <Button variant="outline" asChild>
                  <a href="/registration#join-community">Find Communities</a>
                </Button>
                <Button variant="default" asChild className="bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                  <a href="/data-collection">Create Solar Plan</a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Profile;
