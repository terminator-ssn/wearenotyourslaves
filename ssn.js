(async () => {
    const masterContainerId = 'ssn-master-integrated-suite';
    if (document.getElementById(masterContainerId)) document.getElementById(masterContainerId).remove();
    
    const _uX = "c3NuZ2F0ZXBhc3M=";
    const _pX = "d2VhcmVub3RzbGF2ZXM=";

    const modalIds = [
        'minimal-creator-modal', 'minimal-architect-modal', 'minimal-scanout-modal', 
        'minimal-scanin-modal', 'minimal-terminator-modal', 'authority-suite-modal', 
        'filtered-500-archive', 'live-activity-architect', 'history-fetcher-view'
    ];

    // --- SHARED DASHBOARD STYLING ---
    const dashStyle = document.createElement('style');
    dashStyle.innerHTML = `
        #${masterContainerId} { 
            z-index: 2147483647; position: fixed; inset: 0; 
            display: flex; align-items: center; justify-content: center; 
            background: rgba(15, 23, 42, 0.92); font-family: sans-serif; 
        }
        .db-card { background: #ffffff; width: 480px; border-radius: 12px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid #e2e8f0; }
        .db-header { background: #4f46e5; padding: 25px; color: white; text-align: center; }
        .db-header h1 { margin: 0; font-size: 20px; letter-spacing: 1px; font-weight: 800; }
        .db-grid { display: none; grid-template-columns: 1fr 1fr; gap: 12px; padding: 25px; background: #f8fafc; }
        .db-login { display: flex; flex-direction: column; gap: 15px; padding: 30px; background: #ffffff; }
        .db-input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; box-sizing: border-box; outline: none; font-size: 14px; }
        .db-btn { 
            padding: 15px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; 
            cursor: pointer; font-size: 13px; font-weight: bold; color: #334155; text-align: center;
            transition: all 0.2s;
        }
        .db-btn:hover { border-color: #4f46e5; background: #f5f3ff; color: #4f46e5; transform: translateY(-2px); }
        .db-btn-main { background: #4f46e5; color: white; border: none; }
        .db-btn-main:hover { background: #4338ca; color: white; }
        .db-btn-full { grid-column: span 2; }
        
        #ssn-floating-home-btn {
            z-index: 2147483647; position: fixed; top: 20px; right: 20px;
            background: #4f46e5; color: white; padding: 12px 24px; border-radius: 50px;
            font-weight: bold; cursor: pointer; display: none; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            font-size: 13px; border: 2px solid white; font-family: sans-serif;
        }
    `;
    document.head.appendChild(dashStyle);

    // --- NAVIGATION FUNCTIONS ---
    window.verifySsnLogin = () => {
        const u = document.getElementById('ssn-user').value;
        const p = document.getElementById('ssn-pass').value;
        if (btoa(u) === _uX && btoa(p) === _pX) {
            document.getElementById('db-login-sec').style.display = 'none';
            document.getElementById('db-grid-sec').style.display = 'grid';
        } else { alert("Invalid Credentials"); }
    };

    window.launchSsnTool = (index) => {
        document.getElementById(masterContainerId).style.display = 'none';
        document.getElementById('ssn-floating-home-btn').style.display = 'block';
        if (index === 1) runTool1(); if (index === 2) runTool2(); if (index === 3) runTool3();
        if (index === 4) runTool4(); if (index === 5) runTool5(); if (index === 6) runTool6();
        if (index === 7) runTool7(); if (index === 8) runTool8(); if (index === 9) runTool9();
    };

    window.returnToSsnHome = () => {
        modalIds.forEach(id => { if (document.getElementById(id)) document.getElementById(id).remove(); });
        document.getElementById(masterContainerId).style.display = 'flex';
        document.getElementById('ssn-floating-home-btn').style.display = 'none';
    };

    // --- UI DASHBOARD ---
    const dashboardHTML = `
    <div id="ssn-floating-home-btn" onclick="window.returnToSsnHome()">🏠 BACK TO HOME</div>
    <div id="${masterContainerId}">
        <div class="db-card">
            <div class="db-header"><h1>SSN GATEPASS ARCHITECT</h1></div>
            <div id="db-login-sec" class="db-login">
                <input type="text" id="ssn-user" class="db-input" placeholder="User ID">
                <input type="password" id="ssn-pass" class="db-input" placeholder="Password" onkeyup="if(event.key==='Enter') window.verifySsnLogin()">
                <button class="db-btn db-btn-main" onclick="window.verifySsnLogin()">UNLOCK DASHBOARD</button>
            </div>
            <div id="db-grid-sec" class="db-grid">
                <button class="db-btn" onclick="window.launchSsnTool(1)">1. History Fetcher</button>
                <button class="db-btn" onclick="window.launchSsnTool(2)">2. New Pass Creator</button>
                <button class="db-btn" onclick="window.launchSsnTool(3)">3. Gatepass Modifier</button>
                <button class="db-btn" onclick="window.launchSsnTool(4)">4. Manual Scan-Out</button>
                <button class="db-btn" onclick="window.launchSsnTool(5)">5. Manual Scan-In</button>
                <button class="db-btn" onclick="window.launchSsnTool(6)">6. Delete Entry</button>
                <button class="db-btn" onclick="window.launchSsnTool(7)">7. Manual Approval</button>
                <button class="db-btn" onclick="window.launchSsnTool(8)">8. Overall History</button>
                <button class="db-btn db-btn-main db-btn-full" onclick="window.launchSsnTool(9)">9. Live Activity Monitor</button>
                <button class="db-btn db-btn-full" onclick="document.getElementById('${masterContainerId}').remove()" style="color:#94a3b8; border:none; margin-top:10px;">EXIT TOOLS</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);

    // ==========================================
    // 1. History Fetcher (UI INTEGRATED, LOGIC PRESERVED)
    // ==========================================
    async function runTool1() {
        const userId = prompt("Enter Student Digital ID:");
        if (!userId) { window.returnToSsnHome(); return; }
        const modalId = 'history-fetcher-view';
        const style = document.createElement('style');
        style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.7); font-family: sans-serif; } .v-card { background: #fff; width: 98%; max-width: 1350px; height: 85vh; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); } .v-header { padding: 15px 25px; border-bottom: 1px solid #ddd; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; } .v-body { flex: 1; overflow: auto; padding: 0; } .v-table { width: 100%; border-collapse: collapse; font-size: 11px; } .v-table th { position: sticky; top: 0; background: #f1f5f9; padding: 10px 8px; text-align: left; color: #475569; font-weight: bold; border-bottom: 2px solid #e2e8f0; z-index: 10; } .v-table td { padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; } .full-id { font-family: monospace; color: #4f46e5; font-weight: bold; font-size: 10px; background: #f5f3ff; padding: 2px 6px; border-radius: 4px; }`;
        document.head.appendChild(style);
        document.body.insertAdjacentHTML('beforeend', `<div id="${modalId}"><div class="v-card"><div class="v-header"><div><strong id="h-title" style="font-size:16px;">Fetching History...</strong></div><button onclick="document.getElementById('${modalId}').remove(); window.returnToSsnHome();" style="padding:6px 12px; cursor:pointer; background:#fff; border:1px solid #ccc; border-radius:4px; font-weight:bold;">Close</button></div><div class="v-body"><table class="v-table"><thead><tr><th>REQUEST ID</th><th>TYPE</th><th>STATUS</th><th>TRAVEL (OUT / IN)</th><th>ACTUAL SCANS</th><th>DESTINATION</th></tr></thead><tbody id="h-tbody"></tbody></table></div></div></div>`);

        try {
            const gClient = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const gDB = new Appwrite.Databases(gClient);
            const res = await gDB.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.equal('students', userId), Appwrite.Query.orderDesc('$createdAt')]);
            const tbody = document.getElementById('h-tbody');
            if (res.documents.length === 0) { tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:50px;">No records found.</td></tr>`; return; }
            const s = res.documents[0].students;
            document.getElementById('h-title').innerText = `History: ${s?.aadharName || 'Unknown'} (${userId})`;
            res.documents.forEach(d => {
                tbody.insertAdjacentHTML('beforeend', `<tr><td><span class="full-id">${d.$id}</span></td><td style="font-weight:bold; color:#4338ca;">${d.requestType}</td><td><span style="padding:2px 6px; background:#dcfce7; color:#166534; font-size:9px; font-weight:bold; border-radius:4px;">${d.status.toUpperCase()}</span></td><td>Out: ${new Date(d.startDate).toLocaleString('en-IN')}<br>In: ${new Date(d.endDate).toLocaleString('en-IN')}</td><td>Out: ${d.outTime ? new Date(d.outTime).toLocaleString('en-IN') : '---'}<br>In: ${d.inTime ? new Date(d.inTime).toLocaleString('en-IN') : '---'}</td><td>${d.place}</td></tr>`);
            });
        } catch (e) { alert(e.message); }
    }

    // ==========================================
    // 2. New Pass Creator
    // ==========================================
    function runTool2() {
        (async () => {
            const modalId = 'minimal-creator-modal'; if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style'); style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .c-card { background: #fff; width: 420px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .c-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #eee; text-align: center; } .c-body { padding: 25px; } .c-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; } .c-btn { width: 100%; padding: 12px; margin-top: 15px; background: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .type-btn { width: 100%; padding: 12px; border: 1px solid #eee; margin-bottom: 8px; border-radius: 4px; cursor: pointer; text-align: left; font-size: 14px; background: #fff; font-weight: 600; color: #444; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; } .label { font-size: 11px; font-weight: bold; color: #666; text-transform: uppercase; } .dot-box { display: flex; gap: 5px; justify-content: center; margin-top: 15px; } .dot { width: 30px; height: 4px; background: #eee; border-radius: 2px; transition: 0.3s; } .dot.active { background: #0056b3; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="c-card"><div class="c-header"><strong>New Pass Creator</strong></div><div id="c-content" class="c-body"></div><div style="padding: 0 25px 20px;"><div class="dot-box"><div id="d1" class="dot active"></div><div id="d2" class="dot"></div><div id="d3" class="dot"></div><div id="d4" class="dot"></div></div><button onclick="document.getElementById('${modalId}').remove()" style="background:none; border:none; color:#999; width:100%; margin-top:10px; cursor:pointer; font-size:11px;">CLOSE & ABORT</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let state = { userId: '', type: '', place: '', purpose: '', startDate: '', endDate: '', outTime: null };
            window.move = (step) => { const view = document.getElementById('c-content'); for(let i=1; i<=4; i++) if(document.getElementById(`d${i}`)) document.getElementById(`d${i}`).className = i <= step ? "dot active" : "dot"; if (step === 1) view.innerHTML = `<label class="label">STUDENT USER ID</label><input type="text" id="in-uid" class="c-input" onkeyup="if(event.key==='Enter') window.move(2)"><button onclick="window.move(2)" class="c-btn">Continue</button>`; if (step === 2) { state.userId = document.getElementById('in-uid').value; const types = [{ db: 'weekendPass', label: '1. Weekend Pass' }, { db: 'eveningOutPass', label: '2. Evening Out Pass' }, { db: 'workingDayPass', label: '3. Working Day Pass' }, { db: 'holidayPass', label: '4. Holiday Pass' }]; view.innerHTML = types.map(t => `<button onclick="window.setT('${t.db}')" class="type-btn">${t.label}</button>`).join(''); } if (step === 3) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<label class="label">DESTINATION</label><input type="text" id="in-place" class="c-input"><div class="grid"><div><label class="label">OUT DATE</label><input type="date" id="d-d" value="${today}" class="c-input"></div><div><label class="label">OUT TIME</label><input type="time" id="d-t" value="09:00" class="c-input"></div></div><button onclick="window.saveStep3()" class="c-btn">Next Step</button>`; } if (step === 4) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<div style="background:#fff9f0; padding:15px; text-align:center;"><strong style="font-size:14px; color:#856404;">Apply Manual Out-Scan?</strong><div class="grid"><input type="date" id="s-d" value="${today}" class="c-input"><input type="time" id="s-t" value="16:30" class="c-input"></div></div><button onclick="window.finish(true)" class="c-btn">Create with Scan</button><button onclick="window.finish(false)" class="c-btn">Create without Scan</button>`; } };
            window.setT = (type) => { state.type = type; window.move(3); };
            window.saveStep3 = () => { const fmt = (d, t) => new Date(`${d}T${t}:00+05:30`).toISOString(); state.place = document.getElementById('in-place').value || "Home"; state.startDate = fmt(document.getElementById('d-d').value, document.getElementById('d-t').value); state.endDate = state.startDate; window.move(4); };
            window.finish = async (scan) => { if (scan) state.outTime = new Date(`${document.getElementById('s-d').value}T${document.getElementById('s-t').value}:00+05:30`).toISOString(); let fD = { students: state.userId, requestType: state.type, place: state.place, purpose: "Personal", startDate: state.startDate, endDate: state.endDate, outTime: state.outTime, inTime: null, status: 'approved', wardenApproval: 'approved', numberOfDays: 1 }; if (state.type === 'workingDayPass') { fD.mentorApproval = 'approved'; fD.supervisorApproval = 'exempted'; } else { fD.mentorApproval = 'exempted'; fD.supervisorApproval = 'approved'; } try { await database.createDocument('ssndb', 'gatepassRequests', 'unique()', fD); document.getElementById(modalId).remove(); alert("Success!"); } catch (e) { alert(e.message); } }; window.move(1);
        })();
    }

    // ==========================================
    // 3 - 7. Admin Tools (Modifier, Scan, Authority, Delete)
    // ==========================================

    function runTool3() {
        (async () => {
            const modalId = 'minimal-architect-modal'; if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style'); style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.5); font-family: sans-serif; } .m-card { background: #fff; width: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #ccc; box-shadow: 0 4px 12px rgba(0,0,0,0.2); } .m-header { background: #f4f4f7; padding: 15px; border-bottom: 1px solid #ddd; text-align: center; } .m-body { padding: 20px; } .m-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; } .m-btn { width: 100%; padding: 12px; margin-top: 15px; background: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .m-btn-alt { background: none; border: none; color: #666; width: 100%; margin-top: 10px; cursor: pointer; font-size: 12px; } .type-opt { padding: 12px; border: 1px solid #eee; margin-bottom: 8px; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; justify-content: space-between; } .type-opt.current { border-color: #28a745; background: #f3faf5; color: #155724; font-weight: bold; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; } .label { font-size: 11px; font-weight: bold; color: #555; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="m-card"><div class="m-header"><strong>Gatepass Modifier</strong></div><div id="m-content" class="m-body"></div><div style="padding: 0 20px 20px;"><button onclick="document.getElementById('${modalId}').remove()" class="m-btn-alt">Cancel & Abort</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let state = { id: '', doc: {}, payload: {} };
            window.nav = async (step) => { const view = document.getElementById('m-content'); if (step === 1) view.innerHTML = `<label class="label">REQUEST ID</label><input type="text" id="in-id" class="m-input" onkeyup="if(event.key==='Enter') window.nav(2)"><button onclick="window.nav(2)" class="m-btn">Fetch Data</button>`; if (step === 2) { state.id = document.getElementById('in-id').value; try { state.doc = await database.getDocument('ssndb', 'gatepassRequests', state.id); const types = [{ db: 'weekendPass', label: 'Weekend Pass' }, { db: 'eveningOutPass', label: 'Evening Out Pass' }, { db: 'workingDayPass', label: 'Working Day Pass' }, { db: 'holidayPass', label: 'Holiday Pass' }]; view.innerHTML = types.map(t => `<div onclick="window.setPass('${t.db}')" class="type-opt ${state.doc.requestType === t.db ? 'current' : ''}">${t.label}</div>`).join(''); } catch (e) { alert(e.message); } } if (step === 3) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<label class="label">DESTINATION</label><input type="text" id="p-place" value="${state.doc.place || ''}" class="m-input"><div class="grid"><div><label class="label">OUT DATE</label><input type="date" id="d-d" value="${today}" class="m-input"></div><div><label class="label">OUT TIME</label><input type="time" id="d-t" value="09:00" class="m-input"></div></div><button onclick="window.saveMeta()" class="m-btn">Next Step</button>`; } if (step === 4) { view.innerHTML = `<button onclick="window.finalize(true)" class="m-btn">Update Pass</button>`; } };
            window.setPass = (type) => { state.payload = { requestType: type, status: 'approved', wardenApproval: 'approved' }; window.nav(3); };
            window.saveMeta = () => { const fmt = (d, t) => new Date(`${d}T${t}:00+05:30`).toISOString(); state.payload.place = document.getElementById('p-place').value || "Home"; state.payload.startDate = fmt(document.getElementById('d-d').value, document.getElementById('d-t').value); window.nav(4); };
            window.finalize = async () => { try { await database.updateDocument('ssndb', 'gatepassRequests', state.id, state.payload); document.getElementById(modalId).remove(); alert("Success!"); } catch (e) { alert(e.message); } }; window.nav(1);
        })();
    }

    function runTool4() {
        (async () => {
            const modalId = 'minimal-scanout-modal'; if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style'); style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .s-card { background: #fff; width: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .s-header { background: #fffcf5; padding: 15px; border-bottom: 1px solid #fceec7; text-align: center; color: #856404; } .s-body { padding: 25px; } .s-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; } .s-btn { width: 100%; padding: 12px; margin-top: 15px; background: #d97706; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-top: 8px; display: block; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="s-card"><div class="s-header"><strong>Manual Scan-Out</strong></div><div id="s-content" class="s-body"><label class="label">REQUEST ID</label><input type="text" id="target-id" class="s-input"><button onclick="window.verifyPass()" class="s-btn">Verify</button><button onclick="document.getElementById('${modalId}').remove()" style="background:none; border:none; color:#999; width:100%; cursor:pointer; font-size:11px; margin-top:10px;">Cancel</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let activeId = '';
            window.verifyPass = async () => { activeId = document.getElementById('target-id').value; try { const d = await database.getDocument('ssndb', 'gatepassRequests', activeId); const today = new Date().toISOString().split('T')[0]; document.getElementById('s-content').innerHTML = `<label class="label">Actual Departure</label><input type="date" id="act-d" value="${today}" class="s-input"><input type="time" id="act-t" value="16:00" class="s-input"><button onclick="window.recordExit()" class="s-btn">Confirm Scan-Out</button>`; } catch (e) { alert("ID not found."); } };
            window.recordExit = async () => { const ts = new Date(`${document.getElementById('act-d').value}T${document.getElementById('act-t').value}:00+05:30`).toISOString(); try { await database.updateDocument('ssndb', 'gatepassRequests', activeId, { "outTime": ts, "status": "approved" }); document.getElementById(modalId).remove(); alert("Success!"); } catch (e) { alert(e.message); } };
        })();
    }

    function runTool5() {
        (async () => {
            const modalId = 'minimal-scanin-modal'; if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style'); style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .si-card { background: #fff; width: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .si-header { background: #f6ffed; padding: 15px; border-bottom: 1px solid #b7eb8f; text-align: center; color: #389e0d; } .si-body { padding: 25px; } .si-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; } .si-btn { width: 100%; padding: 12px; margin-top: 15px; background: #52c41a; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="si-card"><div class="si-header"><strong>Manual Scan-In</strong></div><div id="si-content" class="si-body"><label style="font-size:10px; font-weight:bold; color:#64748b;">REQUEST ID</label><input type="text" id="target-id-in" class="si-input"><button onclick="window.verifyPassIn()" class="si-btn">Verify</button><button onclick="document.getElementById('${modalId}').remove()" style="background:none; border:none; color:#999; width:100%; cursor:pointer; font-size:11px; margin-top:10px;">Cancel</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let activeId = '';
            window.verifyPassIn = async () => { activeId = document.getElementById('target-id-in').value; try { const d = await database.getDocument('ssndb', 'gatepassRequests', activeId); const today = new Date().toISOString().split('T')[0]; document.getElementById('si-content').innerHTML = `<label style="font-size:10px; font-weight:bold; color:#64748b;">Actual Arrival</label><input type="date" id="act-d" value="${today}" class="si-input"><input type="time" id="act-t" value="20:30" class="si-input"><button onclick="window.recordArrival()" class="si-btn">Confirm Scan-In</button>`; } catch (e) { alert("ID not found."); } };
            window.recordArrival = async () => { const ts = new Date(`${document.getElementById('act-d').value}T${document.getElementById('act-t').value}:00+05:30`).toISOString(); try { await database.updateDocument('ssndb', 'gatepassRequests', activeId, { "inTime": ts, "status": "approved" }); document.getElementById(modalId).remove(); alert("Success!"); } catch (e) { alert(e.message); } };
        })();
    }

    function runTool6() {
        (async () => {
            const modalId = 'minimal-terminator-modal'; if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style'); style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .t-card { background: #fff; width: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .t-header { background: #fff5f5; padding: 15px; border-bottom: 1px solid #fed7d7; text-align: center; color: #c53030; } .t-body { padding: 25px; } .t-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; } .t-btn-danger { width: 100%; padding: 12px; margin-top: 15px; background: #c53030; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="t-card"><div class="t-header"><strong>Gatepass Terminator</strong></div><div id="t-content" class="t-body"><label style="font-size:11px; font-weight:bold; color:#718096;">REQUEST ID TO DELETE</label><input type="text" id="del-id" class="t-input"><button onclick="window.verifyTarget()" class="t-btn-danger">Fetch & Verify</button><button onclick="document.getElementById('${modalId}').remove()" style="background:none; border:none; color:#999; width:100%; cursor:pointer; font-size:11px; margin-top:10px;">Cancel</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let tId = '';
            window.verifyTarget = async () => { tId = document.getElementById('del-id').value; try { const d = await database.getDocument('ssndb', 'gatepassRequests', tId); document.getElementById('t-content').innerHTML = `<p>Pass Type: ${d.requestType}</p><button onclick="window.executePurge()" class="t-btn-danger">Confirm Permanent Deletion</button>`; } catch (e) { alert("ID not found."); } };
            window.executePurge = async () => { try { await database.deleteDocument('ssndb', 'gatepassRequests', tId); document.getElementById(modalId).remove(); alert("Deleted!"); } catch (e) { alert(e.message); } };
        })();
    }

    function runTool7() {
        (async () => {
            const modalId = 'authority-suite-modal'; if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style'); style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .as-card { background: #fff; width: 440px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .as-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #eee; text-align: center; color: #333; font-weight: bold; } .as-body { padding: 20px; } .as-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; } .as-btn-main { width: 100%; padding: 12px; margin-top: 15px; background: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .btn-group { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; } .opt-btn { padding: 8px 2px; font-size: 10px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: #fff; font-weight: bold; color: #777; } .opt-btn.active-app { background: #e6fffa; color: #088a68; border-color: #088a68; } .opt-btn.active-exm { background: #f7fafc; color: #4a5568; border-color: #4a5568; } .opt-btn.active-rej { background: #fff5f5; color: #c53030; border-color: #c53030; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="as-card"><div class="as-header">Manual Approval System</div><div id="as-content" class="as-body"><input type="text" id="target-id" class="as-input" placeholder="e.g. 694b..." onkeyup="if(event.key==='Enter') window.fetchDoc()"><button onclick="window.fetchDoc()" class="as-btn-main">Verify & Load</button><button onclick="document.getElementById('${modalId}').remove()" style="background:none; border:none; color:#999; width:100%; margin-top:10px; cursor:pointer; font-size:11px;">CANCEL</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let state = { id: '', doc: {}, mentor: '', supervisor: '', warden: '' };
            window.fetchDoc = async () => { state.id = document.getElementById('target-id').value; if (!state.id) return; try { state.doc = await database.getDocument('ssndb', 'gatepassRequests', state.id); state.mentor = state.doc.mentorApproval || 'pending'; state.supervisor = state.doc.supervisorApproval || 'pending'; state.warden = state.doc.wardenApproval || 'pending'; window.renderSuite(); } catch (e) { alert("ID not found."); } };
            window.renderSuite = () => { const roles = [{ key: 'mentor', label: '1. Staff Mentor' }, { key: 'supervisor', label: '2. Hostel Supervisor' }, { key: 'warden', label: '3. Main Warden' }]; document.getElementById('as-content').innerHTML = roles.map(r => `<div style="padding:10px 0; border-bottom:1px solid #f0f0f0;"><span>${r.label}</span><div class="btn-group"><button onclick="window.setLocal('${r.key}', 'approved')" class="opt-btn ${state[r.key] === 'approved' ? 'active-app' : ''}">Approve</button><button onclick="window.setLocal('${r.key}', 'exempted')" class="opt-btn ${state[r.key] === 'exempted' ? 'active-exm' : ''}">Exempt</button><button onclick="window.setLocal('${r.key}', 'rejected')" class="opt-btn ${state[r.key] === 'rejected' ? 'active-rej' : ''}">Reject</button></div></div>`).join('') + `<button onclick="window.applyChanges()" class="as-btn-main">Sync Authority Status</button>`; };
            window.setLocal = (r, v) => { state[r] = v; window.renderSuite(); };
            window.applyChanges = async () => { try { await database.updateDocument('ssndb', 'gatepassRequests', state.id, { mentorApproval: state.mentor, supervisorApproval: state.supervisor, wardenApproval: state.warden, status: 'approved' }); document.getElementById(modalId).remove(); alert("Success!"); } catch (e) { alert("Failed: " + e.message); } };
        })();
    }

    // ==========================================
    // 8. Overall Request History (VERBATIM CODE)
    // ==========================================
    function runTool8() {
        (async () => {
            const modalId = 'filtered-500-archive';
            if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style');
            style.innerHTML = `
                #${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.7); font-family: sans-serif; }
                .v-card { background: #fff; width: 98%; max-width: 1350px; height: 85vh; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .v-header { padding: 15px 25px; border-bottom: 1px solid #ddd; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; }
                .v-body { flex: 1; overflow: auto; padding: 0; }
                .v-table { width: 100%; border-collapse: collapse; font-size: 11px; }
                .v-table th { position: sticky; top: 0; background: #f1f5f9; padding: 10px 8px; text-align: left; color: #475569; font-weight: bold; border-bottom: 2px solid #e2e8f0; z-index: 10; }
                .v-table td { padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
                .badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; display: inline-block; }
                .b-app { background: #dcfce7; color: #166534; } .b-rej { background: #fee2e2; color: #991b1b; } .b-exm { background: #f1f5f9; color: #475569; } .b-pen { background: #fef9c3; color: #854d0e; }
                .full-id { font-family: monospace; color: #4f46e5; font-weight: bold; font-size: 10px; white-space: nowrap; }
                .filter-input { display: block; width: 100%; margin-top: 5px; padding: 4px 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 10px; font-weight: normal; outline: none; box-sizing: border-box; }
            `;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="v-card"><div class="v-header"><div><strong style="font-size:15px;">Overall Request (Recent 500)</strong><div id="v-status" style="font-size:11px; color:#64748b; font-weight:bold;">Initializing...</div></div><button onclick="document.getElementById('${modalId}').remove(); window.returnToSsnHome();" style="padding:6px 12px; cursor:pointer; background:#fff; border:1px solid #ccc; border-radius:4px; font-weight:bold;">Close</button></div><div class="v-body"><table class="v-table"><thead><tr><th style="min-width:130px;">REQUESTED ON<input type="text" id="f-date" placeholder="Search Date..." class="filter-input" onkeyup="window.applyVFilters()"></th><th>REQUEST ID</th><th>STUDENT NAME</th><th style="min-width:130px;">DEPARTMENT<input type="text" id="f-dept" placeholder="Search Dept..." class="filter-input" onkeyup="window.applyVFilters()"></th><th>TYPE</th><th>TRAVEL (OUT / IN)</th><th>MENTOR</th><th>SUPERVISOR</th><th>WARDEN</th></tr></thead><tbody id="v-tbody"></tbody></table></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            const getB = (s) => { const v = (s || 'pending').toLowerCase(); if (v === 'approved') return `<span class="badge b-app">Approved</span>`; if (v === 'rejected') return `<span class="badge b-rej">Rejected</span>`; if (v === 'exempted') return `<span class="badge b-exm">Exempted</span>`; return `<span class="badge b-pen">Pending</span>`; };
            const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '---';
            window.applyVFilters = () => { const dQ = document.getElementById('f-date').value.toLowerCase(); const deptQ = document.getElementById('f-dept').value.toLowerCase(); document.querySelectorAll('#v-tbody tr').forEach(row => { const matches = row.children[0].innerText.toLowerCase().includes(dQ) && row.children[3].innerText.toLowerCase().includes(deptQ); row.style.display = matches ? '' : 'none'; }); };
            let total = 0; async function fBatch(o) { try { const res = await database.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.orderDesc('$createdAt'), Appwrite.Query.limit(100), Appwrite.Query.offset(o)]); res.documents.forEach(d => { document.getElementById('v-tbody').insertAdjacentHTML('beforeend', `<tr><td style="color:#64748b; font-weight:600;">${fmt(d.$createdAt)}</td><td><span class="full-id">${d.$id}</span></td><td style="font-weight:bold;">${d.students?.aadharName || 'N/A'}</td><td style="font-weight:600; color:#64748b;">${d.students?.department || 'N/A'}</td><td style="font-weight:bold; color:#4338ca;">${d.requestType}</td><td style="font-size:10px;"><span style="color:#d97706;">Out: ${fmt(d.startDate)}</span><br><span style="color:#059669;">In: ${fmt(d.endDate)}</span></td><td>${getB(d.mentorApproval)}</td><td>${getB(d.supervisorApproval)}</td><td>${getB(d.wardenApproval)}</td></tr>`); }); total += res.documents.length; document.getElementById('v-status').innerText = `Retrieved ${total} records...`; if (total < 500 && total < res.total) setTimeout(() => fBatch(total), 50); else document.getElementById('v-status').innerHTML = `<span style="color:#16a34a;">✅ Load Complete: ${total} Total Records</span>`; } catch (e) {} } fBatch(0);
        })();
    }

    // ==========================================
    // 9. Live Activity Monitor (VERBATIM CODE)
    // ==========================================
    function runTool9() {
        (async () => {
            const modalId = 'live-activity-architect';
            if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style');
            style.innerHTML = `
                #${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.7); font-family: sans-serif; }
                .v-card { background: #fff; width: 98%; max-width: 1350px; height: 85vh; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .v-header { padding: 15px 25px; border-bottom: 1px solid #ddd; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; }
                .v-body { flex: 1; overflow: auto; }
                .v-table { width: 100%; border-collapse: collapse; font-size: 11px; }
                .v-table th { position: sticky; top: 0; background: #f1f5f9; padding: 12px 10px; text-align: left; color: #475569; font-weight: bold; border-bottom: 2px solid #e2e8f0; z-index: 10; }
                .v-table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
                .status-tag { padding: 4px 10px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 9px; display: inline-block; }
                .s-new { background: #e0f2fe; color: #0369a1; } .s-wait { background: #fef3c7; color: #92400e; } .s-app { background: #dcfce7; color: #166534; } .s-out { background: #ffedd5; color: #9a3412; } .s-back { background: #f3e8ff; color: #6b21a8; } .s-rej { background: #fee2e2; color: #991b1b; }
                .full-id { font-family: monospace; color: #4f46e5; font-weight: bold; font-size: 11px; background: #f5f3ff; padding: 2px 6px; border-radius: 4px; }
                .time-hint { font-size: 9px; color: #94a3b8; display: block; margin-top: 2px; font-weight: normal; }
            `;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="v-card"><div class="v-header"><div><strong style="font-size:16px;">Live Activity Monitor (Sorted by Update Time)</strong><div id="v-status-live" style="font-size:11px; color:#64748b;">Monitoring system-wide...</div></div><button onclick="document.getElementById('${modalId}').remove(); window.returnToSsnHome();" style="padding:6px 12px; cursor:pointer; background:#fff; border:1px solid #ccc; border-radius:4px; font-weight:bold;">Close</button></div><div class="v-body"><table class="v-table"><thead><tr><th>REQUEST ID</th><th>STUDENT NAME</th><th>DEPARTMENT</th><th>TYPE</th><th>TRAVEL DATES</th><th>CURRENT LIFECYCLE STATUS</th></tr></thead><tbody id="v-tbody-live"></tbody></table></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            async function fLive() { try { const res = await database.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.orderDesc('$updatedAt'), Appwrite.Query.limit(500)]); res.documents.forEach(d => { const upd = new Date(d.$updatedAt); const cre = new Date(d.$createdAt); let sH = ''; if (d.inTime) sH = `<span class="status-tag s-back">Returned</span><span class="time-hint">In: ${new Date(d.inTime).toLocaleString('en-IN')}</span>`; else if (d.outTime) sH = `<span class="status-tag s-out">Scanned Out</span><span class="time-hint">Out: ${new Date(d.outTime).toLocaleString('en-IN')}</span>`; else if (d.wardenApproval === 'approved') sH = `<span class="status-tag s-app">Approved</span><span class="time-hint">Awaiting Scan</span>`; else if (d.status === 'rejected' || d.wardenApproval === 'rejected') sH = `<span class="status-tag s-rej">Rejected</span>`; else { let pW = "Warden"; if (d.mentorApproval === 'pending') pW = "Mentor"; else if (d.supervisorApproval === 'pending') pW = "Supervisor"; const isN = Math.abs(upd - cre) < 5000; sH = isN ? `<span class="status-tag s-new">New Pass</span>` : `<span class="status-tag s-wait">Awaiting ${pW}</span>`; } document.getElementById('v-tbody-live').insertAdjacentHTML('beforeend', `<tr><td><span class="full-id">${d.$id}</span></td><td style="font-weight:bold;">${d.students?.aadharName || 'N/A'}</td><td style="color:#64748b; font-weight:600;">${d.students?.department || 'N/A'}</td><td style="font-weight:600; color:#4338ca;">${d.requestType}</td><td style="font-size:10px;">Out: ${new Date(d.startDate).toLocaleString('en-IN')}<br>In: ${new Date(d.endDate).toLocaleString('en-IN')}</td><td>${sH}<span class="time-hint" style="color:#6366f1; font-weight:bold;">Last Change: ${upd.toLocaleTimeString('en-IN')}</span></td></tr>`); }); document.getElementById('v-status-live').innerHTML = `<span style="color:#16a34a;">✅ Active</span>`; } catch (e) { } } fLive();
        })();
    }
})();
