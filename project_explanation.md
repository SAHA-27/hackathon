# Dynamic Agent Security Gateway

**"Secure Every AI Agent Action Before It Reaches Enterprise Systems"**

This project is an advanced, enterprise-grade frontend prototype built for a cybersecurity hackathon. It demonstrates a **Zero-Trust Security Gateway** positioned between AI agents and enterprise APIs. Rather than just protecting APIs from external users, this platform protects your infrastructure from the actions performed by autonomous AI agents.

## Core Architecture & The Zero-Trust Pipeline

Every simulated request in this platform follows a strict, zero-trust lifecycle:
`AI Agent → Gateway → Authentication → Least-Privilege Authorization → Anomaly Detection & Risk Engine → Decision → Human Oversight → Enterprise API`

## Enterprise-Grade Features Built

### 1. Security Posture & Executive Dashboard
- **Executive Security View:** A top-level dashboard tailored for security managers.
- **Security Posture Score:** A dynamic metric representing the overall health of the gateway's defenses.
- **Emergency Gateway Lockdown:** A prominent "Kill Switch". When activated, all AI-to-Enterprise communication is instantly suspended, and any incoming requests are blocked with a maximum risk score of 100.

### 2. Explainable Risk Engine & Behavioral Anomaly Detection
- Computes a dynamic risk score (0-100) based on factors like action sensitivity, agent identity, target system, and business hours.
- **Explainable AI:** The system doesn't just output a score; it outputs an array of exact risk factors (e.g., "+45 High sensitivity operation", "+20 Sensitive data access requested") so security teams know exactly *why* a decision was made.
- **Behavioral Anomaly Detection:** Establishes baselines for agents. For example, if a normally safe `HR Agent` attempts a highly destructive `Delete` operation, the engine flags this as a behavioral anomaly and penalizes the risk score.

### 3. Human-in-the-Loop (HITL) Intelligence
- Medium-risk operations are caught and placed in the **Approval Center**.
- Human administrators can view the potential impact, triggered policies, and risk factors before deciding.
- **Awaiting Agent Justification:** Instead of a simple binary Approve/Reject, admins can "Request More Info", pushing the request into a holding state requiring justification from the AI agent developer.

### 4. Agent Identity & Least Privilege Management
- A dedicated **Agents & Policies** directory detailing registered AI agents.
- Enforces the principle of **Least Privilege** by explicitly mapping out exactly which API endpoints each agent is authorized to call.

### 5. Immutable Audit Logging
- Every single evaluation, automated block, and human decision is permanently recorded in the **Activity Logs**, providing a complete, filterable security audit trail.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS (Dark Mode Glassmorphism Theme)
- **Icons:** Lucide React
- **Data Layer:** LocalStorage (Mocking backend services to ensure a flawless, zero-latency 5-minute hackathon demo)
- **Routing:** React Router DOM

## How to Run the Demo

```bash
npm install
npm run dev
```

### Recommended Hackathon Presentation Sequence:

1. **Dashboard & Lockdown:** Open the Dashboard. Explain the Security Posture. Click the **EMERGENCY LOCKDOWN** button to demonstrate crisis response.
2. **Lockdown Simulation:** Go to Simulate Request. Run any request. Show the system instantly blocking it with a 100/100 score due to the lockdown.
3. **Low Risk (Normal Operation):** Turn off lockdown. Simulate an *HR Agent* viewing *employee details*. Show it seamlessly passing (Allowed).
4. **Behavioral Anomaly (High Risk):** Simulate an *HR Agent* attempting to *delete an employee*. Show the Risk Engine detecting an anomaly (destructive action from a read-heavy agent) and catching it.
5. **Human-in-the-loop (Medium Risk):** Simulate an *HR Agent* attempting to *update a salary*. Show it getting caught by the Risk Engine (Pending Approval).
6. **Approval Center:** Navigate to the Approval Queue. Demonstrate the "Request More Info" intelligence feature, showing true human oversight.
7. **Zero-Trust Block:** Simulate an *Unknown Agent* trying to *delete an employee*. Show the gateway instantly blocking it due to failed authentication.
8. **Activity Logs:** Conclude by showing the logs, proving all automated and human actions were permanently audited.
