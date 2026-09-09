import { useState } from 'react';
import { motion } from 'framer-motion';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { registerGenerate, registerVerify, loginGenerate, loginVerify } from '../api/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export function AuthPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const options = await registerGenerate(email);
      const attResp = await startRegistration(options);
      const verificationResp = await registerVerify(attResp);
      
      if (verificationResp && verificationResp.verified) {
        // Registration successful, but usually requires login afterwards or returns session
        // For simplicity, we assume we need to login or we get a session automatically
        // If the backend sets the cookie on registerVerify, we can just fetch session
        window.location.reload(); 
      } else {
        setError('Registration verification failed');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const options = await loginGenerate(email);
      const asseResp = await startAuthentication(options);
      const verificationResp = await loginVerify(asseResp);
      
      if (verificationResp && verificationResp.verified) {
        // We'll let the app router or page reload handle getting the session
        window.location.reload();
      } else {
        setError('Login verification failed');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
            <span className="text-3xl font-bold text-white">L</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-50 mb-2">LifeOS</h1>
          <p className="text-slate-400">Your secure second brain</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error || undefined}
              disabled={isLoading}
            />
            
            <div className="flex flex-col gap-3 pt-2">
              <Button 
                onClick={handleLogin} 
                isLoading={isLoading} 
                className="w-full"
              >
                Sign In with Passkey
              </Button>
              <Button 
                onClick={handleRegister} 
                variant="secondary" 
                disabled={isLoading} 
                className="w-full"
              >
                Create Passkey
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
