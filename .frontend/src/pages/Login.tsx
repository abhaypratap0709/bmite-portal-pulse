import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LocationState } from '@/types';
import { createEmailValidator, createPasswordValidator, useRealTimeValidation } from '@/utils/validation';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  // Form validation - only email validation for login
  const emailValidator = createEmailValidator();
  const emailValidation = useRealTimeValidation(emailValidator);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    emailValidation.validateField('email', value);
    emailValidation.markFieldTouched('email');
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - only check email format and non-empty fields
    if (!email || !password) {
      return;
    }
    
    // Only validate email format, not password complexity for login
    const emailError = emailValidation.getFieldError('email');
    if (emailError) {
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error is handled by the login function
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    {
      role: 'Admin',
      email: 'admin@bmiet.edu.in',
      password: 'admin123',
      description: 'Full access to all features'
    },
    {
      role: 'Faculty',
      email: 'faculty@bmiet.edu.in',
      password: 'faculty123',
      description: 'Access to student management'
    },
    {
      role: 'Student',
      email: 'rahul.sharma@bmiet.edu.in',
      password: 'student123',
      description: 'Student portal access'
    }
  ];

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    // Trigger email validation for demo credentials
    emailValidation.validateField('email', demoEmail);
    emailValidation.markFieldTouched('email');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary rounded-full">
                  <GraduationCap className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your BMIET Portal account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    className={emailValidation.getFieldError('email') ? 'border-red-500 focus:border-red-500' : ''}
                    required
                  />
                  {emailValidation.getFieldError('email') && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      {emailValidation.getFieldError('email')}
                    </div>
                  )}
                </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</h4>
                <div className="space-y-2">
                  {demoCredentials.map((demo, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{demo.role}</p>
                          <p className="text-xs text-gray-600">{demo.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fillDemoCredentials(demo.email, demo.password)}
                          className="text-xs"
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
