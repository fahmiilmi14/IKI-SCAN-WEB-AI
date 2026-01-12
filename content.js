const PATTERNS = {
    supabase: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9._-]{50,}/g,
    firebase: /AIzaSy[a-zA-Z0-9-_]{33}/g,
    google_maps: /AIzaSy[a-zA-Z0-9-_]{33}/g,
    openai: /sk-[a-zA-Z0-9]{20,}/g,
    stripe: /(pk_test|pk_live)_[a-zA-Z0-9]{24,}/g
};

function scanDeep() {
    const html = document.documentElement.innerHTML;
    const bodyText = document.body.innerText;
    const allContent = html + bodyText;

    let detectedProviders = [];

    
    for (const [provider, regex] of Object.entries(PATTERNS)) {
        if (regex.test(allContent)) {
            detectedProviders.push(provider.toUpperCase());
        }
    }

    
    const indicators = {
        hasV0Attr: !!document.querySelector('[data-v0-t]'),
        hasLovable: !!document.querySelector('meta[content*="lovable"]') || html.includes('lovable-tag'),
        hasBolt: html.includes('_bolt-') || html.includes('bolt-container'),
        hasAIPatterns: html.includes('flex-col min-h-screen') && html.includes('justify-center'),
        hasLucide: html.includes('lucide') 
    };

    let score = 0;
    if (indicators.hasV0Attr) score += 50;
    if (indicators.hasLovable) score += 50;
    if (indicators.hasBolt) score += 50;
    if (indicators.hasAIPatterns) score += 20;
    if (indicators.hasLucide) score += 10;

    return {
        isAI: score >= 40,
        confidence: Math.min(score, 100),
        leaksFound: detectedProviders,
        detectedTool: indicators.hasV0Attr ? 'v0.dev' : (indicators.hasBolt ? 'Bolt.new' : (indicators.hasLovable ? 'Lovable' : 'Unknown AI'))
    };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getStatus") {
        sendResponse(scanDeep());
    }
    return true; 
});