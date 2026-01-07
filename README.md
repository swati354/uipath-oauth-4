# UiPath Orchestrator Process Manager

A professional, enterprise-grade dashboard for viewing and managing all UiPath Orchestrator processes with real-time monitoring and execution controls.

[cloudflarebutton]

## Overview

The UiPath Orchestrator Process Manager is a comprehensive web application that provides a centralized view of all automation processes within UiPath Orchestrator. Built with modern web technologies and the official UiPath TypeScript SDK, it offers real-time process monitoring, execution controls, and detailed process insights in a professional, responsive interface.

## Key Features

- **Process Table** - Information-dense table displaying all processes with sortable columns for name, key, description, version, last run date, and status
- **Process Control Panel** - Start processes with proper parameter handling and confirmation dialogs
- **Process Metrics Dashboard** - Key statistics including total processes, active processes, and success rates in compact metric cards
- **Search and Filter System** - Quickly locate specific processes by name, status, or folder
- **Process Details View** - Comprehensive information about individual processes including execution history and configuration
- **Folder Selector** - Filter processes by Orchestrator folder context for proper organizational scoping
- **Responsive Layout** - Professional information density across different screen sizes while prioritizing table-based data presentation
- **Real-time Updates** - Automatic data refresh every 30 seconds to maintain current information

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with full SDK type definitions
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful, customizable icons

### UiPath Integration
- **UiPath TypeScript SDK** - Official SDK for Orchestrator API access
- **OAuth Authentication** - Secure authentication with UiPath Cloud/On-Premises
- **React Query** - Powerful data fetching, caching, and synchronization

### Build & Deployment
- **Vite** - Fast build tool and development server
- **Cloudflare Pages** - Global edge deployment platform
- **Bun** - Fast JavaScript runtime and package manager

## Prerequisites

- **Bun** - Install from [bun.sh](https://bun.sh)
- **UiPath Orchestrator** - Cloud or On-Premises instance
- **OAuth External App** - Configured in UiPath Cloud Admin Console

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uipath-process-manager
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```env
   VITE_UIPATH_BASE_URL=https://your-instance.uipath.com
   VITE_UIPATH_ORG_NAME=your-organization-name
   VITE_UIPATH_TENANT_NAME=your-tenant-name
   VITE_UIPATH_CLIENT_ID=your-oauth-client-id
   VITE_UIPATH_REDIRECT_URI=http://localhost:3000
   VITE_UIPATH_SCOPE=OR.Execution OR.Folders.Read
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

   The application will be available at `http://localhost:3000`

## UiPath OAuth Setup

### For UiPath Cloud

1. Go to **UiPath Cloud Admin Console**
2. Navigate to **External Applications**
3. Create a new **Confidential Application**
4. Configure redirect URI: `http://localhost:3000` (development) or your production URL
5. Note the **Client ID** for your `.env` file
6. Grant required scopes: `OR.Execution`, `OR.Folders.Read`

### For UiPath On-Premises

1. Access **Orchestrator Admin Panel**
2. Go to **External Applications**
3. Create new application with **Authorization Code** flow
4. Configure redirect URI and scopes
5. Use the generated Client ID in your configuration

## Usage

### Starting the Application

1. **Authentication**: The app automatically handles OAuth flow on first visit
2. **Folder Selection**: Choose your Orchestrator folder from the dropdown
3. **Process Management**: View, search, filter, and start processes from the main table
4. **Real-time Monitoring**: Process status updates automatically every 30 seconds

### Key Operations

- **View Processes**: All processes display in a sortable, searchable table
- **Start Process**: Click the "Start" button in the actions column
- **Search**: Use the search bar to filter by process name or key
- **Filter by Status**: Use the status dropdown to filter by process state
- **Sort**: Click column headers to sort by different criteria
- **Process Details**: Click on a process row for detailed information

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── uipath/         # UiPath-specific components
├── hooks/              # React Query hooks for UiPath SDK
├── lib/                # Utility functions and SDK configuration
└── pages/              # Application pages
```

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run lint` - Run ESLint

### Adding New Features

1. **UiPath Data**: Use existing hooks in `src/hooks/` or create new ones
2. **UI Components**: Leverage shadcn/ui components from `src/components/ui/`
3. **Styling**: Use Tailwind CSS classes for consistent design
4. **Type Safety**: Import types from `uipath-sdk` for full type coverage

## Deployment

### Cloudflare Pages

[cloudflarebutton]

**Manual Deployment:**

1. **Build the project**
   ```bash
   bun run build
   ```

2. **Deploy to Cloudflare Pages**
   ```bash
   npx wrangler pages deploy dist
   ```

3. **Configure environment variables** in Cloudflare Pages dashboard:
   - `VITE_UIPATH_BASE_URL`
   - `VITE_UIPATH_ORG_NAME`
   - `VITE_UIPATH_TENANT_NAME`
   - `VITE_UIPATH_CLIENT_ID`
   - `VITE_UIPATH_REDIRECT_URI` (your production URL)
   - `VITE_UIPATH_SCOPE`

4. **Update OAuth redirect URI** in UiPath to match your production URL

### Other Platforms

The built application (`dist/` folder) can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_UIPATH_BASE_URL` | UiPath Orchestrator URL | Yes |
| `VITE_UIPATH_ORG_NAME` | Organization name | Yes |
| `VITE_UIPATH_TENANT_NAME` | Tenant name | Yes |
| `VITE_UIPATH_CLIENT_ID` | OAuth Client ID | Yes |
| `VITE_UIPATH_REDIRECT_URI` | OAuth redirect URI | No (defaults to current origin) |
| `VITE_UIPATH_SCOPE` | OAuth scopes | No (defaults to `OR.Execution`) |

### Customization

- **Branding**: Update colors in `tailwind.config.js`
- **Refresh Intervals**: Modify polling intervals in hook files
- **Table Columns**: Customize displayed columns in process table component
- **Metrics**: Add custom metrics to the dashboard

## Troubleshooting

### Common Issues

**Authentication Errors**
- Verify OAuth Client ID and redirect URI configuration
- Check UiPath External App settings match your environment variables
- Ensure proper scopes are granted

**No Processes Displayed**
- Confirm folder permissions in UiPath Orchestrator
- Check if processes exist in the selected folder
- Verify network connectivity to UiPath instance

**Build Errors**
- Run `bun install` to ensure all dependencies are installed
- Check TypeScript errors with `bun run lint`
- Verify environment variables are properly set

### Support

For issues related to:
- **UiPath SDK**: Check [UiPath SDK Documentation](https://docs.uipath.com)
- **OAuth Setup**: Refer to UiPath Cloud/Orchestrator admin guides
- **Application Bugs**: Create an issue in this repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Built with the official [UiPath TypeScript SDK](https://www.npmjs.com/package/uipath-sdk)
- UI components powered by [shadcn/ui](https://ui.shadcn.com)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com)