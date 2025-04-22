
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Logo from '@/components/Logo';
import { toast } from '@/components/ui/use-toast';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading, signIn, signUp, resetPassword, updatePassword } = useAuth();

  useEffect(() => {
    // Check if this is a password reset page
    const resetParam = new URLSearchParams(location.search).get('reset');
    if (resetParam === 'true') {
      setIsResetPassword(true);
    }
  }, [location]);

  // Wait until we're sure about authentication state before redirecting
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      if (!email) {
        toast({
          title: "Error",
          description: "Please enter your email address",
          variant: "destructive",
        });
        return;
      }
      
      const success = await resetPassword(email);
      if (success) {
        setIsForgotPassword(false);
      }
      return;
    }
    
    if (isResetPassword) {
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
      
      const success = await updatePassword(password);
      if (success) {
        setIsResetPassword(false);
      }
      return;
    }
    
    if (isSignUp) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
      navigate('/');
    }
  };

  const renderForgotPasswordForm = () => (
    <>
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
        Reset Password
      </h2>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
        Send Reset Instructions
      </Button>
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsForgotPassword(false)}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Back to Login
        </button>
      </div>
    </>
  );

  const renderResetPasswordForm = () => (
    <>
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
        Set New Password
      </h2>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
        Update Password
      </Button>
    </>
  );

  const renderAuthForm = () => (
    <>
      <h2 className="text-2xl font-semibold text-center text-gray-900">
        LMS {isSignUp ? 'Sign Up' : 'Login'}
      </h2>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
        {isSignUp ? 'Sign Up' : 'Login'}
      </Button>
      {!isSignUp && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsForgotPassword(true)}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Forgot Password?
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white shadow-xl border-0">
        <CardHeader className="flex flex-col items-center space-y-2 pb-0">
          <Logo />
          {!isForgotPassword && !isResetPassword && (
            <div className="w-full flex justify-center space-x-8 mt-8 border-b">
              <button
                className={`pb-4 px-8 ${!isSignUp ? 'text-blue-500 border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setIsSignUp(false)}
              >
                Login
              </button>
              <button
                className={`pb-4 px-8 ${isSignUp ? 'text-blue-500 border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {isForgotPassword
              ? renderForgotPasswordForm()
              : isResetPassword
              ? renderResetPasswordForm()
              : renderAuthForm()}
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
