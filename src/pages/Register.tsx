import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '', 
    businessName: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password) {
      toast({ title: 'Missing Fields', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    
    if (form.password.length < 6) {
      toast({ title: 'Weak Password', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await register(form);
      toast({ title: 'Registration Successful!', description: 'Welcome to LedgerFlow' });
      navigate('/');
    } catch (error: any) {
      toast({ 
        title: 'Registration Failed', 
        description: error.response?.data?.message || 'Something went wrong', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-display">LedgerFlow</h1>
          <p className="text-muted-foreground mt-1">Manage your business accounts</p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Create Account</CardTitle>
            <CardDescription>Register to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input 
                  placeholder="John Doe" 
                  value={form.name} 
                  onChange={e => updateForm('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={form.email} 
                  onChange={e => updateForm('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password *</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={form.password} 
                  onChange={e => updateForm('password', e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label>Phone Number (Optional)</Label>
                <Input 
                  placeholder="+91 9876543210" 
                  value={form.phone} 
                  onChange={e => updateForm('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Business Name (Optional)</Label>
                <Input 
                  placeholder="My Business" 
                  value={form.businessName} 
                  onChange={e => updateForm('businessName', e.target.value)}
                />
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login here</Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
