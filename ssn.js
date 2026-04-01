(async () => {
    const endpoint = 'https://hostelgatepass.ssn.edu.in/v1';
    
    console.log("%c 🛰️ RUNNING SERVER DIAGNOSTICS...", "color: cyan; font-weight: bold;");

    try {
        const response = await fetch(`${endpoint}/health/version`, { method: 'GET' });
        
        if (response.status === 502) {
            throw new Error("SERVER_OFFLINE: The Appwrite backend is currently down (502 Bad Gateway).");
        }
        
        if (!response.ok) {
            throw new Error(`API_RESTRICTED: Server returned status ${response.status}.`);
        }

        console.log("%c ✅ SERVER ALIVE. INITIALIZING SUITE...", "color: green; font-weight: bold;");
        launchSuite();

    } catch (e) {
        const errorHTML = `
            <div id="error-overlay" style="z-index:2147483647; position:fixed; inset:0; background:rgba(0,0,0,0.9); color:white; display:flex; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
                <div>
                    <h1 style="color:#ef4444;">🚫 Connection Blocked (502)</h1>
                    <p style="margin:20px 0; font-size:14px; color:#94a3b8;">${e.message}</p>
                    <p style="font-size:12px;"><b>Possible Reason:</b> The University IT department may have implemented a Firewall block against script activity or the database is under maintenance.</p>
                    <button onclick="location.reload()" style="background:#4f46e5; color:white; padding:10px 20px; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Try Reloading Page</button>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
    }

    async function launchSuite() {
        // --- SDK INJECTION ---
        if (!window.Appwrite) {
            await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdn.jsdelivr.net/npm/appwrite@17.0.0"; s.onload = r; document.head.appendChild(s); });
        }

        const client = new Appwrite.Client().setEndpoint(endpoint).setProject('ssn-gatepass-1');
        const database = new Appwrite.Databases(client);
        const masterId = 'ssn-master-suite-v11';
        if (document.getElementById(masterId)) document.getElementById(masterId).remove();

        const style = document.createElement('style');
        style.innerHTML = `#${masterId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.9); font-family: sans-serif; } .card { background: #fff; width: 480px; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 20px; } .btn { padding: 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; } .btn:hover { background: #f5f3ff; border-color: #4f46e5; } .v-card-full { background: #fff; width: 98%; max-width: 1300px; height: 85vh; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; position: fixed; inset: 10px; z-index: 2147483647; } .v-header { padding: 15px; background: #f8f9fa; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; } .pm-row { padding: 8px; border-bottom: 1px solid #eee; } .pm-label { font-size: 10px; font-weight: bold; color: #777; text-transform: uppercase; }`;
        document.head.appendChild(style);

        window.tool = (n) => {
            document.getElementById(masterId).style.display = 'none';
            if (n === 1) rT1(); if (n === 2) rT2(); if (n === 3) rT3(); if (n === 8) rT8(); if (n === 10) rT10();
        };

        const menuHTML = `<div id="${masterId}"><div class="card"><div style="background:#4f46e5; padding:20px; color:#fff; text-align:center;"><strong>SUITE V11 (ADAPTED)</strong></div><div class="grid"><button class="btn" onclick="window.tool(1)">History Fetcher</button><button class="btn" onclick="window.tool(2)">New Pass Creator</button><button class="btn" onclick="window.tool(3)">Pass Modifier</button><button class="btn" onclick="window.tool(8)">Overall History</button><button class="btn" style="grid-column:span 2; background:#4f46e5; color:#fff;" onclick="window.tool(10)">Profile Master Architect</button><button class="btn" style="grid-column:span 2; margin-top:10px;" onclick="location.reload()">Exit</button></div></div></div>`;
        document.body.insertAdjacentHTML('beforeend', menuHTML);

        // --- SAMPLE TOOL LOGIC (Minimalist) ---
        async function rT10() {
            const mId = 'profile-master-modal';
            document.body.insertAdjacentHTML('beforeend', `<div id="${mId}" class="v-card-full">
                <div class="v-header"><strong>Profile Master</strong><button onclick="location.reload()">X</button></div>
                <div style="padding:20px; flex:1; overflow:auto;">
                    <input type="text" id="p-uid" placeholder="Enter User ID" style="width:100%; padding:10px; border:1px solid #ccc;">
                    <button onclick="window.loadP()" style="width:100%; padding:10px; margin-top:10px; background:#4f46e5; color:#fff; border:none; cursor:pointer;">FETCH DATA</button>
                    <div id="p-res" style="margin-top:20px;"></div>
                </div>
            </div>`);
            window.loadP = async () => {
                const id = document.getElementById('p-uid').value;
                try {
                    const doc = await database.getDocument('ssndb', 'students', id);
                    const s = { "aadharName": "Name", "rollNo": "Roll", "emailId": "Email", "studentMobile": "Phone", "fatherNumber": "Father", "hostelBlock": "Block" };
                    document.getElementById('p-res').innerHTML = Object.keys(s).map(k => `<div class="pm-row"><label class="pm-label">${s[k]}</label><div>${doc[k]||'---'}</div></div>`).join('');
                } catch (err) { alert(err.message); }
            };
        }
        
        async function rT8() {
             document.body.insertAdjacentHTML('beforeend', `<div class="v-card-full" id="ga-v"><div class="v-header"><strong>Global Archive</strong><button onclick="location.reload()">X</button></div><div style="flex:1; overflow:auto;"><table style="width:100%; border-collapse:collapse; font-size:12px;"><tbody id="ga-tb"></tbody></table></div></div>`);
             const res = await database.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.orderDesc('$createdAt'), Appwrite.Query.limit(100)]);
             document.getElementById('ga-tb').innerHTML = res.documents.map(d => `<tr style="border-bottom:1px solid #eee; padding:10px;"><td>${d.$id.slice(0,8)}</td><td>${d.students?.aadharName||'N/A'}</td><td>${d.status}</td></tr>`).join('');
        }
        
        // (Tool 1, 2, 3 logic follows same pattern as above)
    }
})();