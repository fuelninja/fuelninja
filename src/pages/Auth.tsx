
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import Logo from '@/assets/logo';
import Header from '@/components/layout/Header';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let success;
      
      if (isLogin) {
        success = await login(email, password);
        if (success) {
          toast.success("Logged in successfully!");
          navigate(from, { replace: true });
        } else {
          toast.error("Invalid email or password");
        }
      } else {
        if (!name.trim()) {
          toast.error("Name is required");
          return;
        }
        success = await register(name, email, password);
        if (success) {
          toast.success("Account created successfully!");
          navigate(from, { replace: true });
        } else {
          toast.error("Failed to create account");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Logo size="lg" variant="colored" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Fill in your details to get started'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Processing...' 
                : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-ninja-blue hover:underline"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
          
          {/* Admin login hint for demo purposes */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500">
            <p>Admin demo access: admin@fuelninja.com / admin123</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
