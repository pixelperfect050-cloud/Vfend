# Custom Location Share - Specification Document

## 1. Project Overview

**Project Name:** Custom Location Share
**Type:** Android Mobile Application
**Core Functionality:** Allow users to manually select any location on a map and share it to WhatsApp using proper Google Maps location links that display WhatsApp's normal location preview UI.

## 2. Technology Stack & Choices

- **Framework:** React 18 + Vite
- **Mobile Wrapper:** Capacitor 5
- **Maps:** @react-google-maps/api (Google Maps JavaScript API)
- **State Management:** React Context + useReducer
- **Storage:** localStorage for favorites and recent locations
- **Styling:** CSS Modules with CSS Variables for dark/light mode
- **Sharing:** Native Android Share Intent via Capacitor Plugins
- **Architecture:** Clean Architecture (UI Layer → Business Logic → Data Layer)

## 3. Feature List

### Core Features
- Interactive Google Map with full-screen display
- Tap anywhere to drop a pin/marker
- Search places by name using Places API
- Draggable marker to adjust location
- Zoom controls (+/- buttons)
- Dark/light map theme toggle

### Location Info
- Display selected location coordinates (lat, lng)
- Show human-readable address (reverse geocoding)
- Preview thumbnail of selected location
- Save location to favorites
- Track recent shared locations (last 10)

### Sharing
- One-tap "Share to WhatsApp" button
- Use native Android Share Intent
- Generate Google Maps URL format: `https://maps.google.com/?q=LATITUDE,LONGITUDE`
- Copy location link to clipboard
- Open location directly in Google Maps app
- Share to other apps (system share sheet)

### Extra Features
- Favorite locations list with delete option
- Recent shared locations history
- Bottom sheet preview of selected location

## 4. UI/UX Design Direction

**Visual Style:** Modern Material Design 3 with premium feel
**Color Scheme:**
- Light mode: White background, primary blue (#4285F4), accent teal
- Dark mode: Dark gray (#1a1a2e), primary lighter blue (#5c9aff)
- Use CSS variables for theme switching

**Layout:**
- Full-screen map as main view
- Floating action button for WhatsApp share
- Bottom sheet for location preview/details
- Top search bar for place search
- Tab/bottom navigation for Favorites and Recent

**Animations:**
- Smooth map transitions
- Bottom sheet slide-up animation
- Button press feedback with ripple effect
- Marker drop animation

**Components:**
- Floating search bar with rounded corners
- Draggable marker with custom icon
- Rounded bottom sheet with drag handle
- Pill-shaped action buttons
- Card-based list items for favorites/recent