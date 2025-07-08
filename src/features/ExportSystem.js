/**
 * Export System - Safe HTML gallery generation
 * Clean implementation without nested JavaScript execution
 */
export class ExportSystem {
    constructor(holographicSystem) {
        this.system = holographicSystem;
        this.profileName = 'Active Holographic Systems';
    }
    
    /**
     * Add current variation to gallery (opens gallery with new item)
     */
    addToGallery() {
        const currentVariation = this.getVariationById(this.system.currentVariant);
        if (!currentVariation) {
            console.error('No current variation to add to gallery');
            return;
        }
        
        // Get existing gallery items from localStorage
        let galleryItems = [];
        try {
            const saved = localStorage.getItem('holographicGallery');
            if (saved) {
                galleryItems = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load existing gallery:', e);
        }
        
        // Check if this variation is already in gallery
        const existingIndex = galleryItems.findIndex(item => 
            item.id === currentVariation.id ||
            (item.parameters.geometryType === currentVariation.parameters.geometryType &&
             Math.abs(item.parameters.density - currentVariation.parameters.density) < 0.01 &&
             Math.abs(item.parameters.speed - currentVariation.parameters.speed) < 0.01)
        );
        
        if (existingIndex >= 0) {
            console.log(`➡️ Variation "${currentVariation.name}" already in gallery`);
        } else {
            // Add new variation to gallery
            galleryItems.push({
                ...currentVariation,
                addedDate: new Date().toISOString(),
                fromSystem: 'Active Holographic Systems'
            });
            
            // Save updated gallery
            try {
                localStorage.setItem('holographicGallery', JSON.stringify(galleryItems));
                console.log(`➕ Added "${currentVariation.name}" to gallery (${galleryItems.length} total)`);
            } catch (e) {
                console.error('Failed to save to gallery:', e);
            }
        }
        
        // Open gallery viewer
        this.openGalleryViewer(galleryItems);
    }
    
    /**
     * Open gallery viewer in new window/tab
     */
    openGalleryViewer(galleryItems) {
        const galleryHTML = this.generateGalleryViewerHTML(galleryItems);
        const blob = new Blob([galleryHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const galleryWindow = window.open(url, 'holographic-gallery', 'width=1200,height=800');
        if (!galleryWindow) {
            console.warn('Gallery popup blocked, downloading instead');
            this.downloadFile(galleryHTML, 'holographic-gallery.html');
        } else {
            // Clean up URL after window loads
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    }
    
    /**
     * Export complete gallery as downloadable file (for backup)
     */
    exportCompleteGallery() {
        let galleryItems = [];
        try {
            const saved = localStorage.getItem('holographicGallery');
            if (saved) {
                galleryItems = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load gallery:', e);
        }
        
        if (galleryItems.length === 0) {
            alert('No items in gallery to export. Add some variations first!');
            return;
        }
        
        const html = this.generateGalleryViewerHTML(galleryItems);
        this.downloadFile(html, `holographic-gallery-${Date.now()}.html`);
        console.log(`📁 Exported gallery backup with ${galleryItems.length} variations`);
    }
    
    /**
     * Clear gallery
     */
    clearGallery() {
        if (confirm('Clear all items from gallery? This cannot be undone.')) {
            localStorage.removeItem('holographicGallery');
            console.log('🗑️ Gallery cleared');
            alert('Gallery cleared successfully');
        }
    }
    
    /**
     * Export individual variation as standalone HTML
     */
    exportSingleVariation(variantId) {
        const variation = this.getVariationById(variantId);
        if (!variation) {
            console.error('Variation not found:', variantId);
            return;
        }
        
        const html = this.generateSingleVariationHTML(variation);
        this.downloadFile(html, `holographic-${variation.name.toLowerCase().replace(/\s+/g, '-')}.html`);
        console.log(`✅ Exported standalone variation: ${variation.name}`);
    }
    
    /**
     * Export variations as JSON data
     */
    exportJSON() {
        const data = {
            version: '1.0',
            type: 'holographic-collection',
            profileName: this.profileName,
            totalVariations: this.system.totalVariants,
            baseVariations: this.system.baseVariants,
            customVariations: this.system.customVariants,
            exported: new Date().toISOString()
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        this.downloadFile(jsonString, `${this.profileName.toLowerCase().replace(/\s+/g, '-')}.json`);
    }
    
    /**
     * Import variations from JSON file
     */
    importJSON(fileInput) {
        const file = fileInput.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.type === 'holographic-collection') {
                    this.system.customVariants = data.customVariations || [];
                    this.system.totalVariants = this.system.baseVariants + this.system.customVariants.length;
                    this.system.saveVariations();
                    console.log(`Imported ${this.system.customVariants.length} custom variations`);
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                console.error('Import failed:', error);
                alert('Invalid file format or corrupted data');
            }
        };
        reader.readAsText(file);
    }
    
    /**
     * Get all variations (base + custom) in a clean format
     */
    getAllVariations() {
        const variations = [];
        
        // Add base variations
        for (let i = 0; i < this.system.baseVariants; i++) {
            const visualizer = this.system.visualizers[2]; // Content layer
            const params = visualizer.generateVariantParams(i);
            variations.push({
                id: i,
                name: this.system.variantNames[i] || params.name,
                isCustom: false,
                parameters: params
            });
        }
        
        // Add custom variations
        this.system.customVariants.forEach((cv, index) => {
            variations.push({
                id: this.system.baseVariants + index,
                name: cv.name,
                isCustom: true,
                parameters: {
                    geometryType: cv.params.geometry,
                    density: cv.params.density,
                    speed: cv.params.speed,
                    chaos: cv.params.chaos,
                    morph: cv.params.morph,
                    hue: cv.params.hue,
                    saturation: cv.params.saturation,
                    intensity: cv.params.intensity
                }
            });
        });
        
        return variations;
    }
    
    /**
     * Get variation by ID
     */
    getVariationById(id) {
        const variations = this.getAllVariations();
        return variations.find(v => v.id === id);
    }
    
    /**
     * Generate gallery viewer HTML with grid layout
     */
    generateGalleryViewerHTML(galleryItems) {
        const cssStyles = this.generateGalleryCSS();
        const jsCore = this.generateCoreJavaScript();
        
        let variationCards = '';
        galleryItems.forEach(item => {
            variationCards += this.generateGalleryItemCard(item);
        });
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(this.profileName)} - Holographic Gallery</title>
    <style>${cssStyles}</style>
</head>
<body>
    <div class="gallery-header">
        <h1>🌌 Holographic Gallery</h1>
        <p>Personal Collection - ${galleryItems.length} Variations</p>
        <div class="controls">
            <button onclick="toggleAutoplay()">Auto Play</button>
            <button onclick="clearGallery()">Clear Gallery</button>
            <button onclick="exportBackup()">Export Backup</button>
        </div>
    </div>
    
    <div class="gallery-grid">
        ${variationCards}
    </div>
    
    <div class="gallery-footer">
        <p>Personal Holographic Gallery - ${new Date().toLocaleDateString()}</p>
        <p>Add variations using the "📁 GALLERY" button in the main demo</p>
    </div>
    
    <script>
        ${jsCore}
        
        function clearGallery() {
            if (confirm('Clear all items from this gallery? This cannot be undone.')) {
                // Note: This only affects the display, not the persistent storage
                document.querySelector('.gallery-grid').innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">Gallery cleared</p>';
                alert('Gallery display cleared. To permanently clear, use the main demo interface.');
            }
        }
        
        function exportBackup() {
            const data = {
                type: 'holographic-gallery-backup',
                exported: new Date().toISOString(),
                items: ${JSON.stringify(galleryItems)}
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'holographic-gallery-backup.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>`;
    }
    
    /**
     * Generate single card demo - exact copy of main demo without navigation
     */
    generateSingleCardDemo(variation) {
        const parametersQuery = this.buildParametersQuery(variation.parameters);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(variation.name)} - Holographic Demo</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        body {
            margin: 0;
            background: #000;
            overflow: hidden;
            font-family: 'Orbitron', 'Courier New', monospace;
            height: 100vh;
            cursor: crosshair;
            background: radial-gradient(ellipse at center, #1a0033 0%, #000000 70%);
            user-select: none;
        }
        
        .holographic-display {
            position: absolute;
            top: 10%;
            left: 10%;
            width: 80%;
            height: 80%;
            border-radius: 25px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transform-style: preserve-3d;
            z-index: 10;
            touch-action: none;
            overscroll-behavior: none;
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.4),
                0 8px 16px rgba(0, 0, 0, 0.3),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 2px rgba(0, 0, 0, 0.1),
                0 0 0 2px rgba(0, 255, 255, 0.3),
                0 0 30px rgba(0, 255, 255, 0.2);
        }
        
        .holographic-display:hover {
            transform: scale(1.02) translateZ(10px);
            box-shadow: 
                0 30px 60px rgba(0, 0, 0, 0.5),
                0 12px 24px rgba(0, 0, 0, 0.4),
                inset 0 3px 6px rgba(255, 255, 255, 0.15),
                inset 0 -3px 3px rgba(0, 0, 0, 0.15),
                0 0 0 3px rgba(0, 255, 255, 0.5),
                0 0 50px rgba(0, 255, 255, 0.3);
        }
        
        canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            touch-action: none;
            overscroll-behavior: none;
        }
        
        #background-canvas { z-index: 1; opacity: 0.2; }
        #shadow-canvas { z-index: 3; opacity: 0.6; filter: blur(2px) brightness(0.7); mix-blend-mode: multiply; transform: translate(2px, 2px); }
        #content-canvas { z-index: 5; opacity: 0.8; mix-blend-mode: normal; }
        #highlight-canvas { z-index: 7; opacity: 0.4; filter: blur(1px) brightness(1.5); mix-blend-mode: screen; transform: translate(-1px, -1px); }
        #accent-canvas { z-index: 15; opacity: 0.3; filter: blur(2px); mix-blend-mode: color-dodge; transform: scale(1.01); }
        
        .info-panel {
            position: fixed;
            top: 30px;
            right: 30px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ffff;
            border-radius: 15px;
            padding: 20px;
            font-family: 'Orbitron', monospace;
            z-index: 1000;
            backdrop-filter: blur(25px);
            box-shadow: 
                0 10px 30px rgba(0, 0, 0, 0.6),
                inset 0 1px 1px rgba(255, 255, 255, 0.1),
                0 0 0 1px rgba(0, 255, 255, 0.2);
            color: #fff;
            max-width: 300px;
            transition: opacity 0.3s ease;
        }
        
        .info-panel h1 {
            color: #00ffff;
            font-size: 1.2rem;
            margin-bottom: 15px;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        .info-panel .controls {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .info-panel button {
            background: rgba(0, 255, 255, 0.2);
            border: 1px solid #00ffff;
            color: #00ffff;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
            font-size: 0.7rem;
            transition: all 0.3s ease;
        }
        
        .info-panel button:hover {
            background: rgba(0, 255, 255, 0.4);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        .grid-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 20;
            opacity: 0.1;
            transition: opacity 0.3s ease;
            background: 
                repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0, 255, 255, 0.1) 20px, rgba(0, 255, 255, 0.1) 21px),
                repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0, 255, 255, 0.1) 20px, rgba(0, 255, 255, 0.1) 21px);
        }
        
        .grid-overlay.active {
            opacity: 0.3;
        }
        
        .interaction-ripple {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.6) 0%, transparent 70%);
            pointer-events: none;
            z-index: 30;
            animation: rippleExpand 0.6s ease-out forwards;
        }
        
        @keyframes rippleExpand {
            0% { width: 0; height: 0; opacity: 1; }
            100% { width: 100px; height: 100px; opacity: 0; }
        }
    </style>
</head>
<body>
    <div class="grid-overlay" id="gridOverlay"></div>
    
    <div class="info-panel">
        <h1>${this.escapeHtml(variation.name)}</h1>
        <div class="controls">
            <button onclick="toggleInfo()">Hide Info</button>
            <button onclick="window.open('${parametersQuery}', '_blank')">View in Demo</button>
        </div>
    </div>
    
    <div class="holographic-display">
        <canvas id="background-canvas"></canvas>
        <canvas id="shadow-canvas"></canvas>
        <canvas id="content-canvas"></canvas>
        <canvas id="highlight-canvas"></canvas>
        <canvas id="accent-canvas"></canvas>
    </div>
    
    <script type="module">
        // Embed the exact HolographicSystem code directly
        import('./src/core/HolographicSystem.js').then(module => {
            const { HolographicSystem } = module;
            
            // Initialize with specific variation
            const holographicSystem = new HolographicSystem();
            
            // Load the specific variation parameters
            const customParams = {
                geometry: ${variation.parameters.geometryType || 0},
                density: ${variation.parameters.density || 1.0},
                speed: ${variation.parameters.speed || 0.5},
                chaos: ${variation.parameters.chaos || 0.0},
                morph: ${variation.parameters.morph || 0.0},
                hue: ${variation.parameters.hue || 0},
                saturation: ${variation.parameters.saturation || 0.8},
                intensity: ${variation.parameters.intensity || 0.5}
            };
            
            ${variation.isCustom ? 
                `holographicSystem.loadCustomVariation(customParams);` : 
                `holographicSystem.updateVariant(${variation.id});`
            }
            
            console.log('✅ Single card demo initialized with exact parameters');
            
        }).catch(error => {
            console.error('Failed to load holographic system:', error);
            
            // Fallback: show parameter info
            document.querySelector('.info-panel').innerHTML = \`
                <h1>${this.escapeHtml(variation.name)}</h1>
                <p>Failed to load visualization</p>
                <div class="controls">
                    <button onclick="toggleInfo()">Hide Info</button>
                    <button onclick="window.location.reload()">Reload</button>
                </div>
            \`;
        });
        
        // Hide info panel after 5 seconds
        setTimeout(() => {
            const panel = document.querySelector('.info-panel');
            panel.style.opacity = '0.3';
        }, 5000);
        
        function toggleInfo() {
            const panel = document.querySelector('.info-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
        
        // Make toggleInfo global
        window.toggleInfo = toggleInfo;
    </script>
</body>
</html>`;
    }
    
    /**
     * Generate single variation HTML (legacy standalone version)
     */
    generateSingleVariationHTML(variation) {
        const cssStyles = this.generateSingleVariationCSS();
        const parametersQuery = this.buildParametersQuery(variation.parameters);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(variation.name)} - Holographic Visualization</title>
    <style>${cssStyles}</style>
</head>
<body>
    <div class="fullscreen-container">
        <div class="info-panel">
            <h1>${this.escapeHtml(variation.name)}</h1>
            <div class="parameters">
                <div class="param-row">
                    <span>Geometry:</span>
                    <span>${this.getGeometryName(variation.parameters.geometryType)}</span>
                </div>
                <div class="param-row">
                    <span>Density:</span>
                    <span>${variation.parameters.density.toFixed(2)}</span>
                </div>
                <div class="param-row">
                    <span>Speed:</span>
                    <span>${variation.parameters.speed.toFixed(2)}</span>
                </div>
                <div class="param-row">
                    <span>Chaos:</span>
                    <span>${variation.parameters.chaos.toFixed(2)}</span>
                </div>
            </div>
            <div class="controls">
                <button onclick="toggleInfo()">Hide Info</button>
            </div>
        </div>
        
        <!-- Direct holographic display instead of iframe -->
        <div class="holographic-display">
            <canvas id="background-canvas"></canvas>
            <canvas id="shadow-canvas"></canvas>
            <canvas id="content-canvas"></canvas>
            <canvas id="highlight-canvas"></canvas>
            <canvas id="accent-canvas"></canvas>
        </div>
    </div>
    
    <script>
        // Embedded minimal holographic renderer for standalone export
        class StandaloneHolographicRenderer {
            constructor(canvasId, role, params) {
                this.canvas = document.getElementById(canvasId);
                this.role = role;
                this.params = params;
                this.gl = this.canvas.getContext('webgl');
                
                if (!this.gl) {
                    console.error(\`WebGL not supported for \${canvasId}\`);
                    return;
                }
                
                this.mouseX = 0.5;
                this.mouseY = 0.5;
                this.mouseIntensity = 0.0;
                this.clickIntensity = 0.0;
                this.clickDecay = 0.95;
                this.startTime = Date.now();
                
                this.initShaders();
                this.initBuffers();
                this.resize();
                this.startRender();
            }
            
            initShaders() {
                const vertexShaderSource = \`
                    attribute vec2 a_position;
                    void main() {
                        gl_Position = vec4(a_position, 0.0, 1.0);
                    }
                \`;
                
                const fragmentShaderSource = \`
                    precision highp float;
                    uniform vec2 u_resolution;
                    uniform float u_time;
                    uniform vec2 u_mouse;
                    uniform float u_geometryType;
                    uniform float u_density;
                    uniform float u_speed;
                    uniform float u_intensity;
                    uniform float u_hue;
                    uniform float u_chaos;
                    uniform float u_morph;
                    uniform float u_mouseIntensity;
                    
                    vec3 hsv2rgb(vec3 c) {
                        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                    }
                    
                    // All 8 geometry types from the full system
                    float tetrahedronLattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        float d1 = length(q);
                        float d2 = length(q - vec3(0.4, 0.0, 0.0));
                        float d3 = length(q - vec3(0.0, 0.4, 0.0));
                        float d4 = length(q - vec3(0.0, 0.0, 0.4));
                        float vertices = 1.0 - smoothstep(0.0, 0.04, min(min(d1, d2), min(d3, d4)));
                        
                        // Add edge connections
                        float edges = 0.0;
                        edges = max(edges, 1.0 - smoothstep(0.0, 0.02, abs(length(q.xy) - 0.2)));
                        edges = max(edges, 1.0 - smoothstep(0.0, 0.02, abs(length(q.yz) - 0.2)));
                        edges = max(edges, 1.0 - smoothstep(0.0, 0.02, abs(length(q.xz) - 0.2)));
                        
                        return max(vertices, edges * 0.5);
                    }
                    
                    float hypercubeLattice(vec3 p, float gridSize) {
                        vec3 grid = fract(p * gridSize);
                        vec3 edges = 1.0 - smoothstep(0.0, 0.03, abs(grid - 0.5));
                        return max(max(edges.x, edges.y), edges.z);
                    }
                    
                    float sphereLattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        float r = length(q);
                        return 1.0 - smoothstep(0.2, 0.5, r);
                    }
                    
                    float torusLattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        float r1 = sqrt(q.x*q.x + q.y*q.y);
                        float r2 = sqrt((r1 - 0.3)*(r1 - 0.3) + q.z*q.z);
                        return 1.0 - smoothstep(0.0, 0.1, r2);
                    }
                    
                    float kleinLattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize);
                        float u = q.x * 6.28318;
                        float v = q.y * 6.28318;
                        float x = cos(u) * (3.0 + cos(u/2.0) * sin(v) - sin(u/2.0) * sin(2.0*v));
                        float klein = length(vec2(x, q.z)) - 0.1;
                        return 1.0 - smoothstep(0.0, 0.05, abs(klein));
                    }
                    
                    float fractalLattice(vec3 p, float gridSize) {
                        vec3 q = p * gridSize;
                        float scale = 1.0;
                        float fractal = 0.0;
                        for(int i = 0; i < 4; i++) {
                            q = fract(q) - 0.5;
                            fractal += abs(length(q)) / scale;
                            scale *= 2.0;
                            q *= 2.0;
                        }
                        return 1.0 - smoothstep(0.0, 1.0, fractal);
                    }
                    
                    float waveLattice(vec3 p, float gridSize) {
                        vec3 q = p * gridSize;
                        float wave = sin(q.x * 2.0) * sin(q.y * 2.0) * sin(q.z * 2.0 + u_time * 0.001);
                        return smoothstep(-0.5, 0.5, wave);
                    }
                    
                    float crystalLattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        float d = max(max(abs(q.x), abs(q.y)), abs(q.z));
                        return 1.0 - smoothstep(0.3, 0.5, d);
                    }
                    
                    float getGeometry(vec3 p, float gridSize, float geometryType) {
                        int geom = int(mod(geometryType, 8.0));
                        if (geom == 0) return tetrahedronLattice(p, gridSize);
                        else if (geom == 1) return hypercubeLattice(p, gridSize);
                        else if (geom == 2) return sphereLattice(p, gridSize);
                        else if (geom == 3) return torusLattice(p, gridSize);
                        else if (geom == 4) return kleinLattice(p, gridSize);
                        else if (geom == 5) return fractalLattice(p, gridSize);
                        else if (geom == 6) return waveLattice(p, gridSize);
                        else return crystalLattice(p, gridSize);
                    }
                    
                    void main() {
                        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                        float aspectRatio = u_resolution.x / u_resolution.y;
                        uv.x *= aspectRatio;
                        uv -= 0.5;
                        
                        float time = u_time * 0.0004 * u_speed;
                        
                        // Mouse interaction
                        vec2 mouseOffset = (u_mouse - 0.5) * u_mouseIntensity * 0.5;
                        vec3 p = vec3(uv + mouseOffset * 0.1, sin(time * 0.1) * 0.15);
                        
                        float lattice = getGeometry(p, u_density, u_geometryType);
                        
                        float hue = u_hue / 360.0 + time * 0.1 + u_mouseIntensity * 0.2;
                        float saturation = 0.8 + lattice * 0.2;
                        float brightness = 0.2 + lattice * 0.8 * u_intensity + u_mouseIntensity * 0.15;
                        
                        vec3 color = hsv2rgb(vec3(hue, saturation, brightness));
                        
                        // Mouse glow effect
                        float mouseDist = length(uv - (u_mouse - 0.5) * vec2(aspectRatio, 1.0));
                        float mouseGlow = exp(-mouseDist * 1.5) * u_mouseIntensity * 0.2;
                        color += vec3(mouseGlow) * vec3(0.0, 1.0, 1.0) * 0.6;
                        
                        // Debug: Show geometry type as base color if lattice is 0
                        if (lattice < 0.01) {
                            color = mix(color, vec3(0.1, 0.1, 0.1), 0.9);
                        }
                        
                        gl_FragColor = vec4(color, 0.95);
                    }
                \`;
                
                this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
                this.uniforms = {
                    resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
                    time: this.gl.getUniformLocation(this.program, 'u_time'),
                    mouse: this.gl.getUniformLocation(this.program, 'u_mouse'),
                    geometryType: this.gl.getUniformLocation(this.program, 'u_geometryType'),
                    density: this.gl.getUniformLocation(this.program, 'u_density'),
                    speed: this.gl.getUniformLocation(this.program, 'u_speed'),
                    intensity: this.gl.getUniformLocation(this.program, 'u_intensity'),
                    hue: this.gl.getUniformLocation(this.program, 'u_hue'),
                    chaos: this.gl.getUniformLocation(this.program, 'u_chaos'),
                    morph: this.gl.getUniformLocation(this.program, 'u_morph'),
                    mouseIntensity: this.gl.getUniformLocation(this.program, 'u_mouseIntensity')
                };
            }
            
            createProgram(vertexSource, fragmentSource) {
                const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
                const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
                
                const program = this.gl.createProgram();
                this.gl.attachShader(program, vertexShader);
                this.gl.attachShader(program, fragmentShader);
                this.gl.linkProgram(program);
                
                if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                    console.error('Program linking failed:', this.gl.getProgramInfoLog(program));
                    return null;
                }
                
                return program;
            }
            
            createShader(type, source) {
                const shader = this.gl.createShader(type);
                this.gl.shaderSource(shader, source);
                this.gl.compileShader(shader);
                
                if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                    console.error('Shader compilation failed:', this.gl.getShaderInfoLog(shader));
                    return null;
                }
                
                return shader;
            }
            
            initBuffers() {
                const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
                
                this.buffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
                
                const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
                this.gl.enableVertexAttribArray(positionLocation);
                this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
            }
            
            resize() {
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
            
            render() {
                if (!this.program) return;
                
                this.resize();
                this.gl.useProgram(this.program);
                
                // Update click intensity decay
                this.clickIntensity *= this.clickDecay;
                
                const time = Date.now() - this.startTime;
                
                this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
                this.gl.uniform1f(this.uniforms.time, time);
                this.gl.uniform2f(this.uniforms.mouse, this.mouseX, this.mouseY);
                this.gl.uniform1f(this.uniforms.geometryType, this.params.geometry || 0);
                this.gl.uniform1f(this.uniforms.density, this.params.density || 1.0);
                this.gl.uniform1f(this.uniforms.speed, this.params.speed || 0.5);
                this.gl.uniform1f(this.uniforms.intensity, this.params.intensity || 0.5);
                this.gl.uniform1f(this.uniforms.hue, this.params.hue || 0);
                this.gl.uniform1f(this.uniforms.chaos, this.params.chaos || 0);
                this.gl.uniform1f(this.uniforms.morph, this.params.morph || 0);
                this.gl.uniform1f(this.uniforms.mouseIntensity, this.mouseIntensity + this.clickIntensity);
                
                // Debug logging (only first few frames)
                if (time < 1000) {
                    console.log(\`🎨 Renderer \${this.role}:\`, {
                        geometry: this.params.geometry,
                        density: this.params.density,
                        speed: this.params.speed,
                        intensity: this.params.intensity,
                        hue: this.params.hue
                    });
                }
                
                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
            }
            
            startRender() {
                const render = () => {
                    this.render();
                    requestAnimationFrame(render);
                };
                render();
            }
        }
        
        // Initialize standalone renderers
        const params = {
            geometry: ${variation.parameters.geometryType || 0},
            density: ${variation.parameters.density || 1.0},
            speed: ${variation.parameters.speed || 0.5},
            chaos: ${variation.parameters.chaos || 0.0},
            morph: ${variation.parameters.morph || 0.0},
            hue: ${variation.parameters.hue || 0},
            saturation: ${variation.parameters.saturation || 0.8},
            intensity: ${variation.parameters.intensity || 0.5}
        };
        
        console.log('📊 Export Parameters:', params);
        console.log('🎨 Variation Info:', {
            id: ${variation.id},
            name: '${variation.name}',
            geometry: params.geometry,
            isCustom: ${variation.isCustom || false}
        });
        
        // Store renderer instances for interaction
        const renderers = [];
        
        // Create renderers for each layer with proper role differentiation
        window.addEventListener('load', () => {
            // Background layer - lower density, slower, dimmer
            renderers.push(new StandaloneHolographicRenderer('background-canvas', 'background', {
                ...params, 
                density: params.density * 0.4, 
                speed: params.speed * 0.2, 
                intensity: 0.2,
                hue: params.hue
            }));
            
            // Shadow layer - offset, blurred effect
            renderers.push(new StandaloneHolographicRenderer('shadow-canvas', 'shadow', {
                ...params, 
                density: params.density * 0.8, 
                speed: params.speed * 0.3, 
                intensity: 0.4,
                hue: params.hue + 180
            }));
            
            // Content layer - main display
            renderers.push(new StandaloneHolographicRenderer('content-canvas', 'content', params));
            
            // Highlight layer - brighter, shifted hue
            renderers.push(new StandaloneHolographicRenderer('highlight-canvas', 'highlight', {
                ...params, 
                density: params.density * 1.5, 
                speed: params.speed * 0.8, 
                intensity: 0.6,
                hue: params.hue + 60
            }));
            
            // Accent layer - subtle overlay
            renderers.push(new StandaloneHolographicRenderer('accent-canvas', 'accent', {
                ...params, 
                density: params.density * 2.0, 
                speed: params.speed * 0.4, 
                intensity: 0.3,
                hue: params.hue + 300
            }));
            
            console.log('✅ Standalone holographic system initialized with', renderers.length, 'layers');
        });
        
        function toggleInfo() {
            const panel = document.querySelector('.info-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
        
        // Auto-hide info panel after 5 seconds
        setTimeout(() => {
            const panel = document.querySelector('.info-panel');
            panel.style.opacity = '0.3';
        }, 5000);
        
        // Proper mouse interaction
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = 1.0 - (e.clientY / window.innerHeight);
            const mouseIntensity = Math.min(1.0, Math.sqrt(e.movementX*e.movementX + e.movementY*e.movementY) / 40);
            
            // Update all renderers with mouse position
            renderers.forEach(renderer => {
                if (renderer) {
                    renderer.mouseX = mouseX;
                    renderer.mouseY = mouseY;
                    renderer.mouseIntensity = mouseIntensity;
                }
            });
        });
        
        // Click interaction
        document.addEventListener('click', (e) => {
            const clickX = e.clientX / window.innerWidth;
            const clickY = 1.0 - (e.clientY / window.innerHeight);
            
            renderers.forEach(renderer => {
                if (renderer) {
                    renderer.clickIntensity = Math.min(1.0, renderer.clickIntensity + 0.3);
                }
            });
        });
        
        // Make toggleInfo global
        window.toggleInfo = toggleInfo;
    </script>
</body>
</html>`;
    }
    
    /**
     * Generate gallery item card
     */
    generateGalleryItemCard(item) {
        const parametersQuery = this.buildParametersQuery(item.parameters);
        const customBadge = item.isCustom ? '<span class="custom-badge">CUSTOM</span>' : '';
        const dateAdded = item.addedDate ? new Date(item.addedDate).toLocaleDateString() : 'Unknown';
        
        return `
        <div class="variation-card" data-id="${item.id}">
            <div class="card-header">
                <h3>${this.escapeHtml(item.name)}</h3>
                ${customBadge}
            </div>
            <div class="card-preview">
                <iframe src="${parametersQuery}&autoplay=true" loading="lazy"></iframe>
            </div>
            <div class="card-info">
                <small>Added: ${dateAdded}</small>
            </div>
            <div class="card-controls">
                <button onclick="openFullscreen(${item.id})">Fullscreen</button>
                <button onclick="exportSingle(${item.id})">Export</button>
                <button onclick="removeFromGallery(${item.id})" style="background: rgba(255,0,0,0.2); border-color: #ff0000; color: #ff0000;">Remove</button>
            </div>
        </div>`;
    }
    
    /**
     * Generate variation card for gallery (legacy)
     */
    generateVariationCard(variation) {
        const parametersQuery = this.buildParametersQuery(variation.parameters);
        const customBadge = variation.isCustom ? '<span class="custom-badge">CUSTOM</span>' : '';
        
        return `
        <div class="variation-card" data-id="${variation.id}">
            <div class="card-header">
                <h3>${this.escapeHtml(variation.name)}</h3>
                ${customBadge}
            </div>
            <div class="card-preview">
                <iframe src="${parametersQuery}&autoplay=true" loading="lazy"></iframe>
            </div>
            <div class="card-controls">
                <button onclick="openFullscreen(${variation.id})">Fullscreen</button>
                <button onclick="exportSingle(${variation.id})">Export</button>
            </div>
        </div>`;
    }
    
    /**
     * Build parameters query string for URLs
     */
    buildParametersQuery(params) {
        const baseUrl = './demo-modular.html';
        const urlParams = new URLSearchParams();
        
        if (params.geometryType !== undefined) urlParams.set('geometry', params.geometryType);
        if (params.density !== undefined) urlParams.set('density', params.density);
        if (params.speed !== undefined) urlParams.set('speed', params.speed);
        if (params.chaos !== undefined) urlParams.set('chaos', params.chaos);
        if (params.morph !== undefined) urlParams.set('morph', params.morph);
        if (params.hue !== undefined) urlParams.set('hue', params.hue);
        if (params.saturation !== undefined) urlParams.set('saturation', params.saturation);
        if (params.intensity !== undefined) urlParams.set('intensity', params.intensity);
        
        return `${baseUrl}?${urlParams.toString()}`;
    }
    
    /**
     * Generate gallery CSS styles
     */
    generateGalleryCSS() {
        return `
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
                background: #000;
                color: #fff;
                font-family: 'Orbitron', monospace;
                line-height: 1.6;
                background: radial-gradient(ellipse at center, #1a0033 0%, #000000 70%);
            }
            
            .gallery-header {
                text-align: center;
                padding: 40px 20px;
                border-bottom: 1px solid #00ffff;
            }
            
            .gallery-header h1 {
                font-size: 2.5rem;
                color: #00ffff;
                text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                margin-bottom: 10px;
            }
            
            .gallery-header p {
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 20px;
            }
            
            .controls {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            button {
                background: rgba(0, 255, 255, 0.2);
                border: 1px solid #00ffff;
                color: #00ffff;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                transition: all 0.3s ease;
            }
            
            button:hover {
                background: rgba(0, 255, 255, 0.4);
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
            }
            
            .gallery-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 30px;
                padding: 40px 20px;
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .variation-card {
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 15px;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .variation-card:hover {
                border-color: #00ffff;
                box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
                transform: translateY(-5px);
            }
            
            .card-header {
                padding: 20px;
                border-bottom: 1px solid rgba(0, 255, 255, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .card-header h3 {
                color: #00ffff;
                font-size: 1.1rem;
            }
            
            .custom-badge {
                background: rgba(255, 0, 100, 0.3);
                color: #ff0064;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.7rem;
                border: 1px solid #ff0064;
            }
            
            .card-preview {
                height: 300px;
                position: relative;
                overflow: hidden;
            }
            
            .card-preview iframe {
                width: 100%;
                height: 100%;
                border: none;
                background: #000;
            }
            
            .card-controls {
                padding: 15px 20px;
                display: flex;
                gap: 10px;
            }
            
            .card-controls button {
                flex: 1;
                padding: 8px 16px;
                font-size: 0.8rem;
            }
            
            .card-info {
                padding: 10px 20px;
                border-top: 1px solid rgba(0, 255, 255, 0.1);
                font-size: 0.7rem;
                color: rgba(255, 255, 255, 0.6);
                text-align: center;
            }
            
            .gallery-footer {
                text-align: center;
                padding: 40px 20px;
                color: rgba(255, 255, 255, 0.6);
                border-top: 1px solid rgba(0, 255, 255, 0.2);
            }
            
            @media (max-width: 768px) {
                .gallery-grid {
                    grid-template-columns: 1fr;
                    gap: 20px;
                    padding: 20px 10px;
                }
                
                .gallery-header h1 {
                    font-size: 2rem;
                }
            }
        `;
    }
    
    /**
     * Generate single variation CSS
     */
    generateSingleVariationCSS() {
        return `
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
                background: #000;
                font-family: 'Orbitron', monospace;
                overflow: hidden;
                background: radial-gradient(ellipse at center, #1a0033 0%, #000000 70%);
            }
            
            .fullscreen-container {
                width: 100vw;
                height: 100vh;
                position: relative;
            }
            
            .holographic-display {
                position: absolute;
                top: 10%;
                left: 10%;
                width: 80%;
                height: 80%;
                border-radius: 25px;
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                transform-style: preserve-3d;
                z-index: 10;
                touch-action: none;
                overscroll-behavior: none;
                box-shadow: 
                    0 20px 40px rgba(0, 0, 0, 0.4),
                    0 8px 16px rgba(0, 0, 0, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.1),
                    inset 0 -2px 2px rgba(0, 0, 0, 0.1),
                    0 0 0 2px rgba(0, 255, 255, 0.3),
                    0 0 30px rgba(0, 255, 255, 0.2);
            }
            
            canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                touch-action: none;
                overscroll-behavior: none;
            }
            
            #background-canvas { z-index: 1; opacity: 0.2; }
            #shadow-canvas { z-index: 3; opacity: 0.6; filter: blur(2px) brightness(0.7); mix-blend-mode: multiply; transform: translate(2px, 2px); }
            #content-canvas { z-index: 5; opacity: 0.8; mix-blend-mode: normal; }
            #highlight-canvas { z-index: 7; opacity: 0.4; filter: blur(1px) brightness(1.5); mix-blend-mode: screen; transform: translate(-1px, -1px); }
            #accent-canvas { z-index: 15; opacity: 0.3; filter: blur(2px); mix-blend-mode: color-dodge; transform: scale(1.01); }
            
            .info-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #00ffff;
                border-radius: 10px;
                padding: 20px;
                color: #fff;
                z-index: 1000;
                max-width: 300px;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .info-panel h1 {
                color: #00ffff;
                font-size: 1.2rem;
                margin-bottom: 15px;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
            
            .parameters {
                margin-bottom: 15px;
            }
            
            .param-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 0.8rem;
            }
            
            .param-row span:first-child {
                color: rgba(0, 255, 255, 0.7);
            }
            
            .controls {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            button {
                background: rgba(0, 255, 255, 0.2);
                border: 1px solid #00ffff;
                color: #00ffff;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                font-size: 0.7rem;
                transition: all 0.3s ease;
            }
            
            button:hover {
                background: rgba(0, 255, 255, 0.4);
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
        `;
    }
    
    /**
     * Generate core JavaScript for gallery functionality
     */
    generateCoreJavaScript() {
        return `
            let autoplayInterval = null;
            let currentIndex = 0;
            
            function toggleAutoplay() {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    autoplayInterval = null;
                    event.target.textContent = 'Auto Play';
                } else {
                    autoplayInterval = setInterval(() => {
                        const cards = document.querySelectorAll('.variation-card');
                        if (cards.length > 0) {
                            currentIndex = (currentIndex + 1) % cards.length;
                            cards[currentIndex].scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }
                    }, 5000);
                    event.target.textContent = 'Stop Auto';
                }
            }
            
            function openFullscreen(id) {
                const card = document.querySelector(\`[data-id="\${id}"]\`);
                const iframe = card.querySelector('iframe');
                if (iframe) {
                    window.open(iframe.src.replace('autoplay=true', ''), '_blank');
                }
            }
            
            function exportSingle(id) {
                alert('Export functionality requires server integration');
            }
            
            function exportData() {
                const data = {
                    type: 'holographic-gallery-export',
                    exported: new Date().toISOString(),
                    variations: Array.from(document.querySelectorAll('.variation-card')).map(card => ({
                        id: card.dataset.id,
                        name: card.querySelector('h3').textContent,
                        url: card.querySelector('iframe').src
                    }))
                };
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'holographic-gallery-export.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            
            // Lazy loading optimization
            const observerOptions = {
                root: null,
                rootMargin: '100px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const iframe = entry.target.querySelector('iframe');
                        if (iframe && !iframe.dataset.loaded) {
                            iframe.dataset.loaded = 'true';
                            // Iframe already has src, just mark as loaded
                        }
                    }
                });
            }, observerOptions);
            
            // Observe all cards
            document.querySelectorAll('.variation-card').forEach(card => {
                observer.observe(card);
            });
        `;
    }
    
    /**
     * Utility: Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    /**
     * Utility: Get geometry name by ID
     */
    getGeometryName(geometryId) {
        const geometryNames = [
            'TETRAHEDRON', 'HYPERCUBE', 'SPHERE', 'TORUS',
            'KLEIN BOTTLE', 'FRACTAL', 'WAVE', 'CRYSTAL'
        ];
        return geometryNames[geometryId] || 'UNKNOWN';
    }
    
    /**
     * Utility: Download file
     */
    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log(`📁 Downloaded: ${filename}`);
    }
}