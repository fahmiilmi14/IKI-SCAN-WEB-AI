chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getStatus"}, (response) => {
        const aiCard = document.getElementById('ai-card');
        const leakCard = document.getElementById('leak-card');

        if (response) {
            // Update Tampilan AI
            if (response.isAI) {
                aiCard.className = "card warning";
                aiCard.innerHTML = `
                    <div class="title">🤖 Terdeteksi AI <span style="font-size:10px; opacity:0.7;">${response.confidence}%</span></div>
                    <div class="desc">Dibuat dengan <b>${response.detectedTool}</b>.</div>
                `;
            } else {
                aiCard.className = "card safe";
                aiCard.innerHTML = `<div class="title">✅ Kode Organik</div><div class="desc">Tidak terdeteksi generator AI.</div>`;
            }

            if (response.leaksFound.length > 0) {
                leakCard.className = "card danger";
                let listHtml = `<div class="title">⚠️ HATI HATI!</div>`;
                listHtml += `<div class="desc">Hati Hati saat login <br> Ditemukan API Key terekspos untuk:</div>`;
                listHtml += `<ul style="margin: 5px 0 0 15px; padding: 0; font-size: 12px; font-weight: bold;">`;
                
                response.leaksFound.forEach(provider => {
                    listHtml += `<li>${provider}</li>`;
                });
                
                listHtml += `</ul>`;
                leakCard.innerHTML = listHtml;
            } else {
                leakCard.className = "card safe";
                leakCard.innerHTML = `<div class="title">🔒 Aman</div><div class="desc">Tidak ada API Key yang terdeteksi di Front End.</div>`;
            }
        }
    });
});