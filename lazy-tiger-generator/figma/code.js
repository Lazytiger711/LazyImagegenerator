// Standard mobile aspect ratio (e.g., modern smartphone, 400x850 or 390x844 iPhone 14)
figma.showUI(__html__, { width: 400, height: 850, themeColors: true });

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'copy-prompt') {
        // Figma plugins cannot directly write to clipboard without a hack, 
        // but the UI iframe can. So we usually let the UI handle the clipboard.
        // We can use this to just notify or do other Figma canvas things.
        figma.notify("Prompt copied to clipboard!");
    }

    if (msg.type === 'insert-text') {
        const text = msg.text;
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        const textNode = figma.createText();
        textNode.characters = text;
        textNode.x = figma.viewport.center.x;
        textNode.y = figma.viewport.center.y;
        figma.currentPage.appendChild(textNode);
        figma.currentPage.selection = [textNode];
        figma.viewport.scrollAndZoomIntoView([textNode]);
        figma.notify("Prompt inserted into canvas!");
    }

    if (msg.type === 'close') {
        figma.closePlugin();
    }
};
