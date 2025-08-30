# MediTrack - Health Tracking Application

Ứng dụng Frontend dùng Next.js (App Router), TypeScript, TailwindCSS để theo dõi kết quả xét nghiệm y tế.

## Tính năng chính

- **Trang chủ**: Landing page với hero section và call-to-action
- **Đăng nhập/Đăng ký**: Form đăng nhập và đăng ký với tab switching
- **Giới thiệu**: Trang About Us với thông tin về ứng dụng
- **Giao diện hiện đại**: Thiết kế responsive với TailwindCSS
- **Component tái sử dụng**: UI components được thiết kế để tái sử dụng

## Yêu cầu
- Node.js >=18.17.0 (đã cấu hình qua nvm)
- npm

## ⚠️ Known Issues & Workarounds

### Build Issue with Next.js 15 + Internationalization
There's a known compatibility issue between Next.js 15 and the next-intl plugin where the build process looks for `.js` files instead of `.tsx` files. 

**Current Workaround**: TypeScript errors are temporarily ignored during build (`typescript.ignoreBuildErrors: true` in `next.config.ts`).

**To fix this permanently**, you can:
1. Wait for a Next.js 15.5.1+ patch release
2. Downgrade to Next.js 14 (requires React 18)
3. Use the canary version of next-intl

**Status**: This is a temporary workaround until the core issue is resolved.

## Lệnh
- `npm run dev`: chạy dev server (http://localhost:3000)
- `npm run build`: build production
- `npm run start`: chạy production server
- `npm run lint`: lint code

## Setup & Development

### Prerequisites
- **Node.js**: Version 18.17.0 or higher (required for Next.js 15)
- **npm**: Latest version recommended

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Node.js Version Management
If you're using nvm (Node Version Manager):
```bash
# Switch to a compatible Node.js version
nvm use 18.20.8  # or any version >=18.17.0

# Set as default (optional)
nvm alias default 18.20.8
```

## Cấu trúc thư mục
```
src/
  app/                 # App Router: pages, layouts
    /                  # Home page
    /about            # About Us page
    /login            # Login/Signup page
    layout.tsx        # Root layout với navigation
  components/          # UI components chia sẻ
    ui/               # Base UI components (Button, Input, Loading)
    Navigation.tsx    # Navigation bar
    Footer.tsx        # Footer component
  features/            # Tính năng theo domain (module hóa)
  hooks/               # React hooks dùng chung
  lib/                 # Tiện ích, helpers, constants
    config.ts         # Configuration và environment variables
  services/            # API client và service modules
    apiClient.ts      # Axios instance với interceptors
    healthService.ts  # Health check service
  styles/              # Styles toàn cục, Tailwind extensions
    globals.css       # Global CSS và Tailwind imports
  types/               # Khai báo types/interfaces dùng chung
    auth.ts           # Authentication types
public/                # Static assets
  logo.png            # Logo của ứng dụng (32x32px cho nav, 64x64px cho login)
```

## Logo Configuration

Để thay thế logo của ứng dụng:

1. **Tạo thư mục images**: Đảm bảo thư mục `public/images/` đã tồn tại
2. **Thay thế file logo**: Đặt file logo của bạn vào `public/images/medi_track_logo.png`
3. **Kích thước khuyến nghị**: 
   - Navigation: 32x32px
   - Login page: 64x64px
4. **Định dạng**: PNG, JPG, JPEG, SVG, WebP
5. **Tên file**: `medi_track_logo.png` (đã được cấu hình sẵn trong code)

### Cấu trúc thư mục cần thiết:
```
public/
├── images/
│   └── medi_track_logo.png    # Logo của bạn ở đây
├── logo.svg                   # Logo placeholder
└── other-files...
```

Logo sẽ hiển thị ở:
- Navigation bar (góc trái trên)
- Login/Signup page header
- Các vị trí khác nếu cần

**Lưu ý**: 
- Logo hiện tại là placeholder. Bạn cần thay thế file `public/images/medi_track_logo.png` bằng logo thực tế
- Đảm bảo thư mục `public/images/` tồn tại trước khi thêm file
- Next.js sẽ tự động serve file từ thư mục `public` với đường dẫn gốc `/`

## Trang và Routes

### `/` - Trang chủ
- Hero section với call-to-action
- Features grid
- CTA section

### `/about` - Giới thiệu
- Mô tả ứng dụng
- Mission & Vision cards
- Features section

### `/login` - Đăng nhập/Đăng ký
- Tab switching giữa Sign In và Sign Up
- Form validation
- Responsive design

## Components

### UI Components
- `Button`: Button component với variants (primary, secondary, ghost)
- `Input`: Input field với label, error handling
- `Loading`: Loading spinner

### Layout Components
- `Navigation`: Navigation bar với logo và links
- `Footer`: Footer với copyright

## Biến môi trường
- Tạo file `.env.local` để cấu hình runtime:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Ghi chú
- Sử dụng alias `@/*` để import từ `src`
- Tailwind đã được cấu hình sẵn
- Responsive design cho mobile và desktop
- Healthcare theme với màu xanh dương
- TypeScript strict mode enabled

## Development

1. Clone repository
2. Install dependencies: `npm install`
3. **Thay thế logo**: Đặt file logo vào `public/logo.png`
4. Start dev server: `npm run dev`
5. Open http://localhost:3000

## Build và Deploy

1. Build production: `npm run build`
2. Start production server: `npm run start`
3. Deploy to Vercel: `vercel --prod`
