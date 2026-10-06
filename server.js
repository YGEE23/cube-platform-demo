const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Godslight Nwajiobi | Platform Engineer</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; text-align: center; }
          h1 { color: #2c3e50; }
          .stack { display: flex; justify-content: space-around; margin-top: 20px; font-weight: bold; color: #3498db; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hello, Cube Team.</h1>
          <p>This live application was deployed by <strong>Godslight Nwajiobi</strong> to demonstrate production-grade cloud delivery.</p>
          <p>I built the end-to-end infrastructure, including containerization, AWS provisioning via Terraform, and the automated CI/CD release pipeline.</p>
          <div class="stack">
            <span>Docker</span>
            <span>Terraform</span>
            <span>AWS</span>
            <span>GitHub Actions</span>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});