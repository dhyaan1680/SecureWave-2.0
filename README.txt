
SecureWave — Multi-page demo
---------------------------

What is this:
- A polished multi-page static demo (Home, Features, Floorplan demo, Docs, Contact).
- Includes a Node mock server (mock-server.js) that emits Server-Sent Events at http://localhost:5000/events
  to simulate live sensor updates.

How to run locally:
1) Extract the ZIP and open the folder.
2) Open the HTML files directly (double-click index.html) for basic usage, or use Live Server in VS Code for live reload.
3) To run the mock server (recommended) you'll need Node.js installed:
   - cd into the folder and run:
       npm install
       node mock-server.js
   - Open floorplan.html in your browser and click "Connect Local Mock".
   The mock server will emit periodic sensor updates.

Deploy:
- Push the folder to GitHub and use GitHub Pages to serve (Settings -> Pages).

Files in the ZIP:
- index.html, features.html, floorplan.html, docs.html, contact.html
- css/style.css
- js/app.js, js/floor.js
- assets/logo.png
- mock-server.js, package.json
- README.txt

If you want, I can also convert this to an Electron app template or add a Python mock server instead.
