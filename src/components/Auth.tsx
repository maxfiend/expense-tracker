import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { RotateCcw } from 'lucide-react';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else alert('Перевірте пошту для підтвердження!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="cyber-card max-w-md w-full bg-black/40 p-8 rounded-lg shadow-xl border border-cyan-500/30"
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center font-mono">
          {isSignUp ? 'Реєстрація' : 'Вхід'}
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-black/30 border border-cyan-500/30 text-cyan-200 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-black/30 border border-cyan-500/30 text-cyan-200 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 font-bold rounded-md border border-cyan-400 hover:bg-cyan-500/30 transition-all duration-300"
          >
            {loading ? (
              <RotateCcw className="animate-spin h-5 w-5 text-yellow-300" />
            ) : null}
            {isSignUp ? 'Зареєструватися' : 'Увійти'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-6 w-full text-purple-400 hover:text-purple-200 text-sm underline font-mono"
        >
          {isSignUp ? 'Вже є акаунт? Увійти' : 'Ще не зареєстровані? Зареєструватись'}
        </button>

        {error && (
          <p className="text-red-400 text-center mt-4 font-mono text-sm">{error}</p>
        )}
      </form>
    </div>
  );
};
