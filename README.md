# MediTrack - Health Tracking Application

Ứng dụng Frontend dùng Next.js (App Router), TypeScript, TailwindCSS để theo dõi kết quả xét nghiệm y tế.

## Tính năng chính

- **Trang chủ**: Landing page với hero section và call-to-action
- **Đăng nhập/Đăng ký**: Form đăng nhập và đăng ký với tab switching
- **Giới thiệu**: Trang About Us với thông tin về ứng dụng
- **Giao diện hiện đại**: Thiết kế responsive với TailwindCSS
- **Component tái sử dụng**: UI components được thiết kế để tái sử dụng

## Yêu cầu
- Node.js LTS (đã cấu hình qua nvm)
- npm

## Lệnh
- `npm run dev`: chạy dev server (http://localhost:3000)
- `npm run build`: build production
- `npm run start`: chạy production server
- `npm run lint`: lint code

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
```

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
3. Start dev server: `npm run dev`
4. Open http://localhost:3000

## Build và Deploy

1. Build production: `npm run build`
2. Start production server: `npm run start`
3. Deploy to Vercel: `vercel --prod`
