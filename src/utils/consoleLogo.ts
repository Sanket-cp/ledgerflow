export const showConsoleLogo = () => {
  // ASCII art style text
  const logoText = `
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   ██╗     ███████╗██████╗  ██████╗ ███████╗██████╗       ║
  ║   ██║     ██╔════╝██╔══██╗██╔════╝ ██╔════╝██╔══██╗      ║
  ║   ██║     █████╗  ██║  ██║██║  ███╗█████╗  ██████╔╝      ║
  ║   ██║     ██╔══╝  ██║  ██║██║   ██║██╔══╝  ██╔══██╗      ║
  ║   ███████╗███████╗██████╔╝╚██████╔╝███████╗██║  ██║      ║
  ║   ╚══════╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝      ║
  ║                                                           ║
  ║   ███████╗██╗      ██████╗ ██╗    ██╗                    ║
  ║   ██╔════╝██║     ██╔═══██╗██║    ██║                    ║
  ║   █████╗  ██║     ██║   ██║██║ █╗ ██║                    ║
  ║   ██╔══╝  ██║     ██║   ██║██║███╗██║                    ║
  ║   ██║     ███████╗╚██████╔╝╚███╔███╔╝                    ║
  ║   ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝                     ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `;

  const styles = {
    logo: 'color: #10b981; font-weight: bold; font-size: 12px; font-family: monospace;',
    title: 'color: #10b981; font-weight: bold; font-size: 24px;',
    subtitle: 'color: #6b7280; font-size: 14px;',
    info: 'color: #3b82f6; font-size: 12px;',
    warning: 'color: #f59e0b; font-size: 12px; font-weight: bold;',
    link: 'color: #8b5cf6; font-size: 12px; text-decoration: underline;',
  };

  // Clear console first
  console.clear();

  // Show ASCII logo
  console.log('%c' + logoText, styles.logo);

  // Show app info
  console.log('%c🚀 LedgerFlow', styles.title);
  console.log('%cAdvanced Financial Tracking & Ledger Management', styles.subtitle);
  console.log('');

  // Show version and build info
  console.log('%c📦 Version: 1.0.0', styles.info);
  console.log('%c🔧 Environment: ' + import.meta.env.MODE, styles.info);
  console.log('%c🌐 API URL: ' + (import.meta.env.VITE_API_URL || 'http://localhost:5000/api'), styles.info);
  console.log('');

  // Show image logo
  const imageUrl = '/logo.png';
  const imageStyle = [
    'font-size: 1px',
    'padding: 100px 200px',
    'background-size: contain',
    'background-repeat: no-repeat',
    'background-position: center',
    `background-image: url(${imageUrl})`,
  ].join(';');

  console.log('%c ', imageStyle);
  console.log('');

  // Show developer info
  console.log('%c💡 Developer Tips:', styles.warning);
  console.log('%c• Open DevTools to inspect network requests', styles.info);
  console.log('%c• Check Application tab for localStorage data', styles.info);
  console.log('%c• Enable notifications for reminders', styles.info);
  console.log('');

  // Show useful commands
  console.log('%c🔍 Useful Commands:', styles.warning);
  console.log('%clocalStorage.clear()', styles.link, '- Clear all local data');
  console.log('%cwindow.location.reload()', styles.link, '- Reload the app');
  console.log('');

  // Warning message
  console.log(
    '%c⚠️ WARNING: Do not paste any code here unless you know what you are doing!',
    'color: #ef4444; font-size: 16px; font-weight: bold; background: #fee; padding: 10px; border-left: 4px solid #ef4444;'
  );
  console.log('');

  // Fun message
  console.log('%c✨ Happy Tracking! ✨', 'color: #10b981; font-size: 16px; font-weight: bold;');
  console.log('');
};
