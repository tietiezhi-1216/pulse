# Pulse

Pulse is a multilingual, AI-ready, local-first API client forked from Bruno.

The project keeps Bruno's file-first API collection workflow while establishing an independent product identity. The first Pulse milestones are:

- independent desktop branding and install identity
- a multilingual interface foundation
- AI-assisted request authoring, test generation, and response analysis
- continued compatibility with local API collections

## Relationship To Bruno

Pulse is a fork of Bruno, which is distributed under the MIT License. Bruno is a trademark of its respective owner. Pulse is independently maintained and is not affiliated with or endorsed by Bruno.

The original Bruno copyright and license notices are retained in this repository as required by the MIT License.

## Development

Install dependencies:

```bash
npm install
```

Run the desktop app in development:

```bash
npm run dev
```

Build the web renderer:

```bash
npm run build:web
```

Build the Electron desktop package:

```bash
npm run build:electron:mac
```

## Status

Pulse is in early fork setup. Branding and packaging are being separated first; internationalization and AI-assisted workflows come next.
