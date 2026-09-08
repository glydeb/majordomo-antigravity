---
name: gtd-agent-workflow
description: Use this skill when developing, testing, or refining the multi-agent AI assistant pipeline in LifeOS, including GreetingAgent, TriageAgent, and ScheduleAgent with LLM function calling.
---

# GTD AI Assistant Agent Workflow

This runbook guides building and testing the intelligent AI Assistant pipeline for LifeOS.

## 1. Agent Roles & Responsibilities

1. **`GreetingAgent`**:
   - **Trigger**: User login or morning dashboard load.
   - **Inputs**: Latest readiness score (from `BiometricLog`), pending high-priority tasks, Google Calendar events for the day.
   - **Output**: Concise, motivating morning briefing and recommended focus of the day.

2. **`TriageAgent`**:
   - **Trigger**: Quick-capture input in GTD Inbox.
   - **Function**: Parses unorganized natural language thoughts into structured tasks.
   - **Output Schema**:
     - `title`: Actionable task name starting with a verb.
     - `context`: Associated context tag (`@computer`, `@phone`, `@errand`, etc.).
     - `estimatedDuration`: Minutes (e.g., 15, 30, 60).
     - `energyLevel`: `Low`, `Medium`, or `High`.
     - `project`: Target project if identifiable.

3. **`ScheduleAgent`**:
   - **Trigger**: On-demand planning or schedule re-calculation.
   - **Inputs**: Biometric readiness level, free calendar slots from Google Calendar, list of "Next Action" tasks.
   - **Behavior**:
     - High readiness (>80) -> Suggest high energy, deep work tasks.
     - Low readiness (<60) -> Suggest low energy administrative or quick win tasks.

## 2. LLM Tool & Function Calling Contract

When calling Gemini/OpenAI models:
- Define tools with clear JSON Schema descriptions for each property.
- Handle structured responses through NestJS services.
- Always encrypt task titles and descriptions prior to database persistence.
