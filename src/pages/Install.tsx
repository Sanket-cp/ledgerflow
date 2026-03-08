import { Smartphone, Clock, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PageTransition from '@/components/PageTransition';

export default function InstallPage() {
  return (
    <PageTransition>
      <div className="max-w-lg mx-auto space-y-8 py-8">
        <div className="text-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mx-auto">
            <Smartphone className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold">Install LedgerFlow</h1>
          <p className="text-muted-foreground">Install this app on your device for quick access, offline support, and a native app experience.</p>
        </div>

        <Alert className="border-2 border-primary/20 bg-primary/5 animate-fade-in">
          <Clock className="h-5 w-5 text-primary" />
          <AlertTitle className="text-lg font-display font-semibold text-primary">Coming Soon!</AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2">
            The app installation feature is currently under development. We're working hard to bring you a seamless installation experience for both mobile and desktop devices.
          </AlertDescription>
        </Alert>

        <div className="rounded-xl border bg-card p-6 shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold mb-2">What to Expect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>One-click installation on all devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Offline access to your ledger data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Native app experience with push notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Faster loading and better performance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '⚡', title: 'Fast', desc: 'Loads instantly' },
            { icon: '📶', title: 'Offline', desc: 'Works offline' },
            { icon: '🔒', title: 'Secure', desc: 'Your data is safe' },
          ].map(f => (
            <div key={f.title} className="rounded-xl border bg-card p-4 shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
              <p className="text-2xl mb-1">{f.icon}</p>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p>In the meantime, you can continue using LedgerFlow in your browser.</p>
          <p className="mt-1">We'll notify you when the installation feature is ready!</p>
        </div>
      </div>
    </PageTransition>
  );
}
