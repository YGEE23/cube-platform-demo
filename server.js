const express = require('express');
const os = require('os');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse POST request bodies
app.use(express.json());

// Endpoint 1: Health / Diagnostics
app.get('/api/health', (req, res) => {
  res.json({
    uptime_minutes: Math.floor(os.uptime() / 60),
    memory_free_mb: Math.floor(os.freemem() / (1024 * 1024)),
    memory_total_mb: Math.floor(os.totalmem() / (1024 * 1024)),
    platform: os.platform(),
    timestamp: new Date().toISOString()
  });
});

// Endpoint 2: Latency Ping
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', server_time: Date.now() });
});

// Endpoint 3: Mock Analytics Query (Nod to Cube)
app.post('/api/query', (req, res) => {
  const userQuery = req.body.query || 'empty';
  
  // Simulate a slight database processing delay
  setTimeout(() => {
    res.json({
      status: "success",
      message: "Query parsed successfully by AWS EC2 backend",
      executed_query: userQuery,
      mock_results: [
        { dimension: "active_users", count: Math.floor(Math.random() * 5000) },
        { dimension: "revenue_usd", count: Math.floor(Math.random() * 100000) }
      ]
    });
  }, 500);
});

// Frontend UI
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Godslight Nwajiobi | Platform Demo</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f9; color: #333; margin: 0; padding: 40px; display: flex; justify-content: center; }
          .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 650px; }
          h1 { color: #2c3e50; margin-top: 0; }
          .stack { display: flex; gap: 10px; margin-bottom: 30px; font-weight: bold; color: #3498db; flex-wrap: wrap; }
          .stack span { background: #eaf2f8; padding: 6px 12px; border-radius: 4px; font-size: 13px; }
          .card { border: 1px solid #e1e4e8; padding: 20px; border-radius: 6px; margin-bottom: 20px; background: #fafbfc; }
          .card h3 { margin-top: 0; color: #2c3e50; font-size: 18px; }
          .card p { font-size: 14px; color: #555; margin-bottom: 15px; }
          button { padding: 10px 18px; background-color: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.2s; font-size: 13px; }
          button:hover { background-color: #3498db; }
          input[type="text"] { padding: 10px; width: calc(100% - 22px); margin-bottom: 12px; border: 1px solid #ccc; border-radius: 4px; font-family: monospace; font-size: 14px; }
          .output { margin-top: 15px; background: #272822; color: #a6e22e; padding: 15px; border-radius: 4px; display: none; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; font-size: 13px; }
          .loading { color: #d35400; font-style: italic; display: none; margin-top: 10px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Platform Engineering Demo</h1>
          <p>Deployed by <strong>Godslight Micheal Nwajiobi</strong>. This dashboard demonstrates a secure, interactive containerized deployment.</p>
          <div class="stack">
            <span>Docker</span>
            <span>Terraform</span>
            <span>AWS EC2</span>
            <span>GitHub Actions</span>
          </div>
          
          <!-- Tool 1: Diagnostics -->
          <div class="card">
            <h3>1. Server Telemetry</h3>
            <p>Fetch live system resources from the underlying AWS instance.</p>
            <button onclick="fetchDiagnostics()">Get Diagnostics</button>
            <div id="diag-output" class="output"></div>
          </div>

          <!-- Tool 2: Network Latency -->
          <div class="card">
            <h3>2. Network Latency Check</h3>
            <p>Measure round-trip time (RTT) between your browser and the container.</p>
            <button onclick="checkLatency()">Ping Server</button>
            <div id="ping-output" class="output"></div>
          </div>

          <!-- Tool 3: Mock Analytics API -->
          <div class="card">
            <h3>3. Mock Semantic API</h3>
            <p>Type a mock query. This sends a POST request to the backend and returns a JSON dataset.</p>
            <input type="text" id="query-input" value="SELECT * FROM user_events WHERE active = true" />
            <button onclick="runQuery()">Execute Query</button>
            <div id="query-loading" class="loading">Processing query...</div>
            <div id="query-output" class="output"></div>
          </div>
          
        </div>
        
        <script>
          function showOutput(id, text) {
            const el = document.getElementById(id);
            el.style.display = 'block';
            el.innerHTML = text;
          }

          function fetchDiagnostics() {
            fetch('/api/health')
              .then(res => res.json())
              .then(data => {
                showOutput('diag-output', JSON.stringify(data, null, 2));
              })
              .catch(err => showOutput('diag-output', 'ERROR: Connection failed.'));
          }

          function checkLatency() {
            const start = Date.now();
            fetch('/api/ping')
              .then(res => res.json())
              .then(() => {
                const rtt = Date.now() - start;
                showOutput('ping-output', '> Ping successful.\\n> Round-trip time: ' + rtt + 'ms');
              })
              .catch(err => showOutput('ping-output', 'ERROR: Ping failed.'));
          }

          function runQuery() {
            const query = document.getElementById('query-input').value;
            const loading = document.getElementById('query-loading');
            const output = document.getElementById('query-output');
            
            output.style.display = 'none';
            loading.style.display = 'block';
            
            fetch('/api/query', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: query })
            })
            .then(res => res.json())
            .then(data => {
              loading.style.display = 'none';
              showOutput('query-output', JSON.stringify(data, null, 2));
            })
            .catch(err => {
              loading.style.display = 'none';
              showOutput('query-output', 'ERROR: Query failed.');
            });
          }
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log("App running on port " + port);
});