module.exports = function aboutPulse({ version }) {
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1, user-scalable=yes">
        <title>About Pulse</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                margin: 0;
                padding: 14px;
                background-color: #f8fafc;
                color: #111827;
            }
            .logo {
                margin: 6px auto 8px;
            }
            .title {
                font-size: 24px;
                margin: 4px 0;
                font-weight: bold;
            }
            .description {
                color: #4b5563;
                font-size: 12px;
                line-height: 1.45;
                margin: 8px auto 0;
                max-width: 280px;
            }
            .footer {
                margin-top: 12px;
                font-size: 12px;
                color: #8a94a6;
            }
        </style>
    </head>
    <body>
      <svg class="logo" width="92" height="92" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pulse logo">
        <defs>
          <linearGradient id="pulse-mark" x1="32" y1="124" x2="224" y2="124" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#D90429"/>
            <stop offset="0.45" stop-color="#FF174D"/>
            <stop offset="1" stop-color="#FF5C8A"/>
          </linearGradient>
          <filter id="pulse-neon" x="-28%" y="-60%" width="156%" height="220%" color-interpolation-filters="sRGB">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#FF174D" flood-opacity="0.95"/>
            <feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#FF174D" flood-opacity="0.58"/>
            <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#FF5C8A" flood-opacity="0.28"/>
          </filter>
        </defs>
        <rect width="256" height="256" rx="56" fill="#FFFFFF"/>
        <path d="M32 132h39l20-39 33 88 31-107 24 58h45" fill="none" stroke="#FF174D" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" opacity="0.10"/>
        <path d="M32 132h39l20-39 33 88 31-107 24 58h45" fill="none" stroke="#FF174D" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity="0.20"/>
        <path d="M32 132h39l20-39 33 88 31-107 24 58h45" fill="none" stroke="url(#pulse-mark)" stroke-width="13.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#pulse-neon)"/>
        <path d="M32 132h39l20-39 33 88 31-107 24 58h45" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.52"/>
      </svg>
      <h2 class="title">Pulse ${version}</h2>
      <p class="description">Pulse is an independent, multilingual API client for local-first and AI-assisted workflows.</p>
      <footer class="footer">
          Copyright ${currentYear} Pulse Contributors
      </footer>
    </body>
    </html>
  `;
};
