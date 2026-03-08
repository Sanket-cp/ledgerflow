import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, Clock, CheckCircle, Plus, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import PageTransition from '@/components/PageTransition';
import EmptyState from '@/components/EmptyState';
import { formatCurrency } from '@/data/mockData';
import { notificationService } from '@/services/notificationService';
import { reminderService } from '@/services/reminderService';
import { useToast } from '@/hooks/use-toast';

export default function RemindersPage() {
  const { reminders, customers, loading, addReminder, deleteReminder, checkPendingReminders } = useApp();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    type: 'payment_due' as 'payment_due' | 'interest_due' | 'custom',
    title: '',
    message: '',
    amount: 0,
    dueDate: '',
    schedule: 'once' as 'once' | 'daily' | 'weekly' | 'monthly',
    channel: 'browser' as 'browser' | 'sms' | 'whatsapp' | 'email',
  });

  const pendingCount = reminders.filter(r => r.status === 'pending').length;
  const sentCount = reminders.filter(r => r.status === 'sent').length;
  const todayCount = reminders.filter(r => {
    const today = new Date().toDateString();
    return new Date(r.dueDate).toDateString() === today;
  }).length;

  const notificationPermission = notificationService.getPermission();

  const handleRequestPermission = async () => {
    await notificationService.requestPermission();
    window.location.reload();
  };

  const handleGenerateDaily = async () => {
    setGenerating(true);
    try {
      const result = await reminderService.generateDaily();
      toast({
        title: 'Success',
        description: `Generated ${result.total} reminders (${result.paymentReminders} payment + ${result.interestReminders} interest)`,
      });
      window.location.reload();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate reminders',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.customerId || !form.title || !form.message || !form.dueDate) {
      return;
    }

    try {
      await addReminder({
        ...form,
        isActive: true,
        status: 'pending',
      });
      setShowDialog(false);
      setForm({
        customerId: '',
        customerName: '',
        type: 'payment_due',
        title: '',
        message: '',
        amount: 0,
        dueDate: '',
        schedule: 'once',
        channel: 'browser',
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setForm(prev => ({
        ...prev,
        customerId,
        customerName: customer.name,
        amount: customer.balance,
        title: `Payment Reminder - ${customer.name}`,
        message: `Dear ${customer.name}, this is a reminder about your pending payment of ${formatCurrency(customer.balance)}.`,
      }));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      await deleteReminder(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-cash-in/10 text-cash-in';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'failed': return 'bg-cash-out/10 text-cash-out';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-5 w-5" />;
      case 'pending': return <Bell className="h-5 w-5" />;
      case 'failed': return <AlertCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getDueText = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading reminders...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">Reminders</h1>
            <p className="text-muted-foreground mt-1">Manage payment and interest reminders</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleGenerateDaily}
              disabled={generating}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Generating...' : 'Auto-Generate'}
            </Button>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Reminder</DialogTitle>
                  <DialogDescription>Set up a new reminder for a customer</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Customer *</Label>
                    <Select value={form.customerId} onValueChange={handleCustomerChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} - {formatCurrency(c.balance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v: any) => setForm(prev => ({ ...prev, type: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment_due">Payment Due</SelectItem>
                        <SelectItem value="interest_due">Interest Due</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={form.title}
                      onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Payment Reminder"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Message *</Label>
                    <Textarea
                      value={form.message}
                      onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Reminder message..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={form.amount}
                        onChange={e => setForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Due Date *</Label>
                      <Input
                        type="datetime-local"
                        value={form.dueDate}
                        onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Schedule</Label>
                      <Select value={form.schedule} onValueChange={(v: any) => setForm(prev => ({ ...prev, schedule: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once">Once</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Channel</Label>
                      <Select value={form.channel} onValueChange={(v: any) => setForm(prev => ({ ...prev, channel: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="browser">Browser</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">Create Reminder</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {notificationPermission !== 'granted' && (
          <div className="rounded-xl border border-warning bg-warning/10 p-4 flex items-start gap-3">
            <Bell className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-warning">Enable Browser Notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                Allow notifications to receive reminders even when the app is in the background.
              </p>
              <Button size="sm" variant="outline" className="mt-2" onClick={handleRequestPermission}>
                Enable Notifications
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-display font-bold">{pendingCount}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Due Today</p>
            <p className="text-2xl font-display font-bold">{todayCount}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Sent</p>
            <p className="text-2xl font-display font-bold">{sentCount}</p>
          </div>
        </div>

        {reminders.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No reminders yet"
            description="Create your first reminder to stay on top of payments"
            action={
              <Button onClick={() => setShowDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Add Reminder
              </Button>
            }
          />
        ) : (
          <div className="rounded-xl border bg-card shadow-sm divide-y divide-border">
            {reminders.map((r, i) => (
              <div key={r.id} className="flex items-center gap-4 p-4 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${getStatusColor(r.status)}`}>
                  {getStatusIcon(r.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.customerName} · {r.channel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(r.amount)}</p>
                  <p className={`text-xs ${getDueText(r.dueDate).includes('overdue') ? 'text-cash-out' : 'text-muted-foreground'}`}>
                    {getDueText(r.dueDate)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(r.id)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border bg-muted/50 p-6 text-center">
          <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Browser notifications are checked every 3 minutes. Each reminder is sent only once.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            SMS, WhatsApp & Email require additional setup.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={checkPendingReminders}
          >
            Check Pending Reminders Now
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
