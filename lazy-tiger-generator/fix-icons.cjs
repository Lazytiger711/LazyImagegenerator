const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('import.meta.glob')) {
        if (filePath.includes('constants.jsx')) {
            const prefix = `import { Ban, Eye, MoveVertical, Camera, Film, Box, Paintbrush, Pencil, Zap, Monitor, Instagram, Smartphone, Eraser, Grid, User, Home, Smile, Star, Sparkles } from 'lucide-react';\n\nconst iconUrls = import.meta.glob('../assets/icons/**/*.png', { eager: true, import: 'default' });\nconst getIcon = (path) => {\n    if (typeof path === 'string' && path.startsWith('/icons/')) {\n        const key = \`../assets\${path}\`;\n        return iconUrls[key] || path;\n    }\n    return path;\n};\n`;
            content = content.replace("import { Ban, Eye, MoveVertical, Camera, Film, Box, Paintbrush, Pencil, Zap, Monitor, Instagram, Smartphone, Eraser, Grid, User, Home, Smile, Star, Sparkles } from 'lucide-react';", prefix);
        } else if (filePath.includes('App.jsx')) {
            content = content.replace("import { sessionStorage } from './utils/storage';", "import { sessionStorage } from './utils/storage';\n\nconst iconUrls = import.meta.glob('./assets/icons/**/*.png', { eager: true, import: 'default' });\nconst getAppIcon = (path) => iconUrls[`./assets${path}`] || path;\n");
            content = content.replace(/icon:\s*'(\/icons\/[^']+)'/g, "icon: getAppIcon('$1')");
        } else if (filePath.includes('GuidePage.jsx')) {
            content = content.replace("import Header from '../components/Header';", "import Header from '../components/Header';\n\nconst iconUrls = import.meta.glob('../assets/icons/**/*.png', { eager: true, import: 'default' });\nconst getGuideIcon = (path) => iconUrls[`../assets${path}`] || path;\n");
            content = content.replace(/src="(\/icons\/[^"]+)"/g, "src={getGuideIcon('$1')}");
        }

        if (filePath.includes('constants.jsx')) {
            content = content.replace(/icon:\s*'(\/icons\/[^']+)'/g, "icon: getIcon('$1')");
        }

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

fixFile('src/data/constants.jsx');
fixFile('src/App.jsx');
fixFile('src/pages/GuidePage.jsx');
