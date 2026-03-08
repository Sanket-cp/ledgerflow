import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Shield, Database, Bell, Globe, User, Building, Palette, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/PageTransition';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function SettingsPage() {
  const { activityLogs } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  // User profile states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [gstin, setGstin] = useState('');
  
  // Settings states
  const [defaultInterestRate, setDefaultInterestRate] = useState('2');
  const [defaultInterestType, setDefaultInterestType] = useState('monthly');
  const [loading, setLoading] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBusinessName(user.businessName || '');
      setBusinessAddress(user.businessAddress || '');
      setGstin(user.gstin || '');
    }
  }, [user]);

  // Save profile function
  const saveProfile = async () => {
    try {
      setLoading(true);
      const response = await api.put('/auth/profile', {
        name,
        email,
        phone,
        businessName,
        businessAddress,
        gstin,
      });
      
      // Update user in context
      updateUser(response.data);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Save settings function
  const saveSettings = async () => {
    try {
      setLoading(true);
      await api.put('/auth/settings', {
        defaultInterestRate: Number(defaultInterestRate),
        defaultInterestType,
      });
      
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">{t('settings')}</h1>
          <p className="text-muted-foreground mt-1">Configure your business, preferences and security</p>
        </div>

        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="interest">Interest & Charges</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Building className="h-5 w-5 text-primary" /></div>
                <div><h3 className="font-display font-semibold">Business Profile</h3><p className="text-xs text-muted-foreground">Your business information</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Business Name</Label><Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your business name" /></div>
                <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" /></div>
                <div><Label>Address</Label><Input value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} placeholder="Business address" /></div>
                <div><Label>GSTIN</Label><Input value={gstin} onChange={e => setGstin(e.target.value)} placeholder="22AAAAA0000A1Z5" /></div>
              </div>
              <Button onClick={saveProfile} disabled={loading}>
                {loading ? 'Saving...' : t('save')}
              </Button>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><User className="h-5 w-5 text-primary" /></div>
                <div><h3 className="font-display font-semibold">Personal Profile</h3><p className="text-xs text-muted-foreground">Admin account details</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" /></div>
                <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="your@email.com" /></div>
              </div>
              <Button onClick={saveProfile} disabled={loading}>
                {loading ? 'Saving...' : t('save')}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Palette className="h-5 w-5 text-primary" /></div>
                <div><h3 className="font-display font-semibold">Appearance</h3></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <button onClick={toggleTheme} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-muted transition-colors">
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span className="text-sm">{theme === 'light' ? 'Dark' : 'Light'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Globe className="h-5 w-5 text-primary" /></div>
                <div><h3 className="font-display font-semibold">Language & Regional</h3></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Language</Label>
                  <Select value={lang} onValueChange={(v: any) => setLang(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="bn">🇮🇳 বাংলা</SelectItem>
                      <SelectItem value="hi">🇮🇳 हिन्दी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select defaultValue="INR">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ INR (Rupee)</SelectItem>
                      <SelectItem value="USD">$ USD (Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Bell className="h-5 w-5 text-primary" /></div>
                <div><h3 className="font-display font-semibold">Notifications</h3></div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Payment reminders', desc: 'Auto-send payment due reminders' },
                  { label: 'Interest alerts', desc: 'Notify when interest is applied' },
                  { label: 'Low stock alerts', desc: 'Alert when inventory is low' },
                  { label: 'Daily summary', desc: 'Receive daily business summary' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={i < 2} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interest" className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
              <h3 className="font-display font-semibold text-lg">Default Interest Settings</h3>
              <p className="text-sm text-muted-foreground">These defaults apply when adding new customers</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Default Interest Rate (%)</Label>
                  <Input type="number" value={defaultInterestRate} onChange={e => setDefaultInterestRate(e.target.value)} />
                </div>
                <div>
                  <Label>Default Interest Type</Label>
                  <Select value={defaultInterestType} onValueChange={setDefaultInterestType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg mt-6">Custom Charges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><Label>Late Fee (₹)</Label><Input type="number" defaultValue="500" /></div>
                <div><Label>Service Fee (₹)</Label><Input type="number" defaultValue="200" /></div>
                <div><Label>Penalty (%)</Label><Input type="number" defaultValue="1" /></div>
              </div>
              <Button onClick={saveSettings} disabled={loading}>
                {loading ? 'Saving...' : t('save')}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div>
                  <div><h3 className="font-display font-semibold">Authentication</h3><p className="text-xs text-muted-foreground">JWT + Password encryption</p></div>
                </div>
                <p className="text-sm text-muted-foreground">Your account is secured with JWT authentication and bcrypt password encryption.</p>
              </div>
              <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Database className="h-5 w-5 text-primary" /></div>
                  <div><h3 className="font-display font-semibold">Backup & Restore</h3><p className="text-xs text-muted-foreground">Database management</p></div>
                </div>
                <p className="text-sm text-muted-foreground">Your data is automatically backed up on MongoDB Atlas with 99.9% uptime guarantee.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="p-5 border-b border-border"><h3 className="font-display font-semibold text-lg">Activity Logs</h3></div>
              <div className="divide-y divide-border">
                {activityLogs.map((log, i) => (
                  <div key={log.id} className="flex items-center gap-3 p-4 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{log.user}</p>
                      <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
