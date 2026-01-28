
// Mock Constants & Inputs
const subjectText = "Tiger";
const width = 800;
const height = 600;

// Mock Palette
const paletteColors = [
    { id: 'subject', color: '#ffa500', label: 'Main Subject' },
    { id: 'obj_1', color: '#0000ff', label: 'Blue Object' }
];

// Mock Color Stats
// Scenario: Orange Subject at bottom (Foreground), Blue Object slightly above and overlapping (Background)
const colorStats = {
    '#ffa500': { // Orange: Lower on screen (Higher Y value for maxY) -> Foreground
        count: 1000,
        minX: 350, maxX: 450,
        minY: 400, maxY: 550, // Feet at 550
        sumX: 400000, sumY: 475000
    },
    '#0000ff': { // Blue: Higher on screen (Lower Y value for maxY) -> Background
        count: 1000,
        minX: 380, maxX: 480, // Overlaps X
        minY: 350, maxY: 500, // Feet at 500 (Behind)
        sumX: 430000, sumY: 425000
    }
};

// --- LOGIC TO TEST (Copied from App.jsx) ---
function getGridDescription() {
    let objectDescriptions = [];
    let legendNotes = [];

    const getLabel = (item) => {
        if (item.id === 'subject') return subjectText.trim() ? subjectText.trim() : "Main Subject";
        if (item.promptName) return item.promptName;
        return item.label;
    };

    const getOverlapRatio = (stats1, stats2) => {
        const xOverlap = Math.max(0, Math.min(stats1.maxX, stats2.maxX) - Math.max(stats1.minX, stats2.minX));
        const yOverlap = Math.max(0, Math.min(stats1.maxY, stats2.maxY) - Math.max(stats1.minY, stats2.minY));
        const intersectionArea = xOverlap * yOverlap;
        const minArea = Math.min((stats1.maxX - stats1.minX) * (stats1.maxY - stats1.minY), (stats2.maxX - stats2.minX) * (stats2.maxY - stats2.minY));
        return minArea > 0 ? intersectionArea / minArea : 0;
    };

    const activeObjects = paletteColors.filter(item => {
        if (item.id === 'erase') return false;
        const stats = colorStats[item.color];
        if (!stats) return false;
        if (item.id === 'bg') return false;
        return true;
    }).map(item => ({ ...item, stats: colorStats[item.color] }));

    const mainSubject = activeObjects.find(obj => obj.id === 'subject') || activeObjects[0];

    if (activeObjects.length > 0) {
        activeObjects.forEach(obj => {
            if (obj === mainSubject) return;

            const overlap = getOverlapRatio(obj.stats, mainSubject.stats);
            const isOverlapping = overlap > 0.1;

            const label = getLabel(obj);
            const mainLabel = getLabel(mainSubject);

            let relationStr = "";

            if (isOverlapping) {
                // Lower maxY (higher on screen) = Behind
                if (obj.stats.maxY < mainSubject.stats.maxY) {
                    relationStr = `standing behind ${mainLabel}`;
                } else {
                    relationStr = `in front of ${mainLabel}`;
                }
            } else {
                const objCenterX = obj.stats.sumX / obj.stats.count;
                const mainCenterX = mainSubject.stats.sumX / mainSubject.stats.count;

                if (objCenterX < mainCenterX) relationStr = `to the left of ${mainLabel}`;
                else relationStr = `to the right of ${mainLabel}`;
            }

            objectDescriptions.push(`${label} ${relationStr}`);
        });

        const stats = mainSubject.stats;
        const centerX = stats.sumX / stats.count;
        const centerY = stats.sumY / stats.count;
        const normX = centerX / width;
        const normY = centerY / height;

        let vPos = "middle";
        if (normY < 0.33) vPos = "top";
        else if (normY > 0.66) vPos = "bottom";

        let hPos = "center";
        if (normX < 0.33) hPos = "left";
        else if (normX > 0.66) hPos = "right";

        let positionStr = "";
        if (vPos === "middle" && hPos === "center") positionStr = "in the center";
        else if (vPos === "middle") positionStr = `on the ${hPos}`;
        else if (hPos === "center") positionStr = `at the ${vPos}`;
        else positionStr = `at the ${vPos}-${hPos}`;

        // Simply return main subject desc for verify
        objectDescriptions.push(`${getLabel(mainSubject)} positioned ${positionStr}`);
    }

    return objectDescriptions.join(", ");
}

// execute
console.log("Measured Overlap Ratio:",
    (Math.max(0, Math.min(450, 480) - Math.max(350, 380)) * Math.max(0, Math.min(550, 500) - Math.max(400, 350))) /
    ((450 - 350) * (550 - 400)) // Area of subject 100*150 = 15000. Overlap 70 * 100 = 7000. Ratio ~ 0.46
);
console.log("Generated Description:", getGridDescription());
