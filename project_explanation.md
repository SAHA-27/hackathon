# Dynamic Agent Security Gateway

This project is a clean, interactive frontend prototype built for a cybersecurity hackathon. It demonstrates a security layer positioned between AI agents and enterprise APIs. Its primary purpose is to authenticate, authorize, and evaluate the risk of every agent request before granting access to critical enterprise systems (like HR, Finance, or CRM databases).

## Project Overview

In this phase of the prototype, we focused on building a polished, client-side only (React + LocalStorage) MVP that successfully visualizes the lifecycle of an AI agent's request. We avoided complex backend systems, real databases, and heavy authentication systems to ensure a fast, robust, and visually convincing live demo.

### The Core Flow Demonstrated

1. **Authentication:** Verifies if the requesting AI agent is registered and trusted.
2. **Authorization:** Checks if the agent possesses the permissions necessary for the requested action.
3. **Risk Engine:** Computes a risk score (0 to 100) based on factors like action sensitivity, agent identity, and time of request.
4. **Decision:** 
   - Low risk (< 50) → **Allowed**
   - Medium risk (50 - 85) → **Pending Approval (Human in the loop)**
   - High risk (> 85) or Unauthorized → **Blocked**
5. **Audit Logging:** Every simulated request and human decision is permanently recorded in the activity logs.

## What We Have Built

The application was built using **React, TypeScript, Vite, and Tailwind CSS**. It contains four main screens tailored exactly for a demo sequence.

### 1. Dashboard (`src/pages/Dashboard.tsx`)
- Provides a high-level overview of the security gateway's operations.
- Contains metric cards tracking Total Requests, Allowed, Pending Approval, and Blocked actions.
- Features a **Security Flow diagram** illustrating the path: `AI Agent → Gateway → Decision → Enterprise API`.
- Displays a table of the most recent requests and their live statuses.

### 2. Simulate Agent Request (`src/pages/Simulate.tsx`)
- The core interactive piece of the prototype.
- Provides a form allowing the user to select an Agent (HR, Finance, Unknown), an Action, a Target System, and risk modifiers (outside business hours, sensitive data).
- Simulates an animated, multi-step evaluation process:
  1. Authentication
  2. Authorization
  3. Risk Analysis
  4. Final Decision
- Results in a comprehensive breakdown explaining the reasoning behind the computed risk score and the final decision.
- Automatically saves this request to LocalStorage, making it instantly available in the live tracking and log screens.

### 3. Live Requests & Approval Center (`src/pages/LiveRequests.tsx`)
- **Live Requests Tab:** Shows a real-time table of all evaluated requests. Clicking "View Details" opens a modal displaying the exact checks and reasoning for that request.
- **Approval Queue Tab:** Specifically filters for requests sitting in a "Pending Approval" state (usually medium risk). It provides interactive `Approve` and `Reject` buttons, simulating human-in-the-loop intervention.

### 4. Activity Logs (`src/pages/ActivityLogs.tsx`)
- An immutable audit trail proving that the system tracks every AI action and human decision.
- Contains filtering capabilities (All, Allowed, Pending, Blocked).
- Displays timestamps, unique log IDs, involved agents, risk scores, and the documented reasoning for every recorded event.

## Technical Details

- **State Management:** We used a lightweight data store located at `src/store.ts`. It acts as a wrapper around the browser's `localStorage` API, seeding the application with initial mock data and ensuring new simulations persist across page reloads.
- **Styling:** Fully styled with **Tailwind CSS**. We utilized a dark navy theme for the sidebar and clean slate/white components for data cards to achieve a professional cybersecurity aesthetic.
- **Icons:** We used `lucide-react` for clean, consistent iconography throughout the prototype.
- **Routing:** Handled smoothly on the client side using `react-router-dom`.

## How to Run the Demo

Since the dependencies are installed and the project is fully bootstrapped, you can run the development server via:

```bash
npm run dev
```

### Recommended Hackathon Presentation Sequence:

1. **Dashboard:** Introduce the concept—all AI agents must pass through this checkpoint.
2. **Simulation (Low Risk):** Run an *HR Agent* viewing *employee details*. Show it seamlessly passing (Allowed).
3. **Simulation (Medium Risk):** Run an *HR Agent* attempting to *update a salary*. Show it getting caught by the Risk Engine (Pending Approval).
4. **Approval Center:** Navigate to the Approval Queue and manually approve the salary update as a human admin.
5. **Simulation (High Risk):** Run an *Unknown Agent* trying to *delete an employee*. Show the gateway instantly blocking it due to failed authentication and high risk.
6. **Activity Logs:** Conclude by showing the logs, proving all of the above actions were permanently audited.
