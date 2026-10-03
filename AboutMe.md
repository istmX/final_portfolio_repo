ARYAN
=====

I’m Aryan, an AI developer from India who likes building things from the ground up. I work across full-stack web and mobile applications, backend systems, and AI-powered products — from applications that use AI as a feature to systems where AI can reason, use tools, retrieve context, coordinate agents, and actually get work done. I’m interested in the space where software stops being just something you interact with and starts becoming something that can work alongside you.

I build with JavaScript, TypeScript, Python, React, Next.js, Tailwind CSS, Node.js, Express, FastAPI, MongoDB, PostgreSQL, Firebase, LangChain, LangGraph, Docker, Expo, and React Native.

TECH STACK
==========

Languages:
JavaScript · TypeScript · Python

Frontend:
React · Next.js · Tailwind CSS

Backend:
Node.js · Express · FastAPI

Databases:
MongoDB · PostgreSQL · Firebase

AI / Agent Systems:
LangChain · LangGraph · RAG · Multi-agent systems · AI agents

Mobile:
React Native · Expo

Infrastructure:
Docker · AWS · Vercel

PROJECTS
========

I have built and experimented with a range of products including:

Extra Fine Chat
MindBloom
Pathsa AI
Noiseless
Civic Plus
CodeCat
ISTMX Skills
Crew
Asticus Mesh

For the portfolio, I am currently highlighting Crew, ISTMX Skills, CodeCat, and Noiseless, in that order.

CODECAT
=======

CodeCat is an AI-powered code review platform built with Next.js, the Vercel AI SDK, Neon Database, and Prisma ORM.

It reviews code, identifies potential problems, explains issues, and suggests fixes. The system uses multiple AI providers through a multi-provider fallback architecture, allowing the application to continue operating when a primary provider is unavailable.

ISTMX SKILLS
============

`@istmx/skills` is a deterministic, stack-agnostic orchestration and software-development workflow toolkit for coding agents and AI-enabled editors, including Claude Code, Cursor, Windsurf, Gemini, Cline, and Roo Code.

It gives coding agents reusable architecture and design workflows, over 70 production design presets, and structured tools for planning, implementation, debugging, security review, performance work, and release preparation. Its `/istm` command acts as a general prompt router, selecting a relevant workflow for a task. It also includes automated browser QA workflows.

The package has passed 1,000 npm downloads.

Website: https://istmx.dpdns.org
Documentation: https://istmx.dpdns.org/docs
GitHub: https://github.com/istmX/skills
npm: https://www.npmjs.com/package/@istmx/skills

NOISELESS
=========

Noiseless is an autonomous research agent designed to continuously monitor topics and deliver useful information based on a frequency defined by the user.

Instead of requiring the user to repeatedly perform research manually, Noiseless can investigate information, process findings, and produce scheduled digests.

It can connect with services such as Gmail and Slack, allowing research updates and digests to be delivered through the user's existing workflow.

CREW
====

Crew is an autonomous AI workforce and the main product I am currently building.

The core idea is simple: instead of an AI that only answers questions, Crew can take responsibility for completing real work.

The user talks to one main Crew agent, gives it a goal, and Crew can plan the work, delegate tasks to specialized agents, operate tools and computers, use connected services, track execution, and return the finished result.

Crew can coordinate specialized agents such as:

Researcher
Coder
Writer
Designer
Analyst
Planner
Computer Agent
Custom user-defined agents

A user can also explicitly work with agents through the main conversation, for example:

"@researcher investigate the latest papers on agent memory"

"@coder review this repository"

"@writer turn this research into a report"

The main Crew agent remains the coordinator and user-facing interface.

AUTONOMOUS EXECUTION
====================

Crew is designed around execution rather than simple chat responses.

A task can follow a loop such as:

User Goal
    ↓
Understand
    ↓
Plan
    ↓
Delegate
    ↓
Execute
    ↓
Observe
    ↓
Update State
    ↓
Continue or Complete
    ↓
Deliver Result

Agents can operate their own computer environment running on AWS EC2.

The computer environment can provide browser interaction, terminal access, files, applications, screenshots, and other computer-use capabilities.

This allows agents to perform real computer-based work instead of relying exclusively on individual APIs.

For example, a user could ask:

"Research the AI-agent market for the next week and after one week write a Google Docs summary for my work."

Crew can coordinate the research, operate the computer, gather information, analyze it, create the document, and deliver or notify the user when the work is complete.

CONNECTED SERVICES
===================

Crew is designed to connect agents with external services such as:

Gmail
Google Drive
Google Docs
GitHub
Slack
Notion
Google Calendar

These connections allow agents to perform work across the applications a user already uses.

For example:

Research → Analyze → Write Google Doc → Send Gmail update

or:

Inspect GitHub repository → Analyze code → Generate report → Save artifact

AGENT + COMPUTER ARCHITECTURE
=============================

Crew separates the agent from the computer it operates.

Agent
  ↓
Agent Runtime
  ↓
Computer Abstraction
  ↓
AWS EC2 Computer
  ↓
Browser / Terminal / Files / Applications

The computer is treated as an execution environment rather than being tightly coupled to the agent itself.

The goal is to make the architecture extensible so different computer implementations and execution environments can be introduced later.

MULTI-AGENT WORK
================

A single task can involve several specialized agents.

For example:

Crew
 ├── Researcher
 │     └── Computer / Browser
 │
 ├── Analyst
 │     └── Compare findings
 │
 ├── Writer
 │     └── Generate report
 │
 ├── Google Docs
 │     └── Save document
 │
 └── Gmail
       └── Send update

The user does not have to manually coordinate every step.

RAG AND MEMORY
==============

Crew can use RAG and semantic retrieval to retrieve relevant information from previous research, documents, artifacts, and other indexed context.

The system separates structured application state from semantic memory.

PostgreSQL handles structured application state, while Qdrant can provide vector-based semantic retrieval.

This allows agents to retrieve relevant context without repeatedly loading an entire knowledge base into every model request.

TECHNOLOGY BEHIND CREW
======================

Web:
Next.js · React · TypeScript · Tailwind CSS

Mobile:
React Native · Expo

Backend:
Python · FastAPI

AI / Orchestration:
LangChain · LangGraph · RAG · Multi-agent execution

Database:
PostgreSQL · Neon · Qdrant

Infrastructure:
Docker · AWS EC2

The project is designed around a separation between the control plane and execution environment.

Control Plane:
Next.js · FastAPI · PostgreSQL · authentication · task state · orchestration · permissions · observability

Execution:
Agent Runtime · LangGraph · LLMs · tools · computer environment · AWS EC2

The web and mobile applications act as interfaces for controlling and observing work, while the actual autonomous execution can happen in the remote computer environment.

CREW IN ONE SENTENCE
====================

Crew is an autonomous AI workforce where a main agent accepts real-world goals, delegates work to specialized agents, gives them a real AWS EC2 computer to operate, lets them use browsers, applications, files, and connected services, continuously orchestrates their execution, and delivers completed work or updates back to the user.

WHAT I BUILD
============

I build AI systems that go beyond simple prompting.

I build full-stack products around AI.

I build backend systems that allow those products to actually execute work.

I build developer tools that solve problems I encounter while building.

And I experiment with new ways for software and AI agents to work together.

My portfolio is ultimately a record of those things: what I build, what I learn from building them, and the systems I create along the way.
