(async () => {
    // --- 1. DYNAMIC SDK LOADER ---
    if (!window.Appwrite) {
        await new Promise((res) => {
            const s = document.createElement('script');
            s.src = "https://cdn.jsdelivr.net/npm/appwrite@17.0.0";
            s.onload = res;
            document.head.appendChild(s);
        });
    }

    // --- 2. CONFIGURATION ---
    const masterContainerId = 'ssn-master-suite-adapted';
    if (document.getElementById(masterContainerId)) document.getElementById(masterContainerId).remove();

    const client = new Appwrite.Client()
        .setEndpoint('https://hostelgatepass.ssn.edu.in/v1')
        .setProject('ssn-gatepass-1');
    const database = new Appwrite.Databases(client);

    const modalIds = ['minimal-creator-modal', 'minimal-architect-modal', 'minimal-scanout-modal', 'minimal-scanin-modal', 'minimal-terminator-modal', 'authority-suite-modal', 'filtered-500-archive', 'live-activity-architect', 'history-fetcher-view', 'profile-master-modal'];

    // --- 3. UI STYLING ---
    const style = document.createElement('style');
    style.innerHTML = `
        #${masterContainerId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.9); font-family: sans-serif; }
        .db-card { background: #fff; width: 500px; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); border: 1px solid #ddd; }
        .db-header { background: #1e293b; padding: 20px; color: #fff; text-align: center; }
        .db-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 20px; background: #f8fafc; }
        .db-btn { padding: 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; color: #334155; transition: 0.2s; }
        .db-btn:hover { border-color: #4f46e5; color: #4f46e5; background: #f5f3ff; }
        .db-btn-main { background: #4f46e5; color: #fff; border: none; grid-column: span 2; }
        #ssn-home-btn { z-index: 2147483647; position: fixed; top: 15px; right: 15px; background: #1e293b; color: #fff; padding: 10px 20px; border-radius: 50px; font-weight: bold; cursor: pointer; display: none; font-size: 12px; border: 1px solid #fff; }
        .v-card-full { background: #fff; width: 98%; max-width: 1300px; height: 85vh; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; }
        .v-header-fixed { padding: 15px 25px; border-bottom: 1px solid #ddd; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; }
        .v-table-box { flex: 1; overflow: auto; }
        .v-table { width: 100%; border-collapse: collapse; font-size: 11px; }
        .v-table th { position: sticky; top: 0; background: #f1f5f9; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; z-index: 10; }
        .v-table td { padding: 8px; border-bottom: 1px solid #eee; }
        .badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; background: #eee; }
        .h-act-btn { padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: bold; border: 1px solid #ddd; margin-right: 4px; }
    `;
    document.head.appendChild(style);

    // --- 4. NAVIGATION ---
    window.launchTool = (i) => {
        document.getElementById(masterContainerId).style.display = 'none';
        document.getElementById('ssn-home-btn').style.display = 'block';
        const tools = [runT1, runT2, runT3, runT4, runT5, runT6, runT7, runT8, runT9, runT10];
        tools[i-1]();
    };

    window.returnToHome = () => {
        modalIds.forEach(id => { if (document.getElementById(id)) document.getElementById(id).remove(); });
        document.getElementById(masterContainerId).style.display = 'flex';
        document.getElementById('ssn-home-btn').style.display = 'none';
    };

    const dashboardHTML = `
    <div id="ssn-home-btn" onclick="window.returnToHome()">🏠 DASHBOARD</div>
    <div id="${masterContainerId}">
        <div class="db-card">
            <div class="db-header"><strong style="font-size:16px;">GATEPASS ARCHITECT v10.0</strong></div>
            <div class="db-grid">
                <button class="db-btn" onclick="window.launchTool(1)">1. History Fetcher</button>
                <button class="db-btn" onclick="window.launchTool(2)">2. New Pass Creator</button>
                <button class="db-btn" onclick="window.launchTool(3)">3. Pass Modifier</button>
                <button class="db-btn" onclick="window.launchTool(4)">4. Scan-Out</button>
                <button class="db-btn" onclick="window.launchTool(5)">5. Scan-In</button>
                <button class="db-btn" onclick="window.launchTool(6)">6. Delete Request</button>
                <button class="db-btn" onclick="window.launchTool(7)">7. Manual Approval</button>
                <button class="db-btn" onclick="window.launchTool(8)">8. Overall History</button>
                <button class="db-btn db-btn-main" onclick="window.launchTool(10)">10. Profile Master Architect</button>
                <button class="db-btn db-btn-main" onclick="window.launchTool(9)">9. Live Activity Monitor</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);

    // --- 5. TOOL DEFINITIONS ---

    // Tool 1: History Fetcher
    async function runT1() {
        const uid = prompt("User ID:"); if(!uid) return window.returnToHome();
        const mId = 'history-fetcher-view';
        document.body.insertAdjacentHTML('beforeend', `<div id="${mId}" style="z-index:2147483647; position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.7);"><div class="v-card-full"><div class="v-header-fixed"><strong>Student History</strong><button onclick="window.returnToHome()">Close</button></div><div class="v-table-box"><table class="v-table"><thead><tr><th>ID</th><th>TYPE</th><th>STATUS</th><th>DATES</th><th>SCANS</th><th>ACTIONS</th></tr></thead><tbody id="h-tbody"></tbody></table></div></div></div>`);
        try {
            const res = await database.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.equal('students', uid), Appwrite.Query.orderDesc('$createdAt')]);
            const tb = document.getElementById('h-tbody');
            window.hD = async (id) => { if(confirm("Delete?")) { await database.deleteDocument('ssndb', 'gatepassRequests', id); runT1(); } };
            window.hM = (id) => { document.getElementById(mId).remove(); runT3(id); };
            res.documents.forEach(d => { tb.insertAdjacentHTML('beforeend', `<tr><td>${d.$id.slice(0,8)}</td><td>${d.requestType}</td><td>${d.status}</td><td>Out: ${new Date(d.startDate).toLocaleDateString()}<br>In: ${new Date(d.endDate).toLocaleDateString()}</td><td>O: ${d.outTime?'Yes':'No'}<br>I: ${d.inTime?'Yes':'No'}</td><td><button onclick="window.hM('${d.$id}')" class="h-act-btn">Mod</button><button onclick="window.hD('${d.$id}')" class="h-act-btn">Del</button></td></tr>`); });
        } catch (e) { alert(e.message); }
    }

    // Tool 2: Creator
    function runT2() {
        (async () => {
            const mId = 'minimal-creator-modal';
            document.body.insertAdjacentHTML('beforeend', `<div id="${mId}" style="z-index:2147483647; position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.6);"><div style="background:#fff; width:400px; padding:20px; border-radius:8px;"><strong>Creator</strong><br><br><input type="text" id="c-uid" placeholder="User ID" style="width:100%; padding:10px; margin-bottom:10px;"><button onclick="window.execC()" style="width:100%; padding:10px; background:#4f46e5; color:#fff; border:none; border-radius:4px; cursor:pointer;">Generate Pass</button><button onclick="window.returnToHome()" style="width:100%; margin-top:10px; background:none; border:none; color:#999; cursor:pointer;">Cancel</button></div></div>`);
            window.execC = async () => {
                const uid = document.getElementById('c-uid').value;
                const payload = { students: uid, requestType: 'weekendPass', startDate: new Date().toISOString(), endDate: new Date(Date.now()+86400000).toISOString(), status: 'approved', wardenApproval: 'approved', mentorApproval: 'exempted', supervisorApproval: 'approved' };
                try { await database.createDocument('ssndb', 'gatepassRequests', 'unique()', payload); alert("Pass Created!"); window.returnToHome(); } catch(e) { alert(e.message); }
            };
        })();
    }

    // Tool 3: Modifier
    function runT3(directId = null) {
        (async () => {
            const mId = 'minimal-architect-modal';
            document.body.insertAdjacentHTML('beforeend', `<div id="${mId}" style="z-index:2147483647; position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.6);"><div style="background:#fff; width:400px; padding:20px; border-radius:8px;" id="mod-cont"><strong>Modifier</strong><br><br><input type="text" id="m-id" placeholder="Request ID" style="width:100%; padding:10px;"><button onclick="window.execM()" style="width:100%; padding:10px; background:#4f46e5; color:#fff; border:none; border-radius:4px; margin-top:10px;">Load & Reset Scans</button></div></div>`);
            if(directId) document.getElementById('m-id').value = directId;
            window.execM = async () => {
                const id = document.getElementById('m-id').value;
                try { await database.updateDocument('ssndb', 'gatepassRequests', id, { outTime: null, inTime: null, status: 'approved' }); alert("Scans Reset!"); window.returnToHome(); } catch(e) { alert(e.message); }
            };
        })();
    }

    // Tools 4-7: Scans & Approvals
    function runT4() { const id = prompt("Request ID:"); if(id) database.updateDocument('ssndb', 'gatepassRequests', id, { outTime: new Date().toISOString() }).then(() => alert("Marked Out")); }
    function runT5() { const id = prompt("Request ID:"); if(id) database.updateDocument('ssndb', 'gatepassRequests', id, { inTime: new Date().toISOString() }).then(() => alert("Marked In")); }
    function runT6() { const id = prompt("Request ID:"); if(id) database.deleteDocument('ssndb', 'gatepassRequests', id).then(() => alert("Deleted")); }
    function runT7() { const id = prompt("Request ID:"); if(id) database.updateDocument('ssndb', 'gatepassRequests', id, { wardenApproval: 'approved', status: 'approved' }).then(() => alert("Approved")); }

    // Tool 8: Overall History
    async function runT8() {
        const mId = 'filtered-500-archive';
        document.body.insertAdjacentHTML('beforeend', `<div id="${mId}" style="z-index:2147483647; position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.7);"><div class="v-card-full"><div class="v-header-fixed"><strong>Global History</strong><button onclick="window.returnToHome()">Close</button></div><div class="v-table-box"><table class="v-table"><thead><tr><th>REQ ON</th><th>ID</th><th>STUDENT</th><th>STATUS</th></tr></thead><tbody id="ga-tbody"></tbody></table></div></div></div>`);
        try {
            const res = await database.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.orderDesc('$createdAt'), Appwrite.Query.limit(100)]);
            document.getElementById('ga-tbody').innerHTML = res.documents.map(d => `<tr><td>${new Date(d.$createdAt).toLocaleDateString()}</td><td>${d.$id.slice(0,8)}</td><td>${d.students?.aadharName || 'N/A'}</td><td>${d.status}</td></tr>`).join('');
        } catch(e) {}
    }

    // Tool 9: Live Activity
    async function runT9() {
        try {
            const res = await database.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.orderDesc('$updatedAt'), Appwrite.Query.limit(50)]);
            console.table(res.documents.map(d => ({ updated: d.$updatedAt, id: d.$id, student: d.students?.aadharName, status: d.status })));
            alert("Live Logs printed to Console.");
        } catch(e) {}
    }

    // Tool 10: Profile Master (Minimalist)
    function runT10() {
        (async () => {
            const mId = 'profile-master-modal';
            document.body.insertAdjacentHTML('beforeend', `<div id="${mId}" style="z-index:2147483647; position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.6);"><div class="v-card-full" style="max-width:500px; height:auto; max-height:80vh;"><div class="v-header-fixed"><strong>Profile Master</strong><button onclick="window.returnToHome()">X</button></div><div id="p-cont" style="padding:20px; overflow-y:auto;"><input type="text" id="p-uid" placeholder="User ID" style="width:100%; padding:10px;"><button onclick="window.loadP()" style="width:100%; padding:10px; background:#4f46e5; color:#fff; border:none; margin-top:10px; border-radius:4px; cursor:pointer;">Load Profile</button></div><div id="p-footer" style="padding:20px; display:none;"><button id="p-edit-btn" onclick="window.toggleEdit()" style="width:100%; padding:10px; background:#28a745; color:#fff; border:none; border-radius:4px; cursor:pointer;">Edit Mode</button></div></div></div>`);
            let cd = null, em = false;
            const s = { "aadharName": "Name", "rollNo": "Roll", "emailId": "Email", "mentorEmailId": "Mentor", "studentMobile": "Phone", "fatherNumber": "Father", "motherNumber": "Mother", "hostelBlock": "Block", "roomNo": "Room" };
            window.loadP = async () => { const id = document.getElementById('p-uid').value; try { cd = await database.getDocument('ssndb', 'students', id); window.renderP(); document.getElementById('p-footer').style.display = 'block'; } catch (e) { alert("Not found"); } };
            window.renderP = () => { let h = ''; Object.keys(s).forEach(k => { h += `<div class="pm-row"><label class="pm-label">${s[k]}</label>${em ? `<input type="text" id="i-${k}" value="${cd[k]||''}" style="width:100%; padding:5px; margin-top:5px; border:1px solid #ccc;">` : `<div class="pm-val">${cd[k]||'---'}</div>`}</div>`; }); document.getElementById('p-cont').innerHTML = h; };
            window.toggleEdit = async () => { if(!em) { em = true; document.getElementById('p-edit-btn').innerText = "Save Changes"; window.renderP(); } else { let up = {}; Object.keys(s).forEach(k => { up[k] = document.getElementById(`i-${k}`).value; }); await database.updateDocument('ssndb', 'students', cd.$id, up); em = false; document.getElementById('p-edit-btn').innerText = "Edit Mode"; alert("Updated!"); window.loadP(); } };
        })();
    }

})();