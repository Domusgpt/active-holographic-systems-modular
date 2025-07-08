# Collections Auto-Discovery System

This folder contains **JSON collection files** that are automatically discovered and loaded by the Holographic Gallery system.

## 📁 How It Works

1. **Drop JSON files** into this folder
2. **Refresh the gallery** - collections are automatically discovered
3. **Browse and launch** variations from the gallery
4. **Share collections** by copying JSON files

## 🎯 File Format

Each collection file must be a valid JSON with this structure:

```json
{
  "name": "Your Collection Name",
  "description": "Description of your collection",
  "version": "1.0",
  "type": "holographic-collection",
  "profileName": "Your Profile Name",
  "totalVariations": 5,
  "created": "2025-07-08T12:00:00.000Z",
  "variations": [
    {
      "id": 0,
      "name": "VARIATION NAME",
      "isCustom": true,
      "parameters": {
        "geometryType": 1,
        "density": 1.5,
        "speed": 0.8,
        "chaos": 0.3,
        "morph": 0.6,
        "hue": 240,
        "saturation": 0.9,
        "intensity": 0.7
      }
    }
  ]
}
```

## 🔧 Creating Collections

### From Parametric Engine
1. Create custom variations in the parametric engine
2. Click "📄 JSON" to export
3. Move the downloaded file to this folder
4. Refresh the gallery

### From Demo System
1. Create custom variations in demo-modular.html
2. Click "💾 JSON" to export
3. Move the downloaded file to this folder
4. Refresh the gallery

## 📋 Current Collections

- **base-variations.json** - 30 default geometric variations
- **community-favorites.json** - Popular community variations
- **user-custom-YYYY-MM-DD.json** - Your exported custom variations

## 🎨 Geometry Types

- **0**: TETRAHEDRON
- **1**: HYPERCUBE  
- **2**: SPHERE
- **3**: TORUS
- **4**: KLEIN BOTTLE
- **5**: FRACTAL
- **6**: WAVE
- **7**: CRYSTAL

## 🚀 Sharing Collections

### To Share:
1. Copy your JSON file from this folder
2. Send to another user
3. They drop it in their collections/ folder
4. Refresh gallery to see new variations

### To Receive:
1. Download/receive a JSON collection file
2. Drop it in this collections/ folder
3. Refresh gallery.html
4. New collection appears automatically

## 🔄 Auto-Discovery

The system automatically scans for:
- All `.json` files in this folder
- Files matching `user-custom-YYYY-MM-DD.json` pattern
- Known collection names like `community-favorites.json`

**No manual import needed!** Just drop files and refresh.

## 🛠️ Technical Details

### File Naming Convention
- `base-variations.json` - Default variations
- `community-favorites.json` - Community shared
- `user-custom-2025-07-08.json` - User exports with date
- `my-cool-collection.json` - Custom named collections

### Validation
- Files must have `"type": "holographic-collection"`
- Must contain `variations` array
- Each variation needs valid `parameters` object
- Invalid files are silently skipped

### Performance
- Collections are loaded asynchronously
- Failed loads don't break the system
- Duplicate variations are handled gracefully
- Memory usage is optimized for large collections

## 🎯 Usage Tips

1. **Organize by theme** - Create collections for different moods/styles
2. **Name clearly** - Use descriptive collection and variation names
3. **Share frequently** - JSON files are small and portable
4. **Backup regularly** - Keep copies of your custom collections
5. **Experiment freely** - Create variations in parametric engine first

## 📊 Collection Statistics

The gallery shows:
- Total collections loaded
- Total variations available
- Load status and errors
- Per-collection metadata

## 🔧 Troubleshooting

### Collection Not Loading?
- Check JSON syntax is valid
- Ensure `"type": "holographic-collection"` is present
- Verify file is in collections/ folder
- Refresh the gallery page

### Variation Not Working?
- Check parameter values are numbers
- Ensure geometryType is 0-7
- Verify all required parameters exist
- Test in parametric engine first

### Performance Issues?
- Limit collections to <100 variations each
- Use multiple smaller collections vs one large
- Check browser console for errors
- Clear browser cache if needed

---

**🌌 Happy Holographing!**

This auto-discovery system makes sharing and organizing holographic variations as easy as copying files. Create, share, and discover amazing holographic art together!