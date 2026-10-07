# Deploy GuestConnect on Render

The root `render.yaml` deploys React and Express together. Build: `npm ci --include=dev && npm run build`. Start: `npm start`. Health check: `/api/health`. Render supplies PORT; Express binds to 0.0.0.0.

1. Push this project to a GitHub repository.
2. In Render, create a Blueprint and select that repository.
3. Review the free guestconnect web service and deploy it.
4. Once live, open its onrender.com URL.

The application opens in browser-persistent demo mode. To enable durable shared data, add MONGODB_URI pointing to MongoDB Atlas, then redeploy. Atlas must permit connections from the Render service. Read API_KEY from Render's environment settings and enter it in GuestConnect Settings. Do not commit or share this key.

Email delivery needs SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM. Check Render's plan-specific outbound SMTP restrictions before choosing an email provider. Demo invitations do not send email. The built-in reminder timer only runs while the application instance is awake; use a scheduled job or an always-on plan for reliable reminders.

Without MongoDB, live API data uses temporary process memory and is lost on restart. The free service configuration is intended for a project demo. Production multi-user access requires individual authentication and authorization instead of a shared coordinator key.

Official documentation: https://render.com/docs/deploy-node-express-app and https://render.com/docs/blueprint-spec.
