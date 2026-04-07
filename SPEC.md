# Gemini Image Studio - Specification

## Overview
An AI image generation platform powered by Google Gemini Imagen API, similar to TapNow. Supports text-to-image and image-to-image generation with style presets.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **AI API:** Google Gemini Imagen (@google/generative-ai)
- **Deployment:** Vercel

## Project Structure
```
gemini-image-studio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/generate/route.ts
├── components/
│   ├── ModeSelector.tsx
│   ├── PromptInput.tsx
│   ├── ImageUploader.tsx
│   ├── StyleSelector.tsx
│   ├── SizeSelector.tsx
│   ├── GenerateButton.tsx
│   └── ImageGallery.tsx
└── lib/
    └── gemini.ts
```

## Features

### 1. ModeSelector
- Text-to-Image / Image-to-Image toggle
- Tab-style with large icons and text
- Mobile-responsive

### 2. PromptInput
- Textarea, max 1000 characters
- Real-time character count
- Placeholder with examples

### 3. ImageUploader
- Drag-and-drop or click to upload
- Only visible in Image-to-Image mode
- Compress to under 2MB
- Show upload progress

### 4. StyleSelector
8 presets:
- 🎬 电影感 (cinematic)
- 🎨 动漫 (anime)
- 📷 写真 (photorealistic)
- 🖼️ 油画 (oil painting)
- 💧 水彩 (watercolor)
- 🏙️ 赛博朋克 (cyberpunk)
- 🌿 唯美梦幻 (ethereal)
- 📰 商业广告 (commercial photography)

### 5. SizeSelector
- 1:1 (1024x1024)
- 16:9 (1792x1024)
- 9:16 (1024x1792)

### 6. GenerateButton
- Loading state with spinner
- Disabled during generation
- Shows result count on success

### 7. ImageGallery
- 2-column (mobile) / 3-column (desktop) grid
- Lightbox on click
- Download button per image
- Empty state illustration

## Design System
- **Theme:** Dark mode
- **Primary:** #8B5CF6 (Purple)
- **Accent:** #06B6D4 (Cyan)
- **Background:** #0F0F0F
- **Card BG:** #1A1A1A
- **Text:** #FFFFFF / #A1A1AA
- **Border Radius:** 16px
- **Font:** Inter / system-ui

## API

### POST /api/generate
**Request:**
```json
{
  "prompt": "string",
  "mode": "text-to-image" | "image-to-image",
  "referenceImage": "base64 string (optional)",
  "style": "cinematic|anime|photorealistic|oil_painting|watercolor|cyberpunk|ethereal|commercial",
  "aspectRatio": "1:1|16:9|9:16"
}
```

**Response:**
```json
{
  "images": [{ "url": "data URL", "revisedPrompt": "string" }],
  "status": "success" | "error",
  "message": "string"
}
```

## Environment Variables
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Deployment
Connect GitHub repo to Vercel for auto-deployment.
