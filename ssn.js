(async () => {
    // --- 1. LIBRARY CHECK & AUTO-LOADER ---
    if (!window.Appwrite) {
        console.log("Appwrite SDK missing. Injecting...");
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/appwrite@13.0.1";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // --- 2. SECURE ACCESS GATE ---
    const _uX = "c3NuZ2F0ZXBhc3M=";
    const _pX = "d2VhcmVub3RzbGF2ZXM=";

    const masterContainerId = 'ssn-master-integrated-suite';
    if (document.getElementById(masterContainerId)) document.getElementById(masterContainerId).remove();

    const modalIds = [
        'minimal-creator-modal', 'minimal-architect-modal', 'minimal-scanout-modal', 
        'minimal-scanin-modal', 'minimal-terminator-modal', 'authority-suite-modal', 
        'filtered-500-archive', 'live-activity-architect', 'history-fetcher-view',
        'profile-master-modal'
    ];

    // --- 3. SHARED UI STYLING ---
    const dashStyle = document.createElement('style');
    dashStyle.innerHTML = `
        #${masterContainerId} { 
            z-index: 2147483647; position: fixed; inset: 0; 
            display: flex; align-items: center; justify-content: center; 
            background: rgba(15, 23, 42, 0.94); font-family: sans-serif; 
        }
        .db-card { background: #ffffff; width: 520px; border-radius: 12px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid #e2e8f0; }
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
        .db-btn-full { grid-column: span 2; }
        #ssn-floating-home-btn {
            z-index: 2147483647; position: fixed; top: 20px; right: 20px;
            background: #4f46e5; color: white; padding: 12px 24px; border-radius: 50px;
            font-weight: bold; cursor: pointer; display: none; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            font-size: 13px; border: 2px solid white;
        }
        .v-card-full { background: #fff; width: 98%; max-width: 1350px; height: 85vh; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; }
        .v-header-fixed { padding: 15px 25px; border-bottom: 1px solid #ddd; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; }
        .v-table-box { flex: 1; overflow: auto; }
        .v-table { width: 100%; border-collapse: collapse; font-size: 11px; }
        .v-table th { position: sticky; top: 0; background: #f1f5f9; padding: 10px 8px; text-align: left; color: #475569; font-weight: bold; border-bottom: 2px solid #e2e8f0; z-index: 10; }
        .v-table td { padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
        .badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; display: inline-block; }
        .b-app { background: #dcfce7; color: #166534; } .b-rej { background: #fee2e2; color: #991b1b; } .b-exm { background: #f1f5f9; color: #475569; } .b-pen { background: #fef9c3; color: #854d0e; }
        .full-id-tag { font-family: monospace; color: #4f46e5; font-weight: bold; font-size: 10px; background: #f5f3ff; padding: 2px 6px; border-radius: 4px; }
        .h-act-btn { padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: bold; border: 1px solid #ddd; margin-right: 4px; transition: 0.2s; }
        .h-mod { background: #e0f2fe; color: #0369a1; } .h-del { background: #fee2e2; color: #b91c1c; }
        .pm-row { padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
        .pm-label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; display: block; }
        .pm-val { font-size: 13px; color: #1e293b; font-weight: 600; margin-top: 2px; }
    `;
    document.head.appendChild(dashStyle);

    // --- 4. BACKEND INIT ---
    const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
    const database = new Appwrite.Databases(client);

    // --- 5. NAVIGATION ---
    window.verifySsnLogin = () => {
        const u = document.getElementById('ssn-user').value;
        const p = document.getElementById('ssn-pass').value;
        if (btoa(u) === _uX && btoa(p) === _pX) {
            document.getElementById('db-login-sec').style.display = 'none';
            document.getElementById('db-grid-sec').style.display = 'grid';
        }
    };

    window.launchSsnTool = (index) => {
        document.getElementById(masterContainerId).style.display = 'none';
        document.getElementById('ssn-floating-home-btn').style.display = 'block';
        if (index === 1) runTool1(); if (index === 2) runTool2(); if (index === 3) runTool3();
        if (index === 4) runTool4(); if (index === 5) runTool5(); if (index === 6) runTool6();
        if (index === 7) runTool7(); if (index === 8) runTool8(); if (index === 9) runTool9();
        if (index === 10) runTool10();
    };

    window.returnToSsnHome = () => {
        modalIds.forEach(id => { if (document.getElementById(id)) document.getElementById(id).remove(); });
        document.getElementById(masterContainerId).style.display = 'flex';
        document.getElementById('ssn-floating-home-btn').style.display = 'none';
    };

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
                <button class="db-btn db-btn-main" onclick="window.launchSsnTool(10)">10. Profile Master</button>
                <button class="db-btn" onclick="window.launchSsnTool(9)">9. Live Activity</button>
                <button class="db-btn db-btn-full" onclick="document.getElementById('${masterContainerId}').remove()" style="color:#94a3b8; border:none; margin-top:10px;">EXIT TOOLS</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);

    // --- 6. TOOLS ---
    async function runTool1() {
        const userId = prompt("Enter Student User ID"); if (!userId) { window.returnToSsnHome(); return; }
        const modalId = 'history-fetcher-view';
        document.body.insertAdjacentHTML('beforeend', `<div id="${modalId}" style="z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.7);"><div class="v-card-full" style="font-family:sans-serif;"><div class="v-header-fixed"><div><strong id="h-title" style="font-size:16px;">Fetching History...</strong></div><button onclick="document.getElementById('${modalId}').remove(); window.returnToSsnHome();" style="padding:6px 12px; cursor:pointer; background:#fff; border:1px solid #ccc; border-radius:4px; font-weight:bold;">Close</button></div><div class="v-table-box"><table class="v-table"><thead><tr><th>REQUEST ID</th><th>TYPE</th><th>STATUS</th><th>TRAVEL DATES</th><th>ACTUAL SCANS</th><th>PLACE</th><th>ACTIONS</th></tr></thead><tbody id="h-tbody"></tbody></table></div></div></div>`);
        try {
            const res = await database.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.equal('students', userId), Appwrite.Query.orderDesc('$createdAt')]);
            const tbody = document.getElementById('h-tbody');
            if (res.documents.length === 0) { tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:50px;">No records.</td></tr>`; return; }
            document.getElementById('h-title').innerText = `History: ${res.documents[0].students?.aadharName || 'Unknown'} (${userId})`;
            window.hDel = async (id) => { if(!confirm("Permanently delete?")) return; try { await database.deleteDocument('ssndb', 'gatepassRequests', id); runTool1(); } catch(e) { alert(e.message); } };
            window.hMod = (id) => { document.getElementById(modalId).remove(); runTool3(id); };
            res.documents.forEach(d => { tbody.insertAdjacentHTML('beforeend', `<tr><td><span class="full-id-tag">${d.$id}</span></td><td style="font-weight:bold; color:#4338ca;">${d.requestType}</td><td><span class="badge b-app">${d.status.toUpperCase()}</span></td><td style="font-size:10px;">Out: ${new Date(d.startDate).toLocaleString('en-IN')}<br>In: ${new Date(d.endDate).toLocaleString('en-IN')}</td><td style="font-size:10px; color:#64748b;">Out: ${d.outTime ? new Date(d.outTime).toLocaleString('en-IN') : '---'}<br>In: ${d.inTime ? new Date(d.inTime).toLocaleString('en-IN') : '---'}</td><td style="font-weight:600;">${d.place}</td><td><button onclick="window.hMod('${d.$id}')" class="h-act-btn h-mod">Modify</button><button onclick="window.hDel('${d.$id}')" class="h-act-btn h-del">Delete</button></td></tr>`); });
        } catch (e) { alert(e.message); }
    }

    function runTool2() {
        (async () => {
            const modalId = 'minimal-creator-modal'; if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style'); style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .c-card { background: #fff; width: 420px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .c-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #eee; text-align: center; } .c-body { padding: 25px; } .c-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; } .c-btn { width: 100%; padding: 12px; margin-top: 15px; background: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .type-btn { width: 100%; padding: 12px; border: 1px solid #eee; margin-bottom: 8px; border-radius: 4px; cursor: pointer; text-align: left; font-size: 14px; background: #fff; font-weight: 600; color: #444; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; } .label { font-size: 11px; font-weight: bold; color: #666; text-transform: uppercase; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="c-card"><div class="c-header"><strong>New Pass Creator</strong></div><div id="c-content" class="c-body"></div><div style="padding: 0 25px 20px;"><button onclick="document.getElementById('${modalId}').remove(); window.returnToSsnHome();" style="background:none; border:none; color:#999; width:100%; margin-top:10px; cursor:pointer; font-size:11px;">CLOSE & ABORT</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            let state = { userId: '', type: '', place: '', purpose: '', startDate: '', endDate: '', outTime: null };
            window.move = (step) => {
                const view = document.getElementById('c-content');
                if (step === 1) view.innerHTML = `<label class="label">STUDENT USER ID</label><input type="text" id="in-uid" class="c-input" onkeyup="if(event.key==='Enter') window.move(2)"><button onclick="window.move(2)" class="c-btn">Continue</button>`;
                if (step === 2) { state.userId = document.getElementById('in-uid').value; if (!state.userId) return; const types = [{ db: 'weekendPass', label: '1. Weekend Pass' }, { db: 'eveningOutPass', label: '2. Evening Out Pass' }, { db: 'workingDayPass', label: '3. Working Day Pass' }, { db: 'holidayPass', label: '4. Holiday Pass' }]; view.innerHTML = `<label class="label">SELECT PASS CATEGORY</label><div style="margin-top:10px;">` + types.map(t => `<button onclick="window.setT('${t.db}')" class="type-btn">${t.label}</button>`).join('') + `</div>`; }
                if (step === 3) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<label class="label">LOCATION</label><input type="text" id="in-place" class="c-input"><label class="label" style="display:block; margin-top:10px;">PURPOSE</label><input type="text" id="in-purp" class="c-input"><div class="grid"><div><label class="label">OUT DATE</label><input type="date" id="d-d" value="${today}" class="c-input"></div><div><label class="label">OUT TIME</label><input type="time" id="d-t" value="09:00" class="c-input"></div></div><div class="grid"><div><label class="label">IN DATE</label><input type="date" id="r-d" value="${today}" class="c-input"></div><div><label class="label">IN TIME</label><input type="time" id="r-t" value="21:00" class="c-input"></div></div><button onclick="window.saveStep3()" class="c-btn">Next Step</button>`; }
                if (step === 4) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<div style="background:#fff9f0; padding:15px; border-radius:4px; text-align:center;"><strong style="font-size:14px; color:#856404;">Apply Manual Out-Scan?</strong><div class="grid"><input type="date" id="s-d" value="${today}" class="c-input"><input type="time" id="s-t" value="16:30" class="c-input"></div></div><button onclick="window.finish(true)" class="c-btn" style="background:#333;">Create with Scan</button><button onclick="window.finish(false)" class="c-btn" style="background:#6c757d;">Create without Scan</button>`; }
            };
            window.setT = (type) => { state.type = type; window.move(3); };
            window.saveStep3 = () => { const fmt = (d, t) => new Date(`${d}T${t}:00+05:30`).toISOString(); state.place = document.getElementById('in-place').value || "Home"; state.purpose = document.getElementById('in-purp').value || "Personal"; state.startDate = fmt(document.getElementById('d-d').value, document.getElementById('d-t').value); state.endDate = fmt(document.getElementById('r-d').value, document.getElementById('r-t').value); window.move(4); };
            window.finish = async (scan) => { if (scan) state.outTime = new Date(`${document.getElementById('s-d').value}T${document.getElementById('s-t').value}:00+05:30`).toISOString(); let finalData = { students: state.userId, requestType: state.type, place: state.place, purpose: state.purpose, startDate: state.startDate, endDate: state.endDate, outTime: state.outTime, inTime: null, status: 'approved', wardenApproval: 'approved', numberOfDays: 1 }; if (state.type === 'workingDayPass') { finalData.mentorApproval = 'approved'; finalData.supervisorApproval = 'exempted'; } else { finalData.mentorApproval = 'exempted'; finalData.supervisorApproval = 'approved'; } try { await database.createDocument('ssndb', 'gatepassRequests', 'unique()', finalData); document.getElementById(modalId).remove(); alert("Success!"); window.returnToSsnHome(); } catch (e) { alert(e.message); } };
            window.move(1);
        })();
    }

    function runTool3(directId = null) {
        (async () => {
            const modalId = 'minimal-architect-modal'; if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style'); style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.5); font-family: sans-serif; } .m-card { background: #fff; width: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #ccc; box-shadow: 0 4px 12px rgba(0,0,0,0.2); } .m-header { background: #f4f4f7; padding: 15px; border-bottom: 1px solid #ddd; text-align: center; } .m-body { padding: 20px; } .m-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; } .m-btn { width: 100%; padding: 12px; margin-top: 15px; background: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .type-opt { padding: 12px; border: 1px solid #eee; margin-bottom: 8px; border-radius: 4px; cursor: pointer; font-size: 14px; } .type-opt.current { border-color: #28a745; background: #f3faf5; font-weight: bold; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; } .label { font-size: 11px; font-weight: bold; color: #555; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="m-card"><div class="m-header"><strong>Gatepass Modifier</strong></div><div id="m-content" class="m-body"></div><div style="padding: 0 20px 20px;"><button onclick="document.getElementById('${modalId}').remove(); window.returnToSsnHome();" style="background:none; border:none; color:#666; width:100%; cursor:pointer; font-size:12px;">Cancel</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            let state = { id: '', doc: {}, payload: {} };
            window.nav = async (step, forcedId = null) => {
                const view = document.getElementById('m-content');
                if (step === 1) view.innerHTML = `<label class="label">REQUEST ID</label><input type="text" id="in-id" class="m-input" onkeyup="if(event.key==='Enter') window.nav(2)"><button onclick="window.nav(2)" class="m-btn">Fetch Data</button>`;
                if (step === 2) { state.id = forcedId || document.getElementById('in-id').value; if (!state.id) return; try { state.doc = await database.getDocument('ssndb', 'gatepassRequests', state.id); const types = [{ db: 'weekendPass', label: 'Weekend Pass' }, { db: 'eveningOutPass', label: 'Evening Out Pass' }, { db: 'workingDayPass', label: 'Working Day Pass' }, { db: 'holidayPass', label: 'Holiday Pass' }]; view.innerHTML = `<label class="label">SELECT TYPE</label><div style="margin-top:10px;">` + types.map(t => `<div onclick="window.setPass('${t.db}')" class="type-opt ${state.doc.requestType === t.db ? 'current' : ''}">${t.label}</div>`).join('') + `</div>`; } catch (e) { alert(e.message); window.nav(1); } }
                if (step === 3) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<label class="label">DESTINATION</label><input type="text" id="p-place" value="${state.doc.place || ''}" class="m-input"><label class="label" style="display:block; margin-top:10px;">PURPOSE</label><input type="text" id="p-purpose" value="${state.doc.purpose || ''}" class="m-input"><div class="grid"><div><label class="label">OUT DATE</label><input type="date" id="d-d" value="${today}" class="c-input"></div><div><label class="label">OUT TIME</label><input type="time" id="d-t" value="09:00" class="c-input"></div></div><div class="grid"><div><label class="label">IN DATE</label><input type="date" id="r-d" value="${today}" class="c-input"></div><div><label class="label">IN TIME</label><input type="time" id="r-t" value="21:00" class="c-input"></div></div><button onclick="window.saveMeta()" class="m-btn">Next Step</button>`; }
                if (step === 4) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<div style="background:#fff9f0; padding:15px; border-radius:4px;"><strong>Manual Out-Scan?</strong><div class="grid"><input type="date" id="s-d" value="${today}" class="m-input"><input type="time" id="s-t" value="16:30" class="m-input"></div></div><button onclick="window.finalize(true)" class="m-btn" style="background:#333;">Confirm with Scan</button><button onclick="window.finalize(false)" class="m-btn" style="background:#6c757d;">Confirm without Scan</button>`; }
            };
            window.setPass = (type) => { state.payload = { requestType: type, status: 'approved', wardenApproval: 'approved' }; if (type === 'workingDayPass') { state.payload.mentorApproval = 'approved'; state.payload.supervisorApproval = 'exempted'; } else { state.payload.mentorApproval = 'exempted'; state.payload.supervisorApproval = 'approved'; } window.nav(3); };
            window.saveMeta = () => { const fmt = (d, t) => new Date(`${d}T${t}:00+05:30`).toISOString(); state.payload.place = document.getElementById('p-place').value || "Home"; state.payload.purpose = document.getElementById('p-purpose').value || "Personal"; state.payload.startDate = fmt(document.getElementById('d-d').value, document.getElementById('d-t').value); state.payload.endDate = fmt(document.getElementById('r-d').value, document.getElementById('r-t').value); state.payload.outTime = null; state.payload.inTime = null; window.nav(4); };
            window.finalize = async (scan) => { if (scan) { state.payload.outTime = new Date(`${document.getElementById('s-d').value}T${document.getElementById('s-t').value}:00+05:30`).toISOString(); state.payload.inTime = null; } else { state.payload.outTime = null; state.payload.inTime = null; } try { await database.updateDocument('ssndb', 'gatepassRequests', state.id, state.payload); document.getElementById(modalId).remove(); alert("Pass updated."); window.returnToSsnHome(); } catch (e) { alert(e.message); window.nav(1); } };
            if(directId) window.nav(2, directId); else window.nav(1);
        })();
    }

    function runTool4() { (async () => { const reqId = prompt("Request ID for Scan-Out:"); if (!reqId) return; try { const ts = new Date(`${new Date().toISOString().split('T')[0]}T16:00:00+05:30`).toISOString(); await database.updateDocument('ssndb', 'gatepassRequests', reqId, { "outTime": ts, "status": "approved" }); alert("Success!"); } catch (e) { alert(e.message); } })(); }
    function runTool5() { (async () => { const reqId = prompt("Request ID for Scan-In:"); if (!reqId) return; try { const ts = new Date(`${new Date().toISOString().split('T')[0]}T20:30:00+05:30`).toISOString(); await database.updateDocument('ssndb', 'gatepassRequests', reqId, { "inTime": ts, "status": "approved" }); alert("Success!"); } catch (e) { alert(e.message); } })(); }
    function runTool6() { (async () => { const reqId = prompt("Request ID to DELETE:"); if (!reqId) return; try { await database.deleteDocument('ssndb', 'gatepassRequests', reqId); alert("Deleted."); } catch (e) { alert(e.message); } })(); }
    function runTool7() { (async () => { const reqId = prompt("ID for Authority Override:"); if (!reqId) return; try { await database.updateDocument('ssndb', 'gatepassRequests', reqId, { "mentorApproval": "approved", "supervisorApproval": "approved", "wardenApproval": "approved", "status": "approved" }); alert("Approved!"); } catch (e) { alert(e.message); } })(); }
    function runTool8() { (async () => { const modalId = 'filtered-500-archive'; if (document.getElementById(modalId)) document.getElementById(modalId).remove(); document.body.insertAdjacentHTML('beforeend', `<div id="${modalId}" style="z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.7);"><div class="v-card-full"><div class="v-header-fixed"><strong>Global Archive (Top 500)</strong><button onclick="document.getElementById('${modalId}').remove(); window.returnToSsnHome();">Close</button></div><div class="v-table-box"><table class="v-table"><thead><tr><th>REQUESTED ON</th><th>REQUEST ID</th><th>STUDENT</th><th>TYPE</th><th>TRAVEL</th><th>WARDEN</th></tr></thead><tbody id="v-tbody"></tbody></table></div></div></div>`); try { const res = await database.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.orderDesc('$createdAt'), Appwrite.Query.limit(500)]); document.getElementById('v-tbody').innerHTML = res.documents.map(d => `<tr><td>${new Date(d.$createdAt).toLocaleString('en-IN')}</td><td><span class="full-id-tag">${d.$id}</span></td><td>${d.students?.aadharName}</td><td>${d.requestType}</td><td>Out: ${new Date(d.startDate).toLocaleDateString()}</td><td>${d.wardenApproval}</td></tr>`).join(''); } catch (e) { } })(); }
    function runTool9() { (async () => { try { const res = await database.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.orderDesc('$updatedAt'), Appwrite.Query.limit(500)]); console.table(res.documents.map(d => ({ updated: new Date(d.$updatedAt).toLocaleString('en-IN'), id: d.$id, student: d.students?.aadharName, status: d.status, warden: d.wardenApproval }))); alert("Logs in console."); } catch (e) { } })(); }

    // 10. Profile Master
    function runTool10() {
        (async () => {
            const modalId = 'profile-master-modal'; if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style'); style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.6); font-family: sans-serif; } .p-card { background: #fff; width: 450px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); display: flex; flex-direction: column; max-height: 90vh; } .p-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #eee; text-align: center; font-weight: bold; } .p-body { padding: 20px; overflow-y: auto; flex: 1; } .p-input { width: 100%; padding: 8px 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 13px; outline: none; } .p-btn { width: 100%; padding: 12px; margin-top: 15px; background: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="p-card"><div class="p-header">Profile Master Architect</div><div id="p-content" class="p-body"><label style="font-size:10px; font-weight:bold; color:#777;">USER ID</label><input type="text" id="target-uid" class="p-input" onkeyup="if(event.key==='Enter') window.fetchP()"><button onclick="window.fetchP()" class="p-btn">Fetch Profile</button></div><div id="p-foot" style="padding: 0 20px 20px; display:none;"><button id="p-toggle" onclick="window.toggleP()" class="p-btn">Enable Edit Mode</button><button onclick="document.getElementById('${modalId}').remove(); window.returnToSsnHome();" style="border:none; background:none; color:#999; width:100%; margin-top:10px; cursor:pointer; font-size:11px;">CANCEL</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            let curD = null, editM = false;
            const sch = { "$createdAt": "Created At", "aadharName": "Name", "gender": "Gender", "rollNo": "Roll Number", "degree": "Degree", "department": "Department", "year": "Year", "institute": "Institute", "emailId": "Email ID", "mentorEmailId": "Mentor Mail ID", "studentMobile": "Student Number", "fatherNumber": "Father Number", "motherNumber": "Mother Number", "guardianNumber": "Guardian Number", "hostel": "Hostel", "hostelBlock": "Hostel Block", "roomNo": "Room No", "roomType": "Room Type" };
            window.fetchP = async () => { const id = document.getElementById('target-uid').value; try { curD = await database.getDocument('ssndb', 'students', id); window.renderP(); document.getElementById('p-foot').style.display = 'block'; } catch (e) { alert("Not found."); } };
            window.renderP = () => { let h = ''; Object.keys(sch).forEach(k => { let v = curD[k] || '---'; if (k === '$createdAt') v = new Date(v).toLocaleString('en-IN'); h += `<div class="pm-row"><label class="pm-label">${sch[k]}</label>${editM && k !== '$createdAt' ? `<input type="text" id="i-${k}" class="p-input" value="${curD[k] || ''}">` : `<div class="pm-val">${v}</div>`}</div>`; }); document.getElementById('p-content').innerHTML = h; };
            window.toggleP = () => { editM = !editM; const b = document.getElementById('p-toggle'); if (editM) { b.innerText = "SAVE CHANGES"; b.style.background = "#28a745"; window.renderP(); } else { window.saveP(); } };
            window.saveP = async () => { let up = {}; Object.keys(sch).forEach(k => { if (k !== '$createdAt') { const i = document.getElementById(`i-${k}`); if (i) up[k] = i.value; } }); try { curD = await database.updateDocument('ssndb', 'students', curD.$id, up); editM = false; document.getElementById('p-toggle').innerText = "Enable Edit Mode"; document.getElementById('p-toggle').style.background = "#0056b3"; window.renderP(); alert("Updated!"); } catch (e) { alert(e.message); } };
        })();
    }
})();