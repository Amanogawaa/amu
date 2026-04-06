export const angularTemplate = {
  files: {
    "/src/app/app.component.ts": `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <div class="app">
      <h1>Hello Angular!</h1>
      <p>Start building your component here.</p>
      
      <div class="info">
        <p>✨ You can use:</p>
        <ul>
          <li>Angular Components & Directives</li>
          <li>Services & Dependency Injection</li>
          <li>RxJS Observables</li>
          <li>Angular Forms</li>
        </ul>
      </div>
    </div>
  \`,
  styles: [\`
    .app {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #2d2d2d;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    
    h1 {
      color: #dd0031;
      margin-top: 0;
    }
    
    .info {
      margin-top: 2rem;
      padding: 1rem;
      background: #1e1e1e;
      border-radius: 4px;
      border-left: 4px solid #dd0031;
    }
    
    ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }
    
    li {
      margin: 0.5rem 0;
    }
  \`]
})
export class AppComponent {
  title = 'Angular Playground';
}`,
    "/src/main.ts": `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((err) => console.error(err));`,
  },
  dependencies: {
    "@angular/core": "^17.0.0",
    "@angular/platform-browser": "^17.0.0",
    "@angular/platform-browser-dynamic": "^17.0.0",
    rxjs: "^7.8.0",
    tslib: "^2.6.0",
    "zone.js": "^0.14.0",
  },
};

/**
 * Angular starter code for exercise lessons
 */
export const angularExerciseStarter = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <div>
      <h1>Exercise</h1>
      <!-- TODO: Complete the exercise -->
    </div>
  \`
})
export class AppComponent {
  // Your code here
}`;
