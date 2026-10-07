# Guest Connect → NeuroLog

The Express backend now sends sanitized operational events to https://neurolog-ai.onrender.com under source `guest-connect`.

Configured in ignored `.env`: NEUROLOG_ENDPOINT and NEUROLOG_INGEST_KEY. Never put the ingestion key in frontend code or Git. Operational logs include request method, fixed route, HTTP status, measured duration and generated request ID; startup/heartbeat, MongoDB connection outcomes, generic operation failures and scheduled reminder failures. Names, contact details, invitation bodies, query strings, headers, request bodies and raw exception messages are excluded.

The sender writes an ignored disk outbox before delivery, retries with backoff up to 30 seconds, and allows 10,000 pending logs. A delivery timeout does not block the HTTP response. Restarting the backend resumes queued delivery. Delivery is at least once, so a lost acknowledgment may produce a duplicate.

Run `npm start` to serve the built app and API at http://127.0.0.1:3001. In Guest Connect Settings, enable live mode using the existing Guest Connect API_KEY from `.env`. This API_KEY is different from NEUROLOG_INGEST_KEY. Browser-only demo edits never reach the backend and therefore are not monitored. Switching to live mode is needed to monitor guest/event operations. Email is sent only if SMTP is configured and you explicitly invoke its workflows.

Inspect https://neurolog-ai.onrender.com/explorer?q=guest-connect or ask the assistant with `source:guest-connect`. The current shared NeuroLog deployment has ephemeral keys: after a NeuroLog redeploy, create a new key in Connect applications and replace NEUROLOG_INGEST_KEY in `.env`, then restart Guest Connect. Old queued events remain pending until a valid key is configured. Use development data only in the shared hosted workspace.

Verification: npm test (seven tests including redaction and restart/retry); npm run build; backend health response and hosted source receipt verified.


## Detailed activity logging
Both browser demo mode and live mode now report navigation, application visibility, button actions, field edits (without values), debounced searches, filters, selected-event changes, dialog open/close, form submissions, invalid fields, save attempts/results, guest/event creation and updates, assignment/transport/checklist changes, invitation creation, report export attempts/results, print requests/completion, request failures, and browser runtime/rejection categories. An action log is not proof that a save or export completed; separate outcome events record completion. Print completion indicates the print dialog closed, not that a physical page printed.

Browser events use a short-lived activity session and same-origin backend endpoint. No NeuroLog key is exposed to the browser. The server validates event/page/target enums, drops extra fields, rejects unknown events/origins and limits batches to 40 events and 240 events/minute per session. The browser keeps up to 500 unsent sanitized events in memory and retries every two seconds; closing the tab can lose pending browser events. Accepted events enter the backend's durable outbox. Mouse movement, raw keystrokes, text values, guest names/IDs/contact details, email contents, exception stacks and credentials are deliberately excluded. Interaction categories may repeat; they describe activity, not unique users. Refresh the built app to activate these changes.
