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
    <div className="auth">
      {error && <p className="auth__error">{error}</p>}
      
      <div className="auth__fields">
        <Input 
          type="email" 
          placeholder="EMAIL" 
          variant="minimal"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input 
          type="password" 
          placeholder="PASSWORD" 
          variant="minimal"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="auth__actions">
        <Button 
          onClick={handleLogin} 
          disabled={loading}
          variant="minimal"
          className="btn--full"
        >
          {loading ? 'Entering...' : 'Enter Dashboard'}
        </Button>
      </div>
    </div>
  );
}
