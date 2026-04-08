export interface Env {
  FLEET_ONBOARDING: KVNamespace;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  endpoint?: string;
}

interface SetupRequest {
  stepId: number;
  data: {
    fleetName?: string;
    byokKey?: string;
    domainArchetype?: 'standard' | 'enterprise' | 'edge';
    githubToken?: string;
    vesselType?: string;
  };
}

const STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Fleet Configuration",
    description: "Set up your fleet name and basic parameters",
    completed: false,
    endpoint: "/api/setup"
  },
  {
    id: 2,
    title: "BYOK Key Configuration",
    description: "Bring Your Own Key for enhanced security",
    completed: false,
    endpoint: "/api/setup"
  },
  {
    id: 3,
    title: "Domain Archetype Selection",
    description: "Choose your deployment strategy",
    completed: false,
    endpoint: "/api/setup"
  },
  {
    id: 4,
    title: "GitHub Codespaces Integration",
    description: "Connect your development environment",
    completed: false,
    endpoint: "/api/setup"
  },
  {
    id: 5,
    title: "First Vessel Deployment",
    description: "Deploy your initial service",
    completed: false,
    endpoint: "/api/setup"
  }
];

const HTML_TEMPLATE = (content: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fleet Onboarding Wizard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0a0a0f;
      color: #f8fafc;
      min-height: 100vh;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    header {
      border-bottom: 1px solid #1e293b;
      padding-bottom: 2rem;
      margin-bottom: 3rem;
    }
    .hero {
      text-align: center;
      margin-bottom: 3rem;
    }
    .hero h1 {
      font-size: 3rem;
      font-weight: 700;
      background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }
    .hero p {
      font-size: 1.25rem;
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto;
    }
    .wizard {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 3rem;
      background: #111827;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid #1e293b;
    }
    .steps-sidebar {
      border-right: 1px solid #1e293b;
      padding-right: 2rem;
    }
    .step-item {
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
    }
    .step-item:hover {
      background: #1e293b;
    }
    .step-item.active {
      background: #0f172a;
      border-color: #0ea5e9;
    }
    .step-item.completed .step-title {
      color: #0ea5e9;
    }
    .step-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: #f8fafc;
    }
    .step-desc {
      font-size: 0.875rem;
      color: #94a3b8;
    }
    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #1e293b;
      border-radius: 50%;
      margin-right: 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .step-content {
      padding: 1rem 0;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #e2e8f0;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      color: #f8fafc;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #0ea5e9;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      background: #0ea5e9;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
    }
    .btn:hover {
      background: #0284c7;
    }
    .btn:disabled {
      background: #475569;
      cursor: not-allowed;
    }
    .checklist {
      background: #1e293b;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-top: 2rem;
    }
    .checklist-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border-bottom: 1px solid #334155;
    }
    .checklist-item:last-child {
      border-bottom: none;
    }
    .checklist-icon {
      margin-right: 1rem;
      color: #0ea5e9;
    }
    footer {
      margin-top: 4rem;
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #1e293b;
      color: #64748b;
      font-size: 0.875rem;
    }
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #10b981;
      color: white;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: 1rem;
    }
    .error {
      color: #ef4444;
      background: #7f1d1d;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    .success {
      color: #10b981;
      background: #064e3b;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="hero">
        <h1>Fleet Onboarding</h1>
        <p>Interactive setup wizard for new fleet commanders</p>
      </div>
    </header>
    ${content}
    <footer>
      <p>Fleet Command Center &copy; ${new Date().getFullYear()} | Secure Vessel Deployment System</p>
    </footer>
  </div>
  <script>
    let currentStep = 1;
    const steps = ${JSON.stringify(STEPS)};

    function renderStep(stepId) {
      currentStep = stepId;
      const step = steps.find(s => s.id === stepId);
      if (!step) return;

      let formHtml = '';
      switch(stepId) {
        case 1:
          formHtml = \`
            <div class="form-group">
              <label for="fleetName">Fleet Name</label>
              <input type="text" id="fleetName" placeholder="Enter your fleet name" required>
            </div>
            <button class="btn" onclick="completeStep(1)">Save & Continue</button>
          \`;
          break;
        case 2:
          formHtml = \`
            <div class="form-group">
              <label for="byokKey">BYOK Encryption Key</label>
              <textarea id="byokKey" rows="4" placeholder="Paste your encryption key or generate a new one"></textarea>
            </div>
            <button class="btn" onclick="completeStep(2)">Configure Key</button>
          \`;
          break;
        case 3:
          formHtml = \`
            <div class="form-group">
              <label for="domainArchetype">Domain Archetype</label>
              <select id="domainArchetype">
                <option value="standard">Standard (Balanced performance)</option>
                <option value="enterprise">Enterprise (High availability)</option>
                <option value="edge">Edge (Global distribution)</option>
              </select>
            </div>
            <button class="btn" onclick="completeStep(3)">Select Archetype</button>
          \`;
          break;
        case 4:
          formHtml = \`
            <div class="form-group">
              <label for="githubToken">GitHub Personal Access Token</label>
              <input type="password" id="githubToken" placeholder="Enter your GitHub token">
              <small style="color: #94a3b8; display: block; margin-top: 0.5rem;">
                Required for Codespaces integration
              </small>
            </div>
            <button class="btn" onclick="completeStep(4)">Connect GitHub</button>
          \`;
          break;
        case 5:
          formHtml = \`
            <div class="form-group">
              <label for="vesselType">First Vessel Type</label>
              <select id="vesselType">
                <option value="api">API Gateway</option>
                <option value="worker">Cloudflare Worker</option>
                <option value="static">Static Site</option>
                <option value="microservice">Microservice</option>
              </select>
            </div>
            <button class="btn" onclick="completeStep(5)">Deploy Vessel</button>
          \`;
          break;
      }

      document.querySelector('.step-content').innerHTML = \`
        <h2 style="margin-bottom: 1rem; color: #f8fafc;">\${step.title}</h2>
        <p style="margin-bottom: 2rem; color: #94a3b8;">\${step.description}</p>
        \${formHtml}
      \`;

      updateStepNavigation();
    }

    async function completeStep(stepId) {
      const step = steps.find(s => s.id === stepId);
      let data = {};
      
      switch(stepId) {
        case 1:
          data.fleetName = document.getElementById('fleetName').value;
          break;
        case 2:
          data.byokKey = document.getElementById('byokKey').value;
          break;
        case 3:
          data.domainArchetype = document.getElementById('domainArchetype').value;
          break;
        case 4:
          data.githubToken = document.getElementById('githubToken').value;
          break;
        case 5:
          data.vesselType = document.getElementById('vesselType').value;
          break;
      }

      try {
        const response = await fetch('/api/setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stepId: stepId,
            data: data
          })
        });

        if (response.ok) {
          step.completed = true;
          if (stepId < 5) {
            renderStep(stepId + 1);
          } else {
            document.querySelector('.step-content').innerHTML = \`
              <div class="success">
                <h3>🎉 Onboarding Complete!</h3>
                <p>Your fleet is now ready for deployment. Check the checklist for next steps.</p>
              </div>
            \`;
          }
          updateStepNavigation();
        } else {
          throw new Error('Step completion failed');
        }
      } catch (error) {
        document.querySelector('.step-content').innerHTML += \`
          <div class="error" style="margin-top: 1rem;">
            Failed to complete step: \${error.message}
          </div>
        \`;
      }
    }

    function updateStepNavigation() {
      const sidebar = document.querySelector('.steps-sidebar');
      sidebar.innerHTML = steps.map(step => \`
        <div class="step-item \${step.id === currentStep ? 'active' : ''} \${step.completed ? 'completed' : ''}" 
             onclick="renderStep(\${step.id})">
          <div>
            <span class="step-number">\${step.id}</span>
            <span class="step-title">\${step.title}</span>
            \${step.completed ? '<span class="status-badge">✓</span>' : ''}
          </div>
          <div class="step-desc">\${step.description}</div>
        </div>
      \`).join('');
    }

    document.addEventListener('DOMContentLoaded', () => {
      renderStep(1);
      updateStepNavigation();
    });
  </script>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const headers = new Headers({
      'Content-Type': 'text/html; charset=utf-8',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self'",
    });

    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/steps') {
      return new Response(JSON.stringify(STEPS), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/setup' && request.method === 'POST') {
      try {
        const body: SetupRequest = await request.json();
        
        if (body.stepId < 1 || body.stepId > STEPS.length) {
          return new Response(JSON.stringify({ error: 'Invalid step ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        await env.FLEET_ONBOARDING.put(`step_${body.stepId}`, JSON.stringify({
          data: body.data,
          completedAt: new Date().toISOString()
        }));

        return new Response(JSON.stringify({ 
          success: true, 
          stepId: body.stepId,
          nextStep: body.stepId < STEPS.length ? body.stepId + 1 : null
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (path === '/api/checklist') {
      try {
        const checklist = [];
        
        for (let i = 1; i <= STEPS.length; i++) {
          const stepData = await env.FLEET_ONBOARDING.get(`step_${i}`);
          if (stepData) {
            const data = JSON.parse(stepData);
            checklist.push({
              stepId: i,
              title: STEPS[i-1].title,
              completed: true,
              completedAt: data.completedAt
            });
          } else {
            checklist.push({
              stepId: i,
              title: STEPS[i-1].title,
              completed: false
            });
          }
        }

        return new Response(JSON.stringify(checklist), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch checklist' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (path === '/' || path === '/onboarding') {
      const wizardContent = `
        <div class="wizard">
          <div class="steps-sidebar">
            <!-- Steps will be populated by JavaScript -->
          </div>
          <div class="step-content">
            <!-- Step content will be populated by JavaScript -->
          </div>
        </div>
        <div class="checklist">
          <h3 style="margin-bottom: 1rem; color: #f8fafc;">Onboarding Checklist</h3>
          <div id="checklist-items">
            <!-- Checklist items will be populated by JavaScript -->
          </div>
        </div>
        <script>
          async function loadChecklist() {
            try {
              const response = await fetch('/api/checklist');
              const checklist = await response.json();
              const container = document.getElementById('checklist-items');
              container.innerHTML = checklist.map(item => \`
                <div class="checklist-item">
                  <span class="checklist-icon">\${item.completed ? '✓' : '○'}</span>
                  <span>\${item.title}</span>
                  \${item.completed ? '<span style="margin-left: auto; color: #94a3b8; font-size: 0.875rem;">Completed</span>' : ''}
                </div>
              \`).join('');
            } catch (error) {
              console.error('Failed to load checklist:', error);
            }
          }
          loadChecklist();
          setInterval(loadChecklist, 10000);
        </script>
      `;

      return new Response(HTML_TEMPLATE(wizardContent), { headers });
    }

    return new Response(HTML_TEMPLATE(`
      <div style="text-align: center; padding: 4rem 0;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #f8fafc;">404 - Fleet Not Found</h1>
        <p style="color: #94a3b8; margin-bottom: 2rem;">The requested command deck does not exist.</p>
        <a href="/" class="btn">Return to Onboarding</a>
      </div>
    `), { status: 404, headers });
  }
};