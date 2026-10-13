# OmniCalc AI: Offline-First Smart Calculator & Math Tutor

A modern, responsive calculator progressive web application featuring a multi-step interactive onboarding experience, robust offline-first functionality, and an integrated AI tutor chat drawer for step-by-step mathematical explanations and problem solving.

## User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying questions were skipped, so we are adopting the recommended defaults:
> - **Chatbot Persona**: Intelligent math tutor and calculation assistant capable of explaining mathematical steps, unit conversions, and injecting computed values directly into the active calculator display.
> - **Onboarding & Offline Approach**: Interactive 3-step walkthrough on first launch, PWA service worker caching for instantaneous offline launch, and an ambient connectivity status pill that smoothly switches the chat into offline cue mode.
> - **Visual Theme**: Sleek, high-contrast dark mode with slate surfaces, vivid neon cyan/indigo operational accents, tabular numeral typography, and tactile key press physics.

---

## 1. Overview & Core Concept

- **What It Does**: OmniCalc AI combines an everyday arithmetic and scientific calculator with an intelligent conversational assistant. Users can execute standard and scientific math offline without interruption. When connected, users can tap the floating AI Chatbot button to break down complex formulas, explain step-by-step derivations, convert complex real-world word problems into math, or transfer results directly to the calculator.
- **Target Audience / Persona**: Students, engineers, finance enthusiasts, and everyday users who need a fast, reliable calculator that works on airplanes or subways, but want instant AI tutoring when encountering puzzling calculations.
- **Key Value**: Eliminates the boundary between rigid calculation tools and conversational problem solving while guaranteeing zero downtime through offline-first PWA caching.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[ First Visit ] ──► [ Interactive Onboarding Tour ] ──► [ Calculator View ]
                            │                                     │
                            ▼                                     ├──► [ Offline Mode Active ]
                     (Skip or Complete)                           │     (Local math engine)
                                                                  │
                                                                  ▼
                                                      [ Open AI Chatbot Drawer ]
                                                                  │
                                                      [ Ask Question / Explain ]
                                                                  │
                                                      [ "Use in Calculator" ]
```

1. **Onboarding Flow**:
   - On first launch, a spotlight modal guides the user through:
     1. Tactile calculator keypad & expression memory.
     2. Offline mode resilience (calculation works anywhere without internet).
     3. The AI Math Assistant trigger button for step-by-step solutions.
   - Users can step through or dismiss at any point; completion status is saved in `localStorage`.
2. **Calculator Experience**:
   - Immediate responsive keypad with dual-line display (live expression on top, evaluated result on bottom).
   - Support for standard arithmetic (`+`, `-`, `×`, `÷`, `%`, `±`), scientific toggle (`sin`, `cos`, `tan`, `log`, `ln`, `√`, `^`, `π`, `e`), and calculation history drawer.
   - 100% functional offline using a local JavaScript math parsing and evaluation engine.
3. **AI Chatbot Interface**:
   - Floating action button in the bottom-right corner (or top toolbar on compact viewports).
   - Opens an ergonomic slide-over side drawer (or bottom sheet on mobile) without obscuring the active calculation.
   - Features suggested prompt chips: *"Explain this result"*, *"Break down order of operations"*, *"Convert to scientific notation"*, *"Solve for variable x"*.
   - Each AI response includes an action: **"Insert into Calculator"** which populates the calculation display.
   - When offline, the chat gracefully displays a subtle offline notice and queues prompts or suggests local calculation assistance.
4. **PWA & Offline Indicator**:
   - Ambient, non-intrusive status pill indicating "Offline Mode (Calculator fully available)".
   - In-app install banner/button conforming to PWA standards.

### Visual Identity & Theme

- **Aesthetic Direction**: Sleek technical dark workspace inspired by premium audio hardware and scientific instruments.
- **Color Palette**:
  - Background Canvas: Deep Obsidian Slate (`#0B0F17`)
  - Calculator Base & Drawer: Charcoal Surface (`#131B2E`)
  - Key Surfaces: Muted Slate (`#1E293B`) with active border highlights
  - Accent Color: Vivid Cyan / Electric Blue (`#38BDF8` & `#6366F1`) for operators and primary AI buttons
  - Text: Crisp High-Contrast White (`#F8FAFC`) and Muted Grey (`#94A3B8`)
- **Typography & Hierarchy**:
  - Display Font: `Plus Jakarta Sans` or modern geometric system sans for clean interfaces and buttons.
  - Calculation Numbers: Tabular monospace figures (`font-mono tabular-nums`) to ensure steady alignment during rapid entries.
  - Chat Prose: Clean, comfortable reading measure with markdown formatting for mathematical formulas.
- **Touch & Motion**:
  - Key presses feature sub-150ms spring feedback (`active:scale-95`).
  - Drawer transitions use fluid compositor-only slide animations.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Phased Delivery Structure**
  - *Chosen Approach*: Deliver features in discrete, logical milestones:
    - **Phase 1**: Onboarding walkthrough, PWA manifest, offline indicator & offline service worker shell.
    - **Phase 2**: Core calculator engine, scientific extensions, calculation history, and keyboard shortcuts.
    - **Phase 3**: Server-side Express Gemini API proxy route (`/api/chat`) and AI Chatbot drawer interface.
    - **Phase 4**: Interoperability bridge (sending calculator expressions to AI, pasting AI answers back to calculator), PWA install prompt, and comprehensive test compilation.
  - *Why*: Allows early validation of the offline-first experience before layering conversational AI intelligence.
- **Decision 2: Offline Calculation Guarantee**
  - *Chosen Approach*: The calculator engine operates entirely client-side using pure JavaScript arithmetic with robust precision handling.
  - *Why*: Users must never experience calculation latency or failure regardless of network quality.
- **Decision 3: Server-Side Gemini API Architecture**
  - *Chosen Approach*: Implement an Express backend proxy route (`server.ts` running on port 3000) using the `@google/genai` SDK with `gemini-3.8-flash`.
  - *Why*: Conforms strictly to security standards by keeping `process.env.GEMINI_API_KEY` exclusively on the server, while supporting streaming responses and system instructions tailored for mathematical tutoring.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                       Client Browser                         │
│                                                              │
│  ┌─────────────────┐   ┌─────────────────┐   ┌────────────┐  │
│  │   Onboarding    │   │ Local Storage   │   │ PWA Worker │  │
│  │   Modal / Tour  │   │ History & Prefs │   │ & Offline  │  │
│  └────────┬────────┘   └────────┬────────┘   └─────┬──────┘  │
│           │                     │                  │         │
│  ┌────────▼─────────────────────▼──────────────────▼──────┐  │
│  │                      App Shell                         │  │
│  │  ┌────────────────────────┐  ┌───────────────────────┐ │  │
│  │  │    Calculator View     │  │   AI Chatbot Drawer   │ │  │
│  │  │  • Keypad & Display    │  │  • Message List       │ │  │
│  │  │  • Offline Math Engine │  │  • Quick Prompt Chips │ │  │
│  │  │  • History Drawer      │  │  • "Insert to Calc"   │ │  │
│  │  └───────────┬────────────┘  └───────────┬───────────┘ │  │
│  └──────────────┼───────────────────────────┼─────────────┘  │
└─────────────────┼───────────────────────────┼────────────────┘
                  │ (Local math runs offline) │ (HTTP POST /api/chat)
                  ▼                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    Express Backend Server                    │
│                                                              │
│      POST /api/chat ──► GoogleGenAI (gemini-3.8-flash)       │
│                                (with math tutor prompt)      │
└──────────────────────────────────────────────────────────────┘
```

### Data Model & State Architecture

1. **Calculator State (`useCalculator`)**:
   - `expression: string` - The raw or formatted expression string (e.g. `12 * (4 + 2)`).
   - `result: string` - Evaluated numerical output or error indicator.
   - `history: CalculationRecord[]` - Persisted list of `{ id, expression, result, timestamp }`.
   - `mode: 'basic' | 'scientific'` - Mode toggle state.
2. **Network & Offline State (`useOnlineStatus`)**:
   - `isOnline: boolean` - Tracks `navigator.onLine` and window `online`/`offline` events.
   - Dynamic prompt alerts when switching to offline mode.
3. **Onboarding State (`useOnboarding`)**:
   - `hasCompletedOnboarding: boolean` - Stored in `localStorage`.
   - `currentStep: number` - Current step (0: Welcome, 1: Offline calculator, 2: AI assistant tutor).
4. **Chat State (`useChatbot`)**:
   - `messages: ChatMessage[]` - Stored message thread `{ role: 'user' | 'model', content, extractedNumber?: string }`.
   - `isLoading: boolean` - Generation status indicator.

---

## 5. Phased Implementation Roadmap

### Phase 1: Onboarding & Offline PWA Foundation
- Setup PWA assets (`manifest.json`, service worker registration, and icons).
- Implement `useOnlineStatus` hook and ambient offline status indicator.
- Build interactive 3-step onboarding walkthrough modal with skip and completion controls, storing preference in `localStorage`.
- Configure Vite/Express full-stack foundation with server script.

### Phase 2: High-Precision Calculator & History
- Implement comprehensive arithmetic and scientific calculation engine with support for parentheses, percentages, trigonometric, and logarithmic functions.
- Build tactile dark-mode keypad with clear visual groupings (numbers, operators, memory, functions).
- Support physical keyboard input (numbers, `Enter`, `Backspace`, `Escape`).
- Build calculation history panel with reloadable prior results.

### Phase 3: AI Chatbot Tutor & Express API
- Create server-side endpoint `POST /api/chat` using `@google/genai` and `gemini-3.8-flash` with system prompt dedicated to mathematics, financial reasoning, and step-by-step guidance.
- Build floating AI Chat button with badge indicator.
- Create slide-out chat drawer with message bubbles, markdown math formatting, prompt chips, and loading animations.
- Graceful offline fallback message in chat when network is disconnected.

### Phase 4: Interoperability Bridge, Install Prompt & Verification
- Implement the "Explain Expression" bridge: sending current calculator formula into the AI chat.
- Implement the "Insert Answer" bridge: injecting AI mathematical conclusions straight into the calculator display.
- Add in-app PWA install trigger button (`PWAInstallButton`) with iOS Safari instructions.
- Execute full app compilation test (`compile_applet`) and verify zero console errors.
