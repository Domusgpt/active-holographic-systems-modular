# Active Holographic Systems - Modular Edition

## 🌌 Overview

This is the **modular production-ready version** of the Active Holographic Systems project with **working export functionality** and clean architecture.

## 🚀 Live Demo

**[📍 Open Demo](https://domusgpt.github.io/active-holographic-systems-modular/)**

### Direct Links:
- **[📁 Gallery/Portfolio](https://domusgpt.github.io/active-holographic-systems-modular/portfolio.html)** - Browse and launch all 30 variations
- **[🎛️ Parametric Engine](https://domusgpt.github.io/active-holographic-systems-modular/parametric-engine.html)** - Create custom variations
- **[🌌 Demo System](https://domusgpt.github.io/active-holographic-systems-modular/demo-modular.html)** - Direct access to holographic system

## 🎯 Quick Start

### For Development
```bash
# Clone and setup
git clone https://github.com/Domusgpt/active-holographic-systems-modular.git
cd active-holographic-systems-modular

# Start development server
python -m http.server 8000
# or
npx serve .

# Open browser
open http://localhost:8000
```

### For AI Assistants
- **Claude**: Read `CLAUDE.md` for development guidelines
- **Gemini**: Read `GEMINI.md` for technical specifications
- **Any AI**: Follow the modular development principles

## 🏗️ Architecture

```
/src/
  ├── core/           # Core holographic system (stable)
  ├── features/       # Optional features (safe to modify)
  ├── ui/            # User interface components
  └── utils/         # Utility functions

/docs/              # Documentation and examples
/tests/             # Puppeteer test suite
```

## ✨ Features

### Current (Ported from Original)
- 30 holographic geometric variations
- Real-time audio reactivity
- 5-layer WebGL rendering
- Touch/mouse interactions
- Portfolio browser
- Parametric engine

### Planned (Modular Development)
- Safe HTML export system
- Advanced variation management
- Multi-user profile system
- Enhanced UI components
- Performance monitoring
- Automated testing

## 🔧 Development Principles

1. **Never break the core system**
2. **Develop features in isolation**
3. **Test everything extensively**
4. **Document all changes**
5. **Use proper error boundaries**

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific feature
npm test features/ExportSystem

# Integration tests
npm run test:integration

# Visual regression tests
npm run test:visual
```

## 📖 Documentation

- `CLAUDE.md` - Guidelines for Claude AI development
- `GEMINI.md` - Technical specs for Gemini AI
- `src/*/README.md` - Module-specific documentation

## 🚀 Deployment

### GitHub Pages
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Local Testing
```bash
# Start local server
npm start

# Run Puppeteer tests
npm run test:e2e
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Develop in modular components
3. Add comprehensive tests
4. Update documentation
5. Submit pull request

## 📊 Project Status

- ✅ **Core System**: Stable and working
- 🔄 **Modular Refactor**: In progress
- 📝 **Documentation**: Complete
- 🧪 **Testing Suite**: To be implemented
- 🚀 **Deployment**: Ready for setup

## 🔗 Related Projects

- [Original Holographic Systems](../active-holographic-systems/) - Working monolithic version
- [VIB3 Framework](../vib3-framework/) - Underlying geometric system

---

**Remember**: This is a refactoring project focused on making the holographic system more maintainable and extensible without losing the magic of the original.