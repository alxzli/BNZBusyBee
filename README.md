## BNZ BusyBee

BusyBee is a hackathon-oriented Next.js 14 full-stack demo for financial wellness. This starter ships with:

- TypeScript, App Router, and Tailwind CSS
- shadcn-style UI primitives in `src/components/ui`
- Recharts visualizations for dashboard and projections views
- Mock pre-loaded transaction data for demo readiness
- AWS Bedrock-ready API routes with graceful mock fallbacks
- AWS Amplify build configuration for deployment

## Pages

- `/` dashboard overview
- `/transactions` transaction explorer
- `/insights` behavioral insights and recommendations shell
- `/savings-plan` savings goals and nudges
- `/projections` cash-flow projection view
- `/learn` educational content hub

## API Routes

- `/api/transactions`
- `/api/analyze`
- `/api/recommendations`
- `/api/projections`
- `/api/education`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Bedrock Configuration

The app works without AWS credentials by returning seeded mock responses. To enable Bedrock-backed responses later, set:

```bash
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
```

## Deploy to AWS Amplify

This repo includes `amplify.yml` for a basic SSR deployment flow.

1. Connect the repository in Amplify.
2. Add the Bedrock environment variables if you want live model responses.
3. Deploy using the default Amplify build settings from `amplify.yml`.
