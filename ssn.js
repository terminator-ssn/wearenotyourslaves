(async () => {
    const modalId = 'recon-interrogator-v1';
    if (document.getElementById(modalId)) document.getElementById(modalId).remove();

    // --- Minimal Forensic UI ---
    const style = document.createElement('style');
    style.innerHTML = `
        #${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.9); font-family: monospace; }
        .r-card { background: #111; width: 600px; border-radius: 8px; border: 1px solid #0f0; color: #0f0; padding: 20px; box-shadow: 0 0 30px #0f03; }
        .r-header { border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 15px; text-align: center; font-weight: bold; font-size: 14px; }
        .r-item { margin-bottom: 10px; font-size: 11px; }
        .r-label { color: #888; text-transform: uppercase; margin-right: 10px; }
        .r-val { color: #fff; font-weight: bold; background: #222; padding: 2px 5px; border-radius: 3px; word-break: break-all; }
        .r-btn { width: 100%; padding: 10px; margin-top: 15px; background: #0f0; color: #000; border: none; font-weight: bold; cursor: pointer; }
    `;
    document.head.appendChild(style);

    const modalHTML = `
    <div id="${modalId}">
        <div class="r-card">
            <div class="r-header">SYSTEM RECONNAISSANCE PROTOCOL</div>
            <div id="recon-status" style="text-align:center; font-size:12px; margin-bottom:20px;">
                [STATUS] Listening for API traffic...<br>
                <small style="color:#aaa;">(Please refresh your dashboard history to capture data)</small>
            </div>
            <div id="recon-results" style="display:none;">
                <div class="r-item"><span class="r-label">New Endpoint:</span><span id="res-end" class="r-val"></span></div>
                <div class="r-item"><span class="r-label">Project ID:</span><span id="res-proj" class="r-val"></span></div>
                <div class="r-item"><span class="r-label">Database ID:</span><span id="res-db" class="r-val"></span></div>
                <div class="r-item"><span class="r-label">Collection ID:</span><span id="res-col" class="r-val"></span></div>
                <div class="r-item"><span class="r-label">Data Schema:</span><br><pre id="res-keys" style="background:#000; padding:10px; margin-top:5px; color:#0f0; overflow:auto; max-height:150px;"></pre></div>
            </div>
            <button onclick="location.reload()" class="r-btn">RESTART INTERROGATION</button>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    console.log("%c 🛰️ INTERROGATOR ACTIVE. REFRESH DASHBOARD NOW. ", "background: #000; color: #0f0; font-weight: bold;");

    // --- LOGIC: INTERCEPT NETWORK TRAFFIC ---
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const url = args[0].toString();
        
        // Look for Appwrite document requests
        if (url.includes('/databases/') && url.includes('/collections/')) {
            const endpoint = url.split('/databases/')[0];
            const dbId = url.split('/databases/')[1].split('/')[0];
            const colId = url.split('/collections/')[1].split('/')[0];
            
            // Extract Project ID from Headers
            const projId = args[1]?.headers?.['X-Appwrite-Project'] || 
                           args[1]?.headers?.['x-appwrite-project'] || 
                           "Captured via Global Search";

            // Update UI
            document.getElementById('recon-status').innerHTML = '<span style="color:#fff;">✅ TRAFFIC INTERCEPTED</span>';
            document.getElementById('recon-results').style.display = 'block';
            document.getElementById('res-end').innerText = endpoint;
            document.getElementById('res-db').innerText = dbId;
            document.getElementById('res-col').innerText = colId;
            
            // If the project ID isn't in headers, find it in the SDK config
            if (window.client && window.client.config) {
                document.getElementById('res-proj').innerText = window.client.config.project;
            } else {
                document.getElementById('res-proj').innerText = projId;
            }

            // Capture the data structure (The Labels)
            try {
                const response = await originalFetch(...args);
                const clone = response.clone();
                const json = await clone.json();
                const sampleDoc = json.documents ? json.documents[0] : json;
                const keys = Object.keys(sampleDoc).filter(k => !k.startsWith('$'));
                document.getElementById('res-keys').innerText = JSON.stringify(keys, null, 2);
            } catch(e) { document.getElementById('res-keys').innerText = "Schema read blocked."; }
        }
        return originalFetch(...args);
    };

    // --- SECONDARY LOGIC: SEARCH GLOBAL MEMORY ---
    setTimeout(() => {
        if (window.client && window.client.config) {
            document.getElementById('recon-results').style.display = 'block';
            document.getElementById('res-end').innerText = window.client.config.endpoint;
            document.getElementById('res-proj').innerText = window.client.config.project;
        }
    }, 1000);

})();