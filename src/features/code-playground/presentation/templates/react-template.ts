export const reactTemplate = {
  files: {
    "/App.jsx": `export default function App() {
  return (
    <div className="app">
      <h1>Hello React!</h1>
      <p>Start building your component here.</p>
      
      <div className="info">
        <p>✨ You can use:</p>
        <ul>
          <li>React Hooks (useState, useEffect, etc.)</li>
          <li>JSX syntax</li>
          <li>External packages (install via dependencies)</li>
        </ul>
      </div>
    </div>
  );
}`,
    "/styles.css": `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  padding: 20px;
  background: #1e1e1e;
  color: #e0e0e0;
  margin: 0;
}

.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #2d2d2d;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

h1 {
  color: #61dafb;
  margin-top: 0;
}

.info {
  margin-top: 2rem;
  padding: 1rem;
  background: #1e1e1e;
  border-radius: 4px;
  border-left: 4px solid #61dafb;
}

ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

li {
  margin: 0.5rem 0;
}`,
  },
  dependencies: {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
  },
};

/**
 * React starter code for exercise lessons
 */
export const reactExerciseStarter = `export default function App() {
  // TODO: Complete the exercise
  
  return (
    <div>
      <h1>Exercise</h1>
    </div>
  );
}`;
