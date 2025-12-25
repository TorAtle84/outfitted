# Outfitted – Comprehensive CLI Development Prompt

---

## ⚠️ CRITICAL: Documentation Management System

### Self-Updating Documentation Rules

**MANDATORY:** During ALL development work, you MUST maintain two living documents:

1. **`WORKLOG.md`** – Chronological log of all work performed
2. **`PROJECT_STATUS.md`** – Current state of the project

### After EVERY work session, you MUST:

1. **Update `WORKLOG.md`** with:
   - Date and time
   - What was accomplished
   - Any decisions made
   - Problems encountered and solutions
   - Files created/modified

2. **Update `PROJECT_STATUS.md`** with:
   - Current phase and progress percentage
   - Completed features (checkbox list)
   - In-progress features
   - Next steps (prioritized)
   - Known issues/blockers

3. **Update this prompt file** (`outfitted-cli-prompt.md`) if:
   - Any feature specifications change
   - New features are added
   - Technical decisions are made that affect the spec
   - Database schema changes

### Document Locations
```
/outfitted
├── docs/
│   ├── WORKLOG.md              # Chronological work log
│   ├── PROJECT_STATUS.md       # Current project state
│   └── outfitted-cli-prompt.md # This spec (keep updated!)
├── src/
│   └── ...
└── ...
```

---

## 📋 WORKLOG.md Template

```markdown
# Outfitted – Work Log

## How to Use This Log
- Add new entries at the TOP (newest first)
- Include date, time, and duration
- Be specific about what was done
- Note any deviations from the spec

---

## [DATE] - Session [N]

**Duration:** X hours
**Developer:** [Name/AI]

### Accomplished
- [ ] Task 1
- [ ] Task 2

### Decisions Made
- Decision 1: [Reasoning]

### Problems & Solutions
- **Problem:** Description
- **Solution:** How it was resolved

### Files Changed
- `path/to/file.ts` – Description of changes

### Notes
- Any additional observations

---
```

---

## 📊 PROJECT_STATUS.md Template

```markdown
# Outfitted – Project Status

**Last Updated:** [DATE TIME]
**Current Phase:** [Phase Name]
**Overall Progress:** [X]%

---

## 🎯 Current Sprint Goals
1. Goal 1
2. Goal 2
3. Goal 3

---

## ✅ Completed Features

### Phase 1: MVP
- [x] Feature 1
- [x] Feature 2
- [ ] Feature 3 (in progress)

### Phase 2: Core Features
- [ ] Feature 4
- [ ] Feature 5

---

## 🔄 In Progress

| Feature | Status | Assignee | Notes |
|---------|--------|----------|-------|
| Feature X | 60% | - | Blocked by Y |

---

## 📌 Next Steps (Prioritized)

1. **[HIGH]** Next task 1
2. **[HIGH]** Next task 2
3. **[MEDIUM]** Next task 3
4. **[LOW]** Next task 4

---

## 🐛 Known Issues

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| Bug 1 | High | Open | Description |

---

## 📁 Project Structure

```
/outfitted
├── src/
│   ├── app/
│   ├── components/
│   └── ...
└── ...
```

---

## 🔗 Quick Links
- Spec: `docs/outfitted-cli-prompt.md`
- Work Log: `docs/WORKLOG.md`
```

---

## 🔄 Spec Change Log

Track all changes to this specification document here.

| Date | Change | Reason |
|------|--------|--------|
| [Initial] | Document created | Initial specification |

---

## Project Overview

**App Name:** Outfitted  
**Tagline:** "Your wardrobe, perfected."  
**Platform:** Web (Next.js) → iOS/Android later  
**Target Audience:** Primarily women, but available for all genders  
**Domain:** outfitted.app (to be registered)

---

## Core Concept

Outfitted is a personal wardrobe management app that combines:
1. **Digital closet** – Photograph and catalog all your clothes
2. **AI-powered styling** – Smart outfit suggestions based on color theory, weather, and personal style
3. **Customizable avatar** – Bitmoji-style figure that represents the user
4. **Weather integration** – Outfit recommendations based on local forecast
5. **Trip planner** – Pack smart for travels with weather-aware suggestions
6. **Social features** – "Fit of the Day" sharing with friends

---

## Design System

### Color Palette (Light Pastel/Beige Theme)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Soft Cream | `#F5F0E8` | Primary background |
| Warm Beige | `#E8DFD4` | Secondary background, cards |
| Blush Pink | `#F2E0DC` | Accent surfaces, avatar background |
| Sage Mist | `#D4DDD4` | Success states, badges |
| Dusty Rose | `#D4A5A5` | Primary buttons, CTAs |
| Warm Taupe | `#A89F91` | Body text, icons |
| Charcoal Soft | `#4A4A4A` | Headings |

### Typography
- Clean, modern sans-serif font
- Friendly and approachable tone
- All UI text in English

### Logo Concept
- Clothes hanger in foreground
- Diffuse/blurred camera in background
- Represents the intersection of fashion and technology

---

## Technical Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS with custom color palette
- **State Management:** React Context + useState/useReducer
- **Avatar System:** Custom Bitmoji-style SVG components or canvas-based rendering

### Backend
- **Database:** PostgreSQL with Prisma ORM
- **Hosting:** Vercel (frontend) + Supabase (database + auth)
- **Storage:** Local storage for free tier, cloud sync for premium

### AI/ML (Local/Free Solutions)
- **Color Detection:** Browser-based color extraction from uploaded images
- **Color Matching Algorithm:** Built-in color theory rules (complementary, analogous, neutral pairing)
- **Pattern Detection:** Simple pattern recognition to avoid clashing (stripes + plaid = no)

---

## Feature Specifications

### 1. User Onboarding

#### 1.1 Avatar Creation (CRITICAL - First Step)
The avatar is the heart of the app. Users MUST feel like they're looking at themselves.

**Customization Options:**
- **Body Type:** Preset categories with slider adjustments
- **Height:** Slider control
- **Skin Tone:** Free color picker for precise matching
- **Hair:**
  - Multiple styles (short, medium, long, curly, straight, braided, etc.)
  - Color picker with highlights option
  - Seasonal/trendy variations
- **Face Shape:** Multiple options
- **Eye Color:** Color picker
- **Facial Features:** Basic customization

**Built-in Accessories (Not user-photographed):**
- Glasses (multiple styles)
- Earrings
- Watches
- Bracelets
- Necklaces
- Hats/caps

**Avatar Display:**
- 180-degree rotation capability
- Smooth animation when clothes change
- Real-time preview of outfit changes

#### 1.2 Guided Tutorial
- Intuitive, step-by-step walkthrough
- Visual demonstrations
- Skip option for returning users
- All text in English

---

### 2. Wardrobe Management

#### 2.1 Adding Clothes
**Photo Capture:**
- Take individual photos of each garment
- Background removal (automatic)
- Color detection (automatic, user can adjust if incorrect)

**Categorization (Multiple selections allowed per item):**
- **Type:** Top, Bottom, Dress, Outerwear, Shoes, Accessories
- **Style:** Cozy, Casual, Formal, Sporty, Festive
- **Season:** Winter, Spring, Summer, Fall (multiple allowed)
- **Occasion:** Work, Weekend, Date Night, Party, Workout

**Label Scanning Feature (Premium):**
- Photograph the clothing label
- App searches for product image online
- User selects correct match from suggestions

#### 2.2 Wardrobe Display
**Layout:**
- Avatar (Bitmoji) centered on screen
- Current outfit displayed on avatar
- To the RIGHT of avatar: Individual garment photos in grid
  - Stacked vertically by category (top → bottom → shoes → accessories)
  - Each item shows the actual photo user took

---

### 3. Outfit Selection System

#### 3.1 Main Interface
**Daily View:**
- "Today" and "Tomorrow" toggle
- Weather display (temperature + conditions)
- Avatar wearing suggested outfit
- Shuffle button for new combinations

**Shuffle Mechanics:**
- Full shuffle: Randomize entire outfit
- Lock & shuffle: Lock specific items, shuffle the rest
- Algorithm prioritizes:
  1. Color harmony (complementary, analogous, neutral)
  2. Style matching (don't mix formal top with cozy bottom)
  3. Weather appropriateness
  4. User's historical preferences (learning over time)

#### 3.2 "Surprise Me" Button
- Generates unexpected but harmonious combinations
- Encourages users to try new pairings
- Fun, playful feature

#### 3.3 Category Selection
- User can filter by style category before shuffling
- Example: Select "Casual" → only casual items appear in suggestions

---

### 4. Color Intelligence System (CRITICAL)

#### 4.1 Color Harmony Rules
The app must have EXCEPTIONAL color understanding:

**Matching Principles:**
- Complementary colors
- Analogous palettes
- Neutral + accent combinations
- Seasonal color palettes
- User's personal color season (if set)

**User-Specific Factors:**
- Skin tone compatibility
- Eye color enhancement
- Hair color coordination
- Season/undertone analysis

**Pattern Rules:**
- Never suggest patterns that clash (stripes + plaid = NO)
- Solid + pattern combinations preferred
- Pattern scale awareness (large + small can work)

#### 4.2 Learning Algorithm
- Track user's shuffle choices over time
- Note which suggestions get locked vs. rejected
- Monthly insights: "You chose dark tops 74% of the time last month – try some of your favorites in lighter colors?"

---

### 5. Weather Integration

#### 5.1 Basic Weather Features
- Current temperature
- Today's forecast (high/low)
- Weather conditions (sunny, cloudy, rainy, snowy)

#### 5.2 Outfit Recommendations
- Temperature-appropriate suggestions
- Rain? Prioritize waterproof outerwear
- Hot? Suggest breathable fabrics

#### 5.3 Tips & Notifications
- "UV index is high today – don't forget sunscreen! ☀️"
- "Temperature dropping tonight – bring a jacket!"

---

### 6. Outside Function

After selecting main outfit, user accesses "Outside" view for outerwear:

**Categories:**
- Jackets/Coats
- Gloves
- Scarves
- Hats
- Shoes (outdoor-specific)
- Umbrellas

**Display:**
- Avatar shows complete look with outerwear
- Photos of actual garments displayed alongside

---

### 7. Plan Feature (Premium)

#### 7.1 Short-term Planning
- Plan up to 3 days ahead
- Each day is independently customizable
- Shuffle each day until satisfied
- Calendar sync option: "You have [calendar event] tomorrow – want to plan an outfit for it?"

#### 7.2 Rules
- Same complete outfit cannot repeat within the plan
- Individual items CAN be reused in different combinations

---

### 8. Trip Planner (Premium)

#### 8.1 Trip Setup
- Enter destination (city search with suggestions)
- Select travel dates
- App fetches weather forecast for destination

#### 8.2 Packing List Generation
- Auto-generate outfit suggestions for each day
- Shuffle each day independently
- Same complete outfit NEVER repeats during trip
- Individual items can be reused across different outfits

#### 8.3 Smart Packing
- Minimize items while maximizing outfit combinations
- Highlight versatile pieces
- Checklist view for packing

---

### 9. Social Features – Fit of the Day

#### 9.1 Sharing Options
- **Public:** Visible to all users
- **Friends Only:** Select specific friends
- **Private:** Save for personal reference only

#### 9.2 Post Content
- Avatar wearing the outfit
- Photos of actual garments (users must consent to public sharing)
- Optional caption

#### 9.3 Engagement
- Star rating (1-5 stars)
- Comments (can be toggled on/off by poster)
- Anonymous option (show avatar/outfit but hide identity)

#### 9.4 Discovery
- "Fit of the Day" – Highlighted daily looks
- "Fit of the Month" – Top-rated looks
- "Top 5 Fits" – Highest-scoring outfits
- Follow other users for inspiration

#### 9.5 Privacy Notice
- Clear consent when posting publicly
- "Your clothing photos will be visible to others"
- Easy opt-out/deletion

---

### 10. Push Notifications

#### 10.1 Daily Notification
- Default time: 05:00 AM
- Content: "Good morning! Here's your outfit suggestion for today ☀️"
- Customizable timing in settings

#### 10.2 Event Reminders
- "You have [event] tomorrow – ready to pick an outfit?"
- Weather alerts

---

### 11. Settings & Customization

#### 11.1 Toggleable Features
- Bærekraft-tracking ("You haven't worn this sweater in 6 months") – ON/OFF
- Automatic seasonal wardrobe rotation – ON/OFF
- Push notifications – ON/OFF
- Calendar sync – ON/OFF

#### 11.2 Avatar Updates
- Edit avatar anytime
- Quick access from main screen

---

### 12. Monetization Model

#### 12.1 Free Tier (3-month trial, then limited)
- Basic wardrobe (limited items)
- Daily outfit suggestions
- Avatar creation
- Basic weather integration

#### 12.2 Premium Tier (12 NOK/month after 3-month trial)
- **Unlimited wardrobe items**
- **Trip Planner**
- **Plan feature (3-day planning)**
- **Wardrobe gap analysis:** "You have many pants but few tops in [color]"
- **Label scanning** for easy item addition
- **Cloud sync** across devices
- **Advanced analytics**

#### 12.3 Future Revenue Streams
- Brand collaborations (H&M, Zara, etc.)
- "Shop similar" feature with affiliate links
- Premium avatar accessories

---

## Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  avatar        Avatar?
  clothes       Clothing[]
  outfits       Outfit[]
  trips         Trip[]
  posts         Post[]
  follows       Follow[]  @relation("follower")
  followers     Follow[]  @relation("following")
  preferences   UserPreferences?
  subscription  Subscription?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Avatar {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  bodyType      String
  height        Int
  skinTone      String    // Hex color
  hairStyle     String
  hairColor     String    // Hex color
  hairHighlights String?  // Hex color
  eyeColor      String    // Hex color
  faceShape     String
  accessories   Json      // Array of accessory IDs
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Clothing {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  imageUrl      String
  type          ClothingType
  styles        String[]  // ["casual", "formal"]
  seasons       String[]  // ["winter", "spring"]
  occasions     String[]  // ["work", "weekend"]
  primaryColor  String    // Hex color (auto-detected)
  secondaryColors String[] // Additional colors
  pattern       String?   // "solid", "stripes", "plaid", etc.
  brand         String?
  isOuterwear   Boolean   @default(false)
  wearCount     Int       @default(0)
  lastWorn      DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  outfitItems   OutfitItem[]
}

enum ClothingType {
  TOP
  BOTTOM
  DRESS
  OUTERWEAR
  SHOES
  ACCESSORY
}

model Outfit {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  items         OutfitItem[]
  occasion      String?
  plannedDate   DateTime?
  worn          Boolean   @default(false)
  rating        Int?      // 1-5 self-rating
  tripId        String?
  trip          Trip?     @relation(fields: [tripId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model OutfitItem {
  id            String    @id @default(cuid())
  outfitId      String
  outfit        Outfit    @relation(fields: [outfitId], references: [id])
  clothingId    String
  clothing      Clothing  @relation(fields: [clothingId], references: [id])
  layer         Int       // For ordering (base layer = 0, outer = higher)
}

model Trip {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  destination   String
  startDate     DateTime
  endDate       DateTime
  outfits       Outfit[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Post {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  outfitData    Json      // Snapshot of outfit at time of posting
  caption       String?
  visibility    Visibility
  allowComments Boolean   @default(true)
  anonymous     Boolean   @default(false)
  ratings       Rating[]
  comments      Comment[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Visibility {
  PUBLIC
  FRIENDS
  PRIVATE
}

model Rating {
  id            String    @id @default(cuid())
  postId        String
  post          Post      @relation(fields: [postId], references: [id])
  raterId       String
  stars         Int       // 1-5
  createdAt     DateTime  @default(now())
  
  @@unique([postId, raterId])
}

model Comment {
  id            String    @id @default(cuid())
  postId        String
  post          Post      @relation(fields: [postId], references: [id])
  authorId      String
  content       String
  createdAt     DateTime  @default(now())
}

model Follow {
  id            String    @id @default(cuid())
  followerId    String
  follower      User      @relation("follower", fields: [followerId], references: [id])
  followingId   String
  following     User      @relation("following", fields: [followingId], references: [id])
  createdAt     DateTime  @default(now())
  
  @@unique([followerId, followingId])
}

model UserPreferences {
  id                    String    @id @default(cuid())
  userId                String    @unique
  user                  User      @relation(fields: [userId], references: [id])
  notificationTime      String    @default("05:00")
  enableNotifications   Boolean   @default(true)
  enableSustainability  Boolean   @default(true)
  enableSeasonalRotation Boolean  @default(true)
  colorSeason           String?   // "spring", "summer", "autumn", "winter"
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model Subscription {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  tier          SubscriptionTier
  startDate     DateTime
  endDate       DateTime?
  trialEndsAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum SubscriptionTier {
  FREE_TRIAL
  FREE
  PREMIUM
}
```

---

## App Flow & Screens

### Screen 1: Welcome / Onboarding
- App logo + tagline
- "Get Started" button
- Login option for returning users

### Screen 2: Avatar Creator
- Full-screen avatar customization
- Category tabs: Body, Face, Hair, Accessories
- Real-time preview
- "Done" button when satisfied

### Screen 3: Home / Daily View
- Avatar with current outfit suggestion
- Weather widget (top)
- "Today" / "Tomorrow" toggle
- Shuffle button
- Lock icons on each garment
- "Surprise Me" button
- Navigation bar (bottom)

### Screen 4: Wardrobe
- Grid view of all clothing
- Filter tabs by category/style/season
- Add new item button (+)
- Tap item to edit details

### Screen 5: Add Clothing
- Camera view for photo capture
- Auto background removal
- Color detection preview
- Category/style/season selection
- Save button

### Screen 6: Outside View
- Avatar with main outfit
- Outerwear options displayed
- Weather reminder
- "Complete Look" button

### Screen 7: Plan (Premium)
- Calendar view (3 days)
- Each day shows planned outfit
- Shuffle per day
- Sync with device calendar

### Screen 8: Trip Planner (Premium)
- Destination search
- Date range picker
- Generated packing list
- Day-by-day outfit view
- Shuffle per day

### Screen 9: Fit of the Day Feed
- Scrollable feed of posts
- Avatar + outfit preview per post
- Star rating display
- Comment count
- Filter: Public / Friends / Following

### Screen 10: Post Detail
- Full avatar view
- Individual garment photos
- Rating input
- Comment section
- Share options

### Screen 11: Profile
- User's avatar
- Post history
- Followers / Following
- Settings gear icon

### Screen 12: Settings
- Notification preferences
- Subscription management
- Avatar edit shortcut
- Account settings
- Privacy settings
- About / Help

---

## Fun UI Phrases & Messages

### Outfit Sharing
- "Your fit is fire! 🔥"
- "Slay the day! 💅"
- "Looking sharp! ✨"
- "Outfit goals achieved! 🎯"

### Weather Tips
- "It's chilly out there – don't forget a jacket! 🧥"
- "Sunshine incoming – rock those shades! 😎"
- "Rain alert! Umbrella ready? ☔"
- "Perfect weather for that new dress! 👗"

### Encouragement
- "You've got this! 💪"
- "Confidence looks good on you! 😊"
- "New day, new look! 🌟"

### Sustainability Nudges
- "This sweater misses you – last worn 3 months ago!"
- "You're on a roll! 5 different outfits this week 🎉"
- "Mixing it up! You've worn 80% of your wardrobe this month"

---

## Development Phases

### Phase 1: MVP (4-6 weeks)
- [ ] User authentication (Supabase Auth)
- [ ] Basic avatar creator (limited options)
- [ ] Wardrobe management (add/view clothes)
- [ ] Simple outfit generation (random with basic rules)
- [ ] Local storage only

### Phase 2: Core Features (4-6 weeks)
- [ ] Advanced avatar customization
- [ ] Color intelligence system
- [ ] Weather API integration
- [ ] Shuffle mechanics with locking
- [ ] "Today" / "Tomorrow" views

### Phase 3: Premium Features (4-6 weeks)
- [ ] Plan feature (3-day)
- [ ] Trip planner
- [ ] Subscription system
- [ ] Cloud sync
- [ ] Analytics/insights

### Phase 4: Social Features (4-6 weeks)
- [ ] Fit of the Day posting
- [ ] Rating system
- [ ] Comments
- [ ] Following/followers
- [ ] Feed & discovery

### Phase 5: Polish & Launch (2-4 weeks)
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] App Store preparation (later)
- [ ] Marketing materials

---

## API Endpoints (REST)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Avatar
- `GET /api/avatar`
- `POST /api/avatar`
- `PUT /api/avatar`

### Wardrobe
- `GET /api/clothes`
- `POST /api/clothes`
- `PUT /api/clothes/:id`
- `DELETE /api/clothes/:id`

### Outfits
- `GET /api/outfits`
- `POST /api/outfits`
- `POST /api/outfits/generate` – AI suggestion
- `POST /api/outfits/shuffle` – Shuffle with locked items

### Trips
- `GET /api/trips`
- `POST /api/trips`
- `PUT /api/trips/:id`
- `DELETE /api/trips/:id`

### Social
- `GET /api/feed`
- `POST /api/posts`
- `POST /api/posts/:id/rate`
- `POST /api/posts/:id/comment`
- `POST /api/follow/:userId`

### Weather
- `GET /api/weather?lat=X&lon=Y`
- `GET /api/weather/forecast?city=X&days=Y`

---

## Initial CLI Command

To start developing Outfitted, run:

```bash
npx create-next-app@latest outfitted --typescript --tailwind --eslint --app --src-dir
cd outfitted
npm install prisma @prisma/client
npm install @supabase/supabase-js
npx prisma init
```

---

## Summary

**Outfitted** is a comprehensive wardrobe management app that empowers users to:
1. Digitize their entire wardrobe
2. Get AI-powered, weather-aware outfit suggestions
3. See themselves (via avatar) in outfits before getting dressed
4. Plan ahead for trips and events
5. Share their style with friends and the community

The app prioritizes:
- **User identity** – The avatar MUST feel like "me"
- **Color intelligence** – Exceptional understanding of color harmony
- **Simplicity** – Intuitive UI with minimal friction
- **Personalization** – Learning from user preferences over time
- **Social connection** – Share and inspire others

**Start building Outfitted today! 🚀**

---

## 🚀 First Steps When Starting Development

### Initialization Checklist

When you begin working on Outfitted, perform these steps FIRST:

```bash
# 1. Create the Next.js project
npx create-next-app@latest outfitted --typescript --tailwind --eslint --app --src-dir
cd outfitted

# 2. Install dependencies
npm install prisma @prisma/client
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
npx prisma init

# 3. Create documentation structure
mkdir -p docs
touch docs/WORKLOG.md
touch docs/PROJECT_STATUS.md
cp [path-to-this-file] docs/outfitted-cli-prompt.md

# 4. Initialize git
git init
git add .
git commit -m "Initial commit: Project setup"
```

### After Initialization

1. **Read this entire spec document** before writing any code
2. **Create initial `WORKLOG.md`** entry documenting setup
3. **Create initial `PROJECT_STATUS.md`** with Phase 1 goals
4. **Start with Phase 1: MVP** features

---

## 📝 Development Rules

### Code Standards
- TypeScript strict mode
- ESLint + Prettier formatting
- Meaningful commit messages
- Component-based architecture
- Server components where possible (Next.js 14)

### Git Workflow
- Commit after completing each feature
- Use descriptive commit messages: `feat: Add avatar customization`
- Tag major milestones: `v0.1.0-mvp`

### Documentation Updates
- **ALWAYS** update `WORKLOG.md` after each session
- **ALWAYS** update `PROJECT_STATUS.md` when status changes
- **ALWAYS** update this spec if requirements change

---

## 🎯 Success Criteria

The project is complete when:

1. ✅ All Phase 1-5 features are implemented
2. ✅ All tests pass
3. ✅ Documentation is complete and up-to-date
4. ✅ App is deployed and accessible
5. ✅ User can complete full flow: Sign up → Create avatar → Add clothes → Get outfit suggestion → Share fit

---

## 📞 Questions to Clarify

If you encounter ambiguity during development, document the question in `WORKLOG.md` and make a reasonable decision. Flag it for review with:

```markdown
### ⚠️ Decision Needed
- **Question:** [Your question]
- **Context:** [Why this came up]
- **Temporary Decision:** [What you decided]
- **Reasoning:** [Why you chose this]
```

---

**End of Specification**

*Document Version: 1.0*
*Created: December 2024*
*Last Updated: [Will be updated automatically]*
