# Part 2: Product Understanding – AbleSpace "Take Data" Workflow & UX/UI Evaluation

**Candidate:** Rugved Naik  
**Platform Evaluated:** AbleSpace (Special Education Caseload & IEP Data Management)  
**Module:** Caseload ➔ "Take Data" Session Workflow  

---

## 1. Executive Summary & Product Context

**AbleSpace** is a specialized digital platform designed for Special Education teachers, Speech-Language Pathologists (SLPs), Occupational Therapists (OTs), and Behavior Specialists (BCBAs). Its primary mission is to streamline **IEP (Individualized Education Program) goal tracking**, service minute compliance, and Medicaid billing.

The **"Take Data"** module is the central operational feature of AbleSpace. It allows practitioners to capture objective, real-time student performance data during live therapy sessions and instantly aggregates this data into progress monitoring graphs, clinical session notes, and compliance logs.

---

## 2. End-to-End Workflow Breakdown

```
[Caseload Tab] ──► [Click 'Take Data'] ──► [Active Session Workspace] ──► [Capture / Review Data] ──► [Graph & Stats Sync]
```

### 2.1 Caseload Navigation & Session Launch
The workflow begins on the **Caseload** dashboard, which acts as the central directory for all assigned students.

* **Key Elements:**
  * Search bar with keyboard shortcut (`⌘ + k`) and student filtering.
  * Student table displaying **Full Name**, **IEP Due Date**, **Evaluation Due Date**, **Collaborators**, **Service Time (e.g., 30 or 60 mins/week)**, and **School**.
  * Primary Action: The prominent blue **`Take Data`** button next to each student.
* **User Action:** Clicking **`Take Data`** on a student launches an active therapy data-collection workspace pre-loaded with all of that student's active IEP goals.

---

### 2.2 Active Session Workspace & Header Controls
Once the session launches, the practitioner enters a structured data-entry environment designed for real-time tracking during therapy.

* **Session Timestamp Header:** Automatically tracks the date and live session duration (e.g., `08/20/2026, 09:38 PM - 10:08 PM`) to calculate billable direct service minutes.
* **Multi-Student Switcher (`+ Add Student`):** Enables adding peer students on the fly for group therapy sessions.
* **In-Session Badges:** 
  * `● Accommodations`: Quick access to required student accommodations (visual schedules, sensory tools, etc.).
  * `● Services Not Tracked`: Alerts the user if mandatory service logging requirements have not yet been completed.
* **Goals Sidebar (`Goals 7/7`):** Left-hand panel listing all active IEP goals (e.g., *Social Studies, Writing, Math, Reading, Toileting*) with progress status and search/filter tools.

---

### 2.3 Data Capture Modes (`Capture` Tab)
AbleSpace dynamically adapts the input interface based on the type of IEP goal being tracked:

#### Mode A: Binary Discrete Trials (`+ / -`)
* Used for frequency and binary success/error targets (e.g., *Demo Student1 taking bites of food in 4 out of 5 opportunities*).
* Features large **`[ + ]` (Correct)** and **`[ - ]` (Incorrect)** cards with a quick **`Undo`** button to correct mis-taps.

#### Mode B: Prompt Level Matrix
* Used for tracking independence levels across multiple target stimuli (e.g., *Color identification with flashcards: Red, Yellow, Orange, Green, Blue*).
* Renders a 2D matrix grid with columns for **`Independent`**, **`1-2 Prompts`**, **`More than 2 Prompts`**, and **`Refused`**, allowing the therapist to record the exact level of assistance given per item.

#### Mode C: Task Analysis / Step-by-Step Goals
* Used for chained behavioral tasks (e.g., *Writing name letter-by-letter: D-E-M-O*), providing checkboxes for each individual step in a trial.

---

### 2.4 Workspace Customization & Multi-Goal Views
Practitioners can tailor their workspace depending on their therapy setting via the **`Customize View`** drawer:

* **List View:** Focuses on one goal at a time with a dedicated trial capture pad.
* **Board / Card View:** Arranges multiple goals and sub-objectives side by side for rapid switching during multi-domain sessions.
* **Group View:** Optimizes the screen for multi-student group sessions.
* **Display Toggles:** Allows showing/hiding `Instructions` and `Data Collection Buttons` for a compact view.

---

### 2.5 Progress Monitoring, Historical Stats & Goal Info
The session screen provides four sub-tabs for deep clinical insight:

1. **📈 `Graph` Tab:** Plots longitudinal progress charts (e.g., Frequency from `1` to `5` over time) with baseline and phase lines for IEP reporting.
2. **📊 `Stats` Tab:** Chronological historical data log showing timestamped trial counts, editing clinician, and attached qualitative notes (e.g., behavioral incidents).
3. **ℹ️ `Info` Tab:** Displays target criteria, data point counts, last updated dates, and overall performance averages (e.g., `Average: 3.50`).

---

## 3. User Personas & Real-World Constraints

| Persona | Primary Use Case | High-Friction Context / Constraints |
| :--- | :--- | :--- |
| **Speech-Language Pathologist (SLP)** | Fast-paced discrete trials (50+ drills in 20 minutes). | One hand holds flashcards/props; requires rapid, single-handed tablet tapping. |
| **Special Education Teacher** | Group instruction (3–5 students simultaneously). | Distracted classroom environment; needs quick student-switching without losing context. |
| **Occupational Therapist (OT)** | Fine motor & sensory duration tracking. | Hands-on physical assistance; typing long session notes on a keyboard is impossible. |

---

## 4. UX/UI & Functionality Improvement Recommendations

---

### 💡 Improvement 1: Equal-Weight & High-Contrast Hit Targets for Binary `+ / -` (UI / Ergonomics)
* **Current Friction:** The `[+]` button is a large blue bar at the bottom, while `[-]` is a thin white card above it. In live therapy, clinicians often tap while looking at the student, leading to accidental mis-taps due to uneven button sizing.
* **Proposed Solution:** Split the card into **two equal-sized touch zones** with clear semantic colors: **Soft Green for `[ + Correct ]`** and **Soft Red/Rose for `[ - Incorrect ]`**. Add optional **Haptic Feedback** (vibration on tablet/mobile) to confirm trial capture.

---

### 💡 Improvement 2: Interactive Touch-Pills & Keyboard Shortcuts for Prompt Matrix (UX / Speed)
* **Current Friction:** The Prompt Matrix uses small circular radio buttons for each item (`Independent`, `1-2 Prompts`, `More than 2 Prompts`, `Refused`). Tapping small 16px dots while holding physical flashcards is slow and prone to errors.
* **Proposed Solution:** Replace radio buttons with **Full-Width Interactive Pill/Chip Buttons** that highlight upon selection. Enable **Keyboard Number Shortcuts** (`1` = Independent, `2` = 1-2 Prompts, `3` = >2 Prompts, `4` = Refused).

---

### 💡 Improvement 3: Quick Behavior Incident Tagging inside Notes (Functionality / AI)
* **Current Friction:** In the `Stats` tab, qualitative behavioral observations (e.g., *"Demo Student1 got angry and was hitting other students"*) are typed out manually in a text area, taking time away from teaching.
* **Proposed Solution:** Introduce **One-Tap Behavior Incident Quick-Chips** (e.g., `[ ⚠️ Aggression ]`, `[ 🏃 Elopement ]`, `[ 🛑 Refusal ]`, `[ 💤 Off-Task ]`). Tapping a chip automatically inserts a timestamped incident entry into the session log.

---

### 💡 Improvement 4: In-Session Real-Time Micro-Sparklines (Data Visualization)
* **Current Friction:** Clinicians must leave the `Capture` tab and click `Graph` to see if today's score is above or below the student's historical baseline.
* **Proposed Solution:** Render an **unobtrusive mini-sparkline trendline** directly beside each goal title in the left-hand sidebar (e.g., `Today: 80% ↗ (+10% vs baseline)`).

---

### 💡 Improvement 5: Auto-Rotating Turn-Taking in Group Therapy Sessions (Workflow UX)
* **Current Friction:** During group sessions (e.g., 3 students working on turn-taking), switching between students requires manually clicking individual student tabs each time.
* **Proposed Solution:** Introduce an **"Auto-Rotate Turn" toggle** that automatically cycles focus to the next student card after a trial is recorded.

---

## 5. Summary Matrix of Proposed Improvements

| Improvement | Category | Problem Addressed | User Benefit |
| :--- | :--- | :--- | :--- |
| **High-Contrast `+/-` Touch Zones** | UI / Ergonomics | Uneven button sizing and low visual contrast | Faster blind-tapping during hands-on therapy |
| **Touch Pills for Prompt Matrix** | UX / Speed | Small radio button mis-clicks | Eliminates mis-taps; speeds trial entry by 50% |
| **Quick Behavior Incident Chips** | Functionality | Slow manual typing of behavior disruptions | Instant timestamped incident logging |
| **Sidebar Micro-Sparklines** | Data Visualization | Having to switch to `Graph` tab mid-session | In-session clinical decision making |
| **Auto-Rotating Group Turn-Taking** | Workflow UX | Manual tab switching in group therapy | Smooth, synchronized multi-student sessions |

---

## 6. Conclusion

AbleSpace's **"Take Data"** module provides a strong foundation for digitizing special education workflows. By addressing critical tactile frictions (such as button sizing, prompt chip interactions, and behavior quick-tagging), the platform can significantly reduce in-session cognitive load for educators, allowing them to spend less time managing software and more time focused on student growth.
