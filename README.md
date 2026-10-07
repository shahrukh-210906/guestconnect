# GuestConnect

A MERN campus guest and event logistics workspace. Includes a guest directory, expertise and availability filters, event assignments, visit history, editable invitation messages, SMTP delivery, three-day follow-up reminders, transport planning, printable logistics, and Excel/PDF reports.

The enhanced workspace adds event editing, role filtering, searchable confirmation filters, per-event preparation checklists, expertise distribution insights, recent outreach history, and an event readiness score. Readiness counts confirmed/attended active guests and arranged/completed required journeys, excluding declined guests. Checklists persist in demo storage or MongoDB live mode.

## Run

Requires Node.js 22+.

```sh
npm install
npm run dev
```

Open http://localhost:5173. Demo data persists in browser localStorage. Demo invitations are drafts and do not send email. Sample guest contact details are fictional.

## Live mode

Copy `.env.example` to `.env`, set a private API key, SMTP credentials, and a MongoDB connection string. MongoDB must support transactions (Atlas or a local replica set). Restart the server, then enter the API key in Settings and connect. The initial sample data is seeded on an empty database. Without MongoDB the API uses temporary memory, which is lost on restart. The health endpoint reports the storage mode.

The access key protects all data and email endpoints. This is a single-coordinator project; institution-wide deployment should add user accounts and role-based permissions. Do not expose an unconfigured server. Keep `.env` out of version control. Reminder jobs run hourly while the server is running, for sent invitations older than three days where the guest remains Invited and the event has not passed. Replies are recorded manually by changing the confirmation dropdown. No email reply parsing is implemented.

## Production

```sh
npm run build
npm start
```

Express serves the frontend and API on port 3001. Configure HTTPS through your hosting provider; supply environment variables and MongoDB Atlas. Use one application instance for the built-in reminder scheduler; a distributed job queue is needed for multiple instances.

## Validation

`npm test` checks assignment integrity, transport requirements, and reminder timing. `npm run build` verifies the frontend production bundle.

## Project design

React/Vite manages six workspace views. Express exposes authenticated workspace, invitation, and reminder routes. Mongoose stores Guest, Event (embedded role/status/transport assignments), and Invitation models. A guest can visit multiple events; visit history is derived from event assignments. Live database updates are transactional.

## PBL review and viva

Problem: scattered communication obscures guest confirmation and transport readiness. Objective: consolidate guest relationships and event preparation. Method: requirement mapping, document models, API implementation, responsive interface, validation and deployment setup. Demo sequence: create guest → create event → assign role → compose invitation → update confirmation → arrange pickup → print logistics → export report. Discuss demo persistence versus MongoDB, transaction requirements, SMTP configuration, scheduled reminders, and future multi-user authentication.

## Connect MongoDB Atlas

1. In Atlas, create a database user and allow your server's IP under Network Access.
2. Open Connect → Drivers and copy the `mongodb+srv://` connection string. Replace the username and password placeholders; URL-encode special characters in credentials. Set the database name to `guestconnect` before the query string.
3. Paste the full string into `MONGODB_URI` in the private `.env` file. Atlas API keys are not database connection strings. Keep this value on the server only.
4. Restart with `npm run dev` (or `npm start` for a production build). `/api/health` should report `"database":"MongoDB"`.
5. In GuestConnect Settings, enter the separate `API_KEY` from `.env` and click **Connect live workspace**.

If a configured MongoDB connection fails, workspace requests return an error instead of saving to temporary memory. An empty database receives sample data; existing browser demo edits are not automatically imported.
