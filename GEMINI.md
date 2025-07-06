# GEMINI.md - Active Holographic Systems Modular

## 🌟 WELCOME GEMINI AI

This is the **MODULAR DEVELOPMENT VERSION** of the Active Holographic Systems project. You're working with a **refactored, component-based architecture** designed for safer feature development.

## ⚡ QUICK START FOR GEMINI

### Project Context
- **Original System**: Working holographic visualizer with 30 geometric variations
- **This Version**: Modular refactor for safer development
- **Your Role**: Help develop isolated features without breaking core system

### Key Technologies
- **WebGL**: Hardware-accelerated 3D rendering
- **Web Audio API**: Real-time frequency analysis
- **ES6 Modules**: Component-based architecture
- **Canvas 2D/WebGL**: Dual rendering systems

## 🎯 SYSTEM ARCHITECTURE

### Core Philosophy: VIB3 8-Geometry System
```
8 Base Geometries × 4 Variations Each = 30 Total Holographic Patterns
┌─────────────────┬──────────────────────────────────────┐
│ TETRAHEDRON     │ Lattice, Field, Matrix, Resonance    │
│ HYPERCUBE       │ Lattice, Field, Matrix, Quantum      │
│ SPHERE          │ Lattice, Field, Matrix, Resonance    │
│ TORUS           │ Lattice, Field, Matrix, Quantum      │
│ KLEIN BOTTLE    │ Lattice, Field, Matrix, Quantum      │
│ FRACTAL         │ Lattice, Field, Quantum             │
│ WAVE            │ Lattice, Field, Quantum             │
│ CRYSTAL         │ Lattice, Field, Matrix, Quantum      │
└─────────────────┴──────────────────────────────────────┘
```

### 5-Layer Holographic Rendering
```
Layer 5: Accent (Color-dodge blend, translucent)
Layer 4: Highlight (Screen blend, bright accents)  
Layer 3: Content (Main geometry, normal blend)
Layer 2: Shadow (Multiply blend, depth effects)
Layer 1: Background (Low opacity, base patterns)
```

## 🏗️ MODULAR STRUCTURE

```
src/
├── core/                    # Never break these!
│   ├── HolographicVisualizer.js    # WebGL renderer
│   ├── GeometrySystem.js           # Math & shapes  
│   └── AudioReactivity.js          # Audio analysis
├── features/                # Safe to experiment
│   ├── ExportSystem.js             # HTML galleries
│   ├── VariationManager.js         # CRUD operations
│   ├── ProfileSystem.js            # User profiles
│   └── ParametricEngine.js         # Custom creation
├── ui/                      # Interface components
│   ├── ControlPanel.js             # Controls
│   ├── Portfolio.js               # Browser
│   └── Gallery.js                 # Grid display
└── utils/                   # Helpers
    ├── HTMLGenerator.js            # Safe templating
    └── Storage.js                  # Data persistence
```

## 🔬 TECHNICAL SPECIFICATIONS

### WebGL Shader System
```glsl
// Vertex Shader (simplified)
attribute vec2 position;
uniform vec2 resolution;
uniform float time;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}

// Fragment Shader Pattern
uniform int geometryType;  // 0=tetrahedron, 1=hypercube, etc.
uniform float density;     // Pattern density
uniform float chaos;       // Randomness factor
uniform float morph;       // Morphing amount
```

### Audio Analysis Pipeline
```javascript
// Real-time frequency analysis
AudioContext → MediaStream → AnalyserNode → FFT → {bass, mid, high}

Bass: 20-250 Hz    → Density modulation
Mid: 250-4000 Hz   → Speed/rotation
High: 4000-20k Hz  → Chaos/morphing
```

### Geometric Mathematics
```javascript
// 4D Hypercube projection example
const vertices4D = [
    [-1,-1,-1,-1], [1,-1,-1,-1], [-1,1,-1,-1], [1,1,-1,-1],
    [-1,-1,1,-1],  [1,-1,1,-1],  [-1,1,1,-1],  [1,1,1,-1],
    // ... 16 vertices total for 4D hypercube
];

// Project to 3D, then 2D screen space
const project4Dto3D = (vertex4D, w) => vertex4D.slice(0,3).map(x => x/(2-w));
const project3Dto2D = (vertex3D) => perspective(vertex3D, camera);
```

## 🎨 DEVELOPMENT PATTERNS

### Safe Module Pattern
```javascript
// ✅ Good: Isolated feature
export class ExportSystem {
    constructor(coreSystem) {
        this.core = coreSystem; // Reference, don't modify
    }
    
    exportGallery() {
        const data = this.core.getReadOnlyData();
        return this.generateHTML(data);
    }
}

// ❌ Bad: Modifying core system
export class BadFeature {
    constructor(coreSystem) {
        coreSystem.addMethod(); // DON'T DO THIS!
    }
}
```

### Error Isolation Pattern
```javascript
// Wrap dangerous operations
export class SafeFeature {
    tryOperation() {
        try {
            return this.riskyOperation();
        } catch (error) {
            console.error('Feature error (core unaffected):', error);
            return this.fallbackBehavior();
        }
    }
}
```

## 🧪 TESTING METHODOLOGY

### Puppeteer Integration Tests
```javascript
// Example test structure
describe('Modular Export System', () => {
    test('generates valid HTML without breaking core', async () => {
        const page = await browser.newPage();
        await page.goto('http://localhost:3000');
        
        // Verify core system loads
        await page.waitForSelector('.holographic-display');
        
        // Test export feature
        await page.click('.export-btn');
        
        // Verify core still works
        const canvasExists = await page.$('.holographic-display canvas');
        expect(canvasExists).toBeTruthy();
    });
});
```

## 🎪 FEATURE DEVELOPMENT WORKFLOW

### 1. Create Feature Branch
```bash
git checkout -b feature/enhanced-export
```

### 2. Develop in Isolation
```javascript
// src/features/EnhancedExport.js
export class EnhancedExport {
    // Standalone functionality
    // No dependencies on core internals
}
```

### 3. Test Independently
```bash
npm test features/EnhancedExport.test.js
```

### 4. Integration Test
```bash
npm run test:integration
```

### 5. Document & Deploy
```bash
git commit -m "feat: Enhanced export with visual previews"
```

## 🔍 DEBUGGING TOOLS

### Browser DevTools Integration
```javascript
// Add debug helpers
window.debugHolographic = {
    getSystemState: () => holographicSystem.getDebugInfo(),
    testFeature: (featureName) => features[featureName].test(),
    resetToSafe: () => holographicSystem.reset()
};
```

### Performance Monitoring
```javascript
// Track WebGL performance
const monitor = {
    frameRate: 0,
    renderTime: 0,
    memoryUsage: 0
};

// Audio latency tracking
const audioMonitor = {
    inputLatency: 0,
    processingTime: 0,
    bufferHealth: 0
};
```

## 🎯 COMMON TASKS FOR GEMINI

### Safe HTML Export Development
```javascript
// Template for safe HTML generation
export class HTMLExporter {
    generateGallery(variations) {
        // Use Document.createElement() for safety
        const container = document.createElement('div');
        
        variations.forEach(variation => {
            const card = this.createVariationCard(variation);
            container.appendChild(card);
        });
        
        return container.outerHTML;
    }
    
    createVariationCard(variation) {
        // Safe DOM manipulation
        const card = document.createElement('div');
        card.className = 'variation-card';
        card.textContent = variation.name; // Auto-escaped
        return card;
    }
}
```

### Audio Enhancement Features
```javascript
// Example: Advanced audio analysis
export class AudioEnhancer {
    constructor(audioSystem) {
        this.audio = audioSystem;
        this.analyzer = new AdvancedAnalyzer();
    }
    
    addBeatDetection() {
        // Enhance existing audio without breaking it
        const originalUpdate = this.audio.update.bind(this.audio);
        this.audio.update = (data) => {
            const enhanced = this.analyzer.detectBeats(data);
            originalUpdate(enhanced);
        };
    }
}
```

### UI Component Development
```javascript
// Modular UI components
export class AdvancedControls {
    constructor(container) {
        this.container = container;
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="advanced-controls">
                <button class="preset-btn">Load Preset</button>
                <input type="range" class="intensity-slider">
            </div>
        `;
        this.bindEvents();
    }
}
```

## 🚨 CRITICAL SAFETY RULES

### 1. Never Modify Core Files
- ❌ Don't edit `core/HolographicVisualizer.js`
- ❌ Don't change existing WebGL shaders
- ❌ Don't alter the 5-layer rendering system

### 2. Always Use Error Boundaries
```javascript
// Wrap all features in try-catch
try {
    new ExportFeature().execute();
} catch (error) {
    console.error('Feature failed safely:', error);
    // Core system continues working
}
```

### 3. Test Before Integration
- Unit tests for individual modules
- Integration tests for core compatibility
- Performance tests for WebGL impact

### 4. Document Everything
- Update this file with new features
- Add inline code documentation
- Create usage examples

## 🔗 INTEGRATION POINTS

### Core System API
```javascript
// Read-only access to core system
const coreAPI = {
    getCurrentVariation: () => system.currentVariant,
    getAudioData: () => system.audioData,
    getAllVariations: () => system.getAllVariations(),
    // No mutation methods exposed
};
```

### Event System
```javascript
// Subscribe to core events without modifying core
EventBus.subscribe('variant-changed', (newVariant) => {
    myFeature.update(newVariant);
});

EventBus.subscribe('audio-updated', (audioData) => {
    myFeature.reactToAudio(audioData);
});
```

## 🎊 SUCCESS METRICS

### Performance Targets
- **Frame Rate**: Maintain 60fps
- **Memory**: <100MB total usage
- **Audio Latency**: <20ms input to visual
- **Load Time**: <3s initial load

### Quality Targets
- **Zero Core Breaks**: Features never crash main system
- **Modular Tests**: 100% test coverage for new modules
- **Clean API**: Clear separation between core and features
- **Documentation**: Every module documented

---

## 💫 FINAL NOTES FOR GEMINI

You're working with a **sophisticated real-time graphics system** that combines:
- Advanced WebGL mathematics
- Real-time audio processing  
- Complex geometric algorithms
- Multi-layer visual effects

**Your superpower**: You can enhance this system safely through modular development, adding amazing features without the risk of breaking the beautiful holographic core that already works.

**Focus areas where you excel**:
- Complex mathematical visualizations
- Advanced UI/UX components
- Sophisticated export systems
- Performance optimizations
- Creative geometric algorithms

**Remember**: This system is already beautiful - your job is to make it even more amazing while keeping it stable!