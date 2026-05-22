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
                background-color: #101217;
                color: #f5f7fb;
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
                color: #b8c1d9;
                font-size: 12px;
                line-height: 1.45;
                margin: 8px auto 0;
                max-width: 280px;
            }
            .footer {
                margin-top: 12px;
                font-size: 12px;
                color: #7f8aa3;
            }
        </style>
    </head>
    <body>
      <svg class="logo" width="92" height="92" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pulse logo">
        <defs>
          <linearGradient id="pulse-bg" x1="36" y1="24" x2="220" y2="232" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#23D3EE"/>
            <stop offset="0.52" stop-color="#536DFE"/>
            <stop offset="1" stop-color="#B65CFF"/>
          </linearGradient>
          <linearGradient id="pulse-line" x1="42" y1="130" x2="216" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#E7FBFF"/>
            <stop offset="0.5" stop-color="#FFFFFF"/>
            <stop offset="1" stop-color="#E9D6FF"/>
          </linearGradient>
        </defs>
        <rect x="16" y="16" width="224" height="224" rx="54" fill="#101217"/>
        <rect x="24" y="24" width="208" height="208" rx="46" fill="url(#pulse-bg)" opacity="0.94"/>
        <circle cx="128" cy="128" r="70" fill="#101217" opacity="0.18"/>
        <path d="M42 132h34l18-40 30 84 29-96 22 52h39" fill="none" stroke="url(#pulse-line)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="76" cy="132" r="9" fill="#F8FDFF"/>
        <circle cx="153" cy="132" r="9" fill="#F8FDFF"/>
        <circle cx="214" cy="132" r="9" fill="#F8FDFF"/>
      </svg>
      <h2 class="title">Pulse ${version}</h2>
      <p class="description">Pulse is an independent fork of Bruno focused on multilingual and AI-assisted API workflows.</p>
      <footer class="footer">
          Copyright ${currentYear} Pulse Contributors
      </footer>
    </body>
    </html>
  `;
};
