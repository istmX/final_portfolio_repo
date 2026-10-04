export type BlogSection = {
  heading: string
  paragraphs?: string[]
  points?: string[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  image?: string
  imageAlt?: string
  imageCredit?: { label: string; href: string }
  featuredOnHome?: boolean
  sections: BlogSection[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'from-chat-to-execution',
    title: 'From chat to execution: building agents that finish the work',
    excerpt: 'A useful agent needs more than a good answer. It needs a plan, tools, a place to work, and a way to know what happened next.',
    category: 'AI & agent systems',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1506399309177-3b43e99fead2?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Rows of server cabinets and network cables inside a data center',
    imageCredit: { label: 'Unsplash', href: 'https://unsplash.com/de/fotos/schwarzes-imgix-serversystem-pgdaAwf6IJg' },
    featuredOnHome: true,
    sections: [
      {
        heading: 'A reply is not the same as a result',
        paragraphs: [
          'A chat model can explain how to research a topic, review a repository, or prepare a report. But the person asking still has to open the tools, do the work, keep track of what changed, and bring the result back together. I am interested in closing that gap.',
          'The products I want to build treat an agent as a worker with a clear goal. It should understand the request, make a plan, use the right tools, observe what those tools did, and keep going until it can return something useful.'
        ]
      },
      {
        heading: 'Give execution a home',
        paragraphs: [
          'For computer-based work, an agent needs an environment it can actually operate. A browser, terminal, files, and applications provide a broader set of capabilities than a collection of narrow API calls. In Crew, the computer is a separate execution environment that the agent can use through a defined interface.',
          'That separation matters. The coordinator can focus on the goal and task state while the computer provides a place to act. It also leaves room to change the environment later without tying every agent to one machine implementation.'
        ]
      },
      {
        heading: 'Make the loop visible',
        paragraphs: [
          'A task moves through a loop: understand, plan, execute, observe, update state, and continue or finish. The observation step is easy to overlook. Without it, an agent can issue actions but cannot reliably tell whether the work succeeded, failed, or needs a different approach.',
          'Keeping task state structured also makes the process easier to follow. PostgreSQL can hold the task and execution state, while semantic retrieval can bring back relevant context from earlier research or artifacts when it is needed.'
        ]
      },
      {
        heading: 'Delegate with a reason',
        paragraphs: [
          'Specialized agents are useful when a task benefits from different kinds of work: research, analysis, writing, or coding. Delegation should make the larger job easier to complete, not add ceremony. A main agent can remain responsible for the user’s goal, divide the work, and bring the separate results back together.',
          'That is the direction I am exploring with Crew: an AI workforce where the interface stays understandable while the system behind it can plan, use tools, coordinate specialists, and deliver completed work.'
        ]
      }
    ]
  },
  {
    slug: 'turning-repeated-work-into-workflows',
    title: 'Turning repeated development work into reusable workflows',
    excerpt: 'Notes from building ISTMX Skills: making practical software workflows reusable across coding agents without tying them to one stack.',
    category: 'Developer tools',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1698919585695-546e4a31fc8f?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'A developer workstation with a laptop and monitor showing code and terminal output',
    imageCredit: { label: 'Unsplash · Boitumelo', href: 'https://unsplash.com/photos/a-computer-desk-with-two-monitors-and-a-laptop-A2g9OiXTW6k' },
    featuredOnHome: true,
    sections: [
      {
        heading: 'The same work keeps coming back',
        paragraphs: [
          'Building software involves more than writing a feature. I repeatedly need to understand an existing architecture, make a plan, debug a failure, review security, improve performance, and prepare a release. Coding agents can help with those jobs, but starting from a blank prompt every time makes the process uneven.',
          'ISTMX Skills grew from that friction. It packages software-development workflows that can be reused across coding agents and AI-enabled editors, including Claude Code, Cursor, Windsurf, Gemini, Cline, and Roo Code.'
        ]
      },
      {
        heading: 'Keep the workflow stack-agnostic',
        paragraphs: [
          'A workflow should help an agent think through the task without assuming one framework or repository shape. The package is implemented in JavaScript and provides structured workflows for planning, implementation, debugging, security review, performance work, and release preparation.',
          'That does not remove the need to inspect the actual project. It gives the agent a repeatable route through the work, while the project itself supplies the constraints and details.'
        ]
      },
      {
        heading: 'Make the entry point easy to remember',
        paragraphs: [
          'The `/istm` command acts as a general prompt router. A developer can describe a task in ordinary language, and the router selects a relevant workflow. This keeps the starting point simple while making more specialized guidance available when the task calls for it.',
          'The package also includes more than 70 production design presets and automated browser QA workflows. Together, these are intended to make common decisions and checks easier to reach from inside an agent workflow.'
        ]
      },
      {
        heading: 'Build tools from real friction',
        paragraphs: [
          'I like building developer tools that solve problems I run into while building other products. The useful test is whether the tool makes the next task clearer or more repeatable. It should give structure without getting in the way of the developer or the agent.',
          'ISTMX Skills is one experiment in that direction: reusable workflows for the tools people already use, shaped by day-to-day software work and improved as those workflows meet real projects.'
        ]
      }
    ]
  },
  {
    slug: 'why-the-computer-is-part-of-the-agent',
    title: 'Why the computer is part of the agent',
    excerpt: 'A browser, terminal, files, and applications give an agent a place to act. Treating that environment as its own layer makes the system easier to extend.',
    category: 'AI & agent systems',
    readTime: '4 min read',
    sections: [
      {
        heading: 'Tools need somewhere to work',
        paragraphs: [
          'Many AI products connect a model to individual APIs. That is useful, but real work often crosses applications and involves steps that were never exposed as a neat endpoint. A computer environment gives an agent a browser, terminal, files, and applications it can operate together.',
          'For Crew, I think of the computer as an execution environment. The agent decides what it needs to do; the computer provides the surface where those actions happen.'
        ]
      },
      {
        heading: 'Keep the agent separate from the machine',
        paragraphs: [
          'An agent and the computer it uses have different responsibilities. The agent interprets the goal, plans, and decides what to try next. The computer performs actions and reports what it can observe. A clear boundary lets each side evolve without baking one specific machine into every agent.',
          'That boundary also makes it easier to imagine different execution environments later. The agent should rely on a computer interface, rather than assumptions about one particular browser or host.'
        ]
      },
      {
        heading: 'Observation completes the action',
        paragraphs: [
          'Issuing a click or running a command is only half an operation. The agent needs to inspect the result and update its understanding. A screenshot, a file change, or command output becomes evidence for the next decision.',
          'This makes the execution cycle concrete: act, observe, update state, and choose whether to continue. It is a practical foundation for computer use that can be monitored and improved.'
        ]
      }
    ]
  },
  {
    slug: 'memory-without-loading-everything',
    title: 'Useful agent memory does not mean loading everything',
    excerpt: 'Keep task state structured, retrieve relevant context when needed, and let an agent find the right memory without stuffing every document into every request.',
    category: 'AI & agent systems',
    readTime: '4 min read',
    sections: [
      {
        heading: 'More context is not always better',
        paragraphs: [
          'A project can collect research, documents, artifacts, and task history quickly. Sending all of that to a model for every step makes it harder to focus on the current question and wastes room that could hold the useful details.',
          'The better goal is to make relevant information findable. Retrieve the pieces that help with the work at hand, then keep the rest available for another time.'
        ]
      },
      {
        heading: 'Separate state from semantic memory',
        paragraphs: [
          'A task has structured facts: its status, owner, steps, and outputs. Those facts should be stored and updated in a predictable way. Crew uses PostgreSQL for structured application state.',
          'Other knowledge is less rigid. A prior research note or document may be relevant because of its meaning rather than its ID. Semantic retrieval with a vector store such as Qdrant can help surface that context when an agent needs it.'
        ]
      },
      {
        heading: 'Retrieve with the task in mind',
        paragraphs: [
          'Memory works best when it responds to a specific need: what has already been researched, which artifact answers this question, or what context should the writer know? This keeps retrieval tied to the active task instead of becoming a second unbounded history.',
          'The aim is not to remember everything equally. It is to keep dependable task state and make useful past work easy to recover at the moment it matters.'
        ]
      }
    ]
  },
  {
    slug: 'one-coordinator-many-specialists',
    title: 'One coordinator, many specialists',
    excerpt: 'A multi-agent system works best when specialist roles serve one clear goal and a main agent stays accountable for bringing the result together.',
    category: 'AI & agent systems',
    readTime: '4 min read',
    sections: [
      {
        heading: 'Specialization should solve a real problem',
        paragraphs: [
          'A task may need careful research, code review, analysis, and a clear final report. Those are different kinds of work, and a specialist agent can focus on one of them with the right context and tools.',
          'Adding agents simply because a system can coordinate them is not a design goal. Each role should make a part of the work clearer, more focused, or easier to complete.'
        ]
      },
      {
        heading: 'Keep one agent responsible for the goal',
        paragraphs: [
          'In Crew, the user speaks with one main agent. It understands the goal, chooses when to delegate, tracks progress, and returns the completed result. The user can also explicitly ask a researcher, coder, or writer for help through that same conversation.',
          'This gives the system room to divide work without asking the user to manage every handoff. The coordinator remains the user-facing point of contact.'
        ]
      },
      {
        heading: 'Bring the work back together',
        paragraphs: [
          'Delegation creates a new responsibility: combining the outputs. Research needs to inform analysis; analysis may need to shape a report; the report needs to answer the original request. A coordinator should preserve that thread as subtasks finish.',
          'I see multi-agent work as a way to organize a larger execution loop. Its value is measured by the quality of the finished task, not by how many agents appear in the diagram.'
        ]
      }
    ]
  },
  {
    slug: 'research-that-fits-your-workflow',
    title: 'Research that fits into your existing workflow',
    excerpt: 'Noiseless explores a simple idea: monitor a topic on the schedule you choose, prepare a useful digest, and deliver it where you already work.',
    category: 'Product notes',
    readTime: '3 min read',
    sections: [
      {
        heading: 'Move beyond one-off searches',
        paragraphs: [
          'Some research questions return every week. Repeating the same search by hand makes it easy to miss changes and hard to compare what is new. Noiseless is designed to monitor topics continuously at a frequency chosen by the user.',
          'The goal is to hand off the recurring work: investigate, process the findings, and prepare a digest that is useful without requiring the person to start over each time.'
        ]
      },
      {
        heading: 'Deliver the result where work happens',
        paragraphs: [
          'A digest is most useful when it reaches the person in a familiar place. Noiseless can connect to services such as Gmail and Slack so updates fit into an existing workflow.',
          'That changes the product question from “Can the agent find information?” to “Can the information arrive at the right time, in a form I can use?”' 
        ]
      },
      {
        heading: 'Let the user set the rhythm',
        paragraphs: [
          'Different topics move at different speeds. Letting a user choose the monitoring frequency gives them control over how often research runs and how much information arrives.',
          'This is one example of a broader direction I care about: software that can take responsibility for repeatable work while keeping people informed about what it did.'
        ]
      }
    ]
  },
  {
    slug: 'keeping-code-review-available',
    title: 'Keeping an AI code review available when providers fail',
    excerpt: 'CodeCat uses a multi-provider fallback approach so a temporary issue with one AI provider does not have to stop a code review.',
    category: 'Product notes',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1634836023845-eddbfe9937da?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'A software workspace showing code and application panels on two screens',
    imageCredit: { label: 'Unsplash', href: 'https://unsplash.com/s/photos/software-demo' },
    sections: [
      {
        heading: 'A review depends on more than the prompt',
        paragraphs: [
          'A code review product needs to do more than send a diff to a model. It should identify possible problems, explain why they matter, and suggest practical fixes. CodeCat is built around that experience.',
          'The product uses the Vercel AI SDK and multiple AI providers. That makes provider availability part of the product design, not just an infrastructure detail.'
        ]
      },
      {
        heading: 'Plan for an unavailable provider',
        paragraphs: [
          'External services can become unavailable or return errors. A multi-provider fallback architecture gives the application another route to try when its primary provider cannot respond.',
          'Fallback does not make failures disappear. It gives the system a way to continue operating when an alternate provider can handle the request.'
        ]
      },
      {
        heading: 'Reliability is part of the user experience',
        paragraphs: [
          'If a code review fails before it begins, the user has no feedback on the code. Designing for fallback helps the application stay useful through ordinary service interruptions.',
          'That is the principle behind CodeCat’s provider setup: keep the review flow resilient while still returning explanations and suggested fixes that a developer can evaluate.'
        ]
      }
    ]
  },
  {
    slug: 'the-full-stack-behind-an-ai-product',
    title: 'Building an AI product across web, backend, and mobile',
    excerpt: 'An AI feature lives inside a whole product. Web and mobile interfaces, backend services, and persistent state all shape how people use it.',
    category: 'Building products',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1664316006808-c0ac894facc5?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'A person holding a smartphone and using a mobile application',
    imageCredit: { label: 'Unsplash · Mark Bishop', href: 'https://unsplash.com/photos/a-hand-holding-a-cell-phone-zYpxh60n13A' },
    featuredOnHome: true,
    sections: [
      {
        heading: 'The model is one component',
        paragraphs: [
          'It is tempting to describe an AI product by naming its model or framework. But a person uses a whole application: they need an interface to describe a goal, a backend to coordinate the work, and somewhere to keep track of what happened.',
          'I build across those layers, from web and mobile interfaces to backend systems and agent orchestration. Each layer has a part in making an AI capability dependable and understandable.'
        ]
      },
      {
        heading: 'Give every layer a clear job',
        paragraphs: [
          'For Crew, the web and mobile apps are ways to control and observe work. The control plane handles authentication, task state, orchestration, permissions, and observability. The execution side runs agents, tools, and computer-based work.',
          'The mobile app brings the same control and visibility to a smaller screen. React Native and Expo make it possible to build that mobile interface alongside the web application while the backend and agent runtime handle the actual execution.',
          'Separating those responsibilities helps the product grow without making either interface responsible for work that belongs in an agent runtime or remote environment.'
        ]
      },
      {
        heading: 'Build for the complete task',
        paragraphs: [
          'A useful AI feature has to fit the user’s actual task. That may mean saving an artifact, delivering a digest, or returning a code review with clear findings. The surrounding software makes those outcomes possible.',
          'Thinking in full-stack terms keeps me focused on the complete experience: not only what the model can say, but how the product helps someone get from a goal to a result.'
        ]
      }
    ]
  },
  ...([ 
    ['designing-fastapi-services-for-ai-products','Designing FastAPI services for AI products','Backend engineering','A Python API around a model needs clear boundaries, validation, and predictable failure behavior before it needs more endpoints.','Keep request validation, application logic, and provider calls separate. This makes the service easier to change and keeps framework details from leaking into product logic.','Model requests can time out, be rate limited, or return malformed output. Set timeouts, validate responses, and map provider failures to stable API errors.','For long work, return a task identifier and expose status separately. Typed response contracts, request IDs, and structured logs make the service easier to operate.'],
    ['python-type-hints-for-api-teams','Python type hints that help API teams','Python','Types are most useful when they describe boundaries clearly and catch mismatches before a request reaches production.','Type data as it enters the service and define the shape that leaves it. Avoid a broad dictionary for every stage when request, domain, and response data have different jobs.','External services fail and optional fields are genuinely optional. Represent uncertainty in types and narrow values after validating them.','Use small named types and clear signatures. Runtime validation still matters because Python annotations do not validate incoming network data by themselves.'],
    ['background-jobs-for-ai-tasks','When an AI task belongs in a background job','AI systems','Long-running agent work needs a lifecycle that survives a browser tab, a request timeout, and a temporary provider failure.','When work outlasts an ordinary HTTP request, accept it quickly and return an identifier. The client can follow progress without holding a connection open.','Define queued, running, completed, failed, and cancelled states explicitly. Retries need limits and idempotency so timeouts do not duplicate side effects.','Persist enough state to recover after a worker restarts. Report real milestones rather than invented percentages, and make finished artifacts retrievable.'],
    ['rag-is-a-data-pipeline','RAG is a data pipeline before it is a prompt','AI engineering','Retrieval quality depends on what gets indexed, how it is chunked, and whether search finds evidence relevant to a question.','Clean and inspect source documents before tuning prompts. Preserve metadata and source locations so retrieved passages remain traceable.','Measure whether the right passage appears in the retrieved set separately from whether the model writes a good answer. These are different failure modes.','Carry source identifiers into generated answers. A useful retrieval system lets people verify claims and admits when evidence is missing.'],
    ['evaluate-agents-by-outcomes','Evaluate agents by task outcomes, not confident wording','AI evaluation','Fluent text is not proof that an agent completed the work. Evaluation should check the artifacts and constraints that matter.','Define what success produces before changing a model or prompt: a file, a correct update, a reviewed change, or sources that meet stated criteria.','Build a small repeatable task set with ordinary cases, edge cases, and cases where the agent should stop and ask for information.','Track success alongside latency, tool calls, cost, and recovery behavior. Inspect failures by category to find actionable fixes.'],
    ['tool-schemas-as-interfaces','Tool schemas are product interfaces for agents','Agent design','An agent can only choose tools well when names, descriptions, and input requirements make actions understandable.','Name tools by intent and give each one a clear outcome. A large generic tool with many unrelated arguments makes the model’s choice harder.','Validate inputs and permissions in application code. A model may propose a call, but the service must decide whether it is allowed.','Small composable tools are easier to observe and retry. Return structured errors that help correct a call without exposing internals.'],
    ['prompt-injection-boundaries','Prompt injection is a boundary problem','AI safety','Instructions found in a webpage or document should not gain the authority of the user or system processing it.','Treat retrieved text as untrusted data. A prompt can explain this distinction, but system design also needs to enforce it.','Give tools narrow capabilities and check authorization at the service boundary. Require confirmation for consequential external actions.','Test malicious instructions as part of evaluation. Layered permissions, logging, and review provide stronger protection than a prompt rule alone.'],
    ['useful-ai-error-states','Design AI error states that help people recover','Product design','Explain what happened and what someone can do next without pretending to know more than the system does.','A provider timeout, invalid tool input, and incomplete answer are different outcomes. Map each to an accurate, safe user-facing state.','Offer a retry when it is safe, ask for specific missing context, or preserve background work so users do not need to repeat it.','Do not present partial output as complete. Make uncertainty visible and give people a way to inspect supporting sources.'],
    ['mobile-ai-long-running-work','Design mobile AI experiences around long-running work','Mobile development','A mobile app should let people start, follow, and revisit work without requiring them to keep a screen open.','Persist task state on the server because mobile apps are suspended and networks change. Restore a concise task list when the user returns.','Design for interruptions: keep context, offer useful notifications sparingly, and let people control notification preferences.','Web and mobile can share a task lifecycle contract while using platform-appropriate layouts. Shared code does not remove the need for touch-friendly design.'],
    ['expo-and-web-backend','Connecting an Expo app to a web backend','Mobile development','Shared contracts help web and mobile clients agree on data, while platform-specific UI keeps each experience natural.','Share stable API types and validation without forcing every screen to look identical. Phone and desktop use call for different layouts.','Centralize authentication, request configuration, and error mapping in a small client layer. Keep authorization checks on the server.','Test slow connections, app suspension, and stale data. A good shared architecture reduces duplicate logic while preserving usability.'],
    ['authentication-vs-authorization','Authentication and authorization solve different problems','Backend engineering','Knowing who made a request does not tell you whether they may read or change a particular resource.','Authentication establishes identity or a session. Protect credentials, define expiry behavior, and keep secrets out of URLs and logs.','Authorization checks whether this caller can perform this action on this resource. Enforce that at the server for every operation.','Use least privilege and log sensitive actions with enough context to investigate while avoiding unnecessary personal data.'],
    ['recoverable-agent-task-data','Model agent tasks so they can be recovered','Backend engineering','A task record should preserve enough state to show progress, retry safely, and return finished artifacts after a worker exits.','Store status, ownership, and timestamps as queryable fields. Keep the user request, generated result, and operational events distinct.','Workers can stop after an external action but before recording success. Idempotency keys and explicit step state reduce duplicate effects.','Decide what users need to retain, what helps debugging, and when each should expire. Recovery does not require keeping every event forever.'],
    ['typescript-api-contracts','Keep TypeScript API contracts clear across the stack','Full-stack development','Shared types catch client-server mismatches, but they do not replace runtime validation or stable API design.','TypeScript helps during development; HTTP data can still be malformed or stale. Validate at the boundary and return intentional errors.','Share stable domain contracts between web and mobile, keeping framework-specific details out. Schema generation helps when the API warrants it.','Adding required fields can break deployed clients. Prefer compatible changes and deliberate deprecation for interfaces already in use.'],
    ['streaming-ai-responses','Stream AI responses without faking progress','AI product design','Streaming can make waiting feel responsive, but the interface should distinguish generated text from completed work.','Stream when partial output is useful, such as a conversational answer. For tool-heavy tasks, early text may be misleading.','Track completion separately from the text connection. A closed stream does not necessarily mean the task succeeded.','Handle network loss, cancellation, and provider errors deliberately. Persist enough state to resume or explain why work stopped.'],
    ['agent-workflow-observability','Observability for agent workflows starts with a trace','AI systems','A useful trace links the request, model calls, tools, and final outcome without exposing secrets.','Use request identifiers across orchestration and tool events, recording timing and outcomes at each boundary.','Prompts and tool inputs may contain private data. Redact sensitive fields and restrict access to detailed traces.','A trace should help explain what the agent tried and where the task diverged, without claiming to expose model reasoning perfectly.'],
    ['accessible-ai-interfaces','Build accessible interfaces for AI features','Frontend development','Changing AI output makes status announcements, keyboard access, and reduced-motion behavior especially important.','Announce meaningful state changes without reading every streamed token aloud. Structure long results with headings and navigable regions.','Make every action operable by keyboard and touch, with visible focus and status that does not rely on color alone.','Let people stop work, review sources, and approve consequential actions. Accessible interfaces make choices understandable.'],
  ] as const).map(([slug, title, category, excerpt, first, second, third]) => ({
    slug, title, category, excerpt, readTime: '3 min read',
    sections: [
      { heading: 'Start with a clear boundary', paragraphs: [first] },
      { heading: 'Handle failure deliberately', paragraphs: [second] },
      { heading: 'Make the result understandable', paragraphs: [third] },
    ],
  })),
]

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
