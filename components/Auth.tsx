'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {error && (
        <p className="text-[10px] text-[#E57373] uppercase tracking-widest animate-pulse">
          {error}
        </p>
      )}
      
      <div className="space-y-4">
        <Input 
          type="email" 
          placeholder="EMAIL" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent border-0 border-b border-black/10 rounded-none px-0 text-center uppercase tracking-[0.2em] text-xs placeholder:text-black/20 focus:ring-0 focus:border-black transition-all"
        />
        <Input 
          type="password" 
          placeholder="PASSWORD" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="bg-transparent border-0 border-b border-black/10 rounded-none px-0 text-center uppercase tracking-[0.2em] text-xs placeholder:text-black/20 focus:ring-0 focus:border-black transition-all"
        />
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleLogin} 
          disabled={loading}
          className="w-full bg-transparent border border-black/20 text-black hover:bg-black hover:text-white rounded-none text-[10px] uppercase tracking-[0.3em] h-12 transition-all duration-500"
        >
          {loading ? 'Entering...' : 'Enter Dashboard'}
        </Button>
      </div>
    </div>
  );
}
