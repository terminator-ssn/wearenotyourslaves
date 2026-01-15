(async () => {
    const masterContainerId = 'ssn-master-integrated-suite';
    if (document.getElementById(masterContainerId)) document.getElementById(masterContainerId).remove();

    // List of modal IDs from your original code to handle navigation
    const modalIds = [
        'minimal-creator-modal',
        'minimal-architect-modal',
        'minimal-scanout-modal',
        'minimal-scanin-modal',
        'minimal-terminator-modal',
        'authority-suite-modal',
        'filtered-500-archive',
        'live-activity-architect'
    ];

    // --- DASHBOARD STYLING ---
    const dashStyle = document.createElement('style');
    dashStyle.innerHTML = `
        #${masterContainerId} { 
            z-index: 2147483647; position: fixed; inset: 0; 
            display: flex; align-items: center; justify-content: center; 
            background: rgba(15, 23, 42, 0.9); font-family: sans-serif; 
        }
        .db-card { background: #ffffff; width: 500px; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); border: 1px solid #e2e8f0; }
        .db-header { background: #4f46e5; padding: 20px; color: white; text-align: center; }
        .db-header h1 { margin: 0; font-size: 20px; letter-spacing: 1px; }
        .db-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 25px; background: #f8fafc; }
        .db-btn { 
            padding: 15px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; 
            cursor: pointer; font-size: 13px; font-weight: bold; color: #334155; text-align: center;
            transition: all 0.2s;
        }
        .db-btn:hover { border-color: #4f46e5; background: #f5f3ff; color: #4f46e5; transform: translateY(-2px); }
        .db-btn-full { grid-column: span 2; background: #4f46e5; color: white; border: none; }
        .db-btn-full:hover { background: #4338ca; color: white; }
        
        #ssn-floating-home-btn {
            z-index: 2147483647; position: fixed; top: 20px; right: 20px;
            background: #4f46e5; color: white; padding: 12px 24px; border-radius: 50px;
            font-weight: bold; cursor: pointer; display: none; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            font-size: 13px; border: 2px solid white; font-family: sans-serif;
        }
    `;
    document.head.appendChild(dashStyle);

    // --- NAVIGATION FUNCTIONS ---
    window.launchSsnTool = (index) => {
        document.getElementById(masterContainerId).style.display = 'none';
        document.getElementById('ssn-floating-home-btn').style.display = 'block';
        
        if (index === 1) runTool1();
        if (index === 2) runTool2();
        if (index === 3) runTool3();
        if (index === 4) runTool4();
        if (index === 5) runTool5();
        if (index === 6) runTool6();
        if (index === 7) runTool7();
        if (index === 8) runTool8();
        if (index === 9) runTool9();
    };

    window.returnToSsnHome = () => {
        modalIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
        document.getElementById(masterContainerId).style.display = 'flex';
        document.getElementById('ssn-floating-home-btn').style.display = 'none';
    };

    // --- DASHBOARD UI ---
    const dashboardHTML = `
    <div id="ssn-floating-home-btn" onclick="window.returnToSsnHome()">🏠 BACK TO HOME</div>
    <div id="${masterContainerId}">
        <div class="db-card">
            <div class="db-header"><h1>SSN GATEPASS TOOLS</h1></div>
            <div class="db-grid">
                <button class="db-btn" onclick="window.launchSsnTool(1)">1. History Fetcher</button>
                <button class="db-btn" onclick="window.launchSsnTool(2)">2. New Pass Creator</button>
                <button class="db-btn" onclick="window.launchSsnTool(3)">3. Gatepass Modifier</button>
                <button class="db-btn" onclick="window.launchSsnTool(4)">4. Manual Scan-Out</button>
                <button class="db-btn" onclick="window.launchSsnTool(5)">5. Manual Scan-In</button>
                <button class="db-btn" onclick="window.launchSsnTool(6)">6. Delete Entry</button>
                <button class="db-btn" onclick="window.launchSsnTool(7)">7. Manual Approval</button>
                <button class="db-btn" onclick="window.launchSsnTool(8)">8. Overall History</button>
                <button class="db-btn db-btn-full" onclick="window.launchSsnTool(9)">9. Live Activity Monitor</button>
            </div>
            <div style="padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
                <button onclick="document.getElementById('${masterContainerId}').remove()" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:11px; font-weight:bold;">CLOSE DASHBOARD</button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', dashboardHTML);

    // ==========================================
    // 1. History Fetcher
    // ==========================================
    function runTool1() {
        (async () => {
            const userId = prompt("Enter Student User ID (e.g., 2430094):");
            if (!userId) { window.returnToSsnHome(); return; }
            console.log("%c 🛰️ INITIALIZING SECURE FETCH...", "color: #4f46e5; font-weight: bold;");
            try {
                const gClient = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
                const gDB = new Appwrite.Databases(gClient);
                const res = await gDB.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.equal('students', userId), Appwrite.Query.orderDesc('$createdAt')]);
                if (res.documents.length === 0) return console.error("%c ❌ No records found.", "color: red;");
                const first = res.documents[0];
                console.log(`%c 📋 GATEPASS HISTORY FOR: ${first.students?.aadharName || "Unknown"} `, "color: white; background: #4f46e5; padding: 5px; font-weight: bold;");
                console.table(res.documents.map(d => ({ id: d.$id, type: d.requestType, status: d.status, reqOut: d.startDate ? new Date(d.startDate).toLocaleString('en-IN') : "N/A", reqIn: d.endDate ? new Date(d.endDate).toLocaleString('en-IN') : "N/A", actualOut: d.outTime ? new Date(d.outTime).toLocaleString('en-IN') : "---", actualIn: d.inTime ? new Date(d.inTime).toLocaleString('en-IN') : "---", warden: d.wardenApproval, destination: d.place })));
                alert("History loaded in Console (Press F12)");
            } catch (e) { console.error("Error:", e.message); }
        })();
    }

    // ==========================================
    // 2. New Pass Creator
    // ==========================================
    function runTool2() {
        (async () => {
            const modalId = 'minimal-creator-modal';
            if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style');
            style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .c-card { background: #fff; width: 420px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .c-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #eee; text-align: center; } .c-body { padding: 25px; } .c-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; } .c-input:focus { border-color: #0056b3; } .c-btn { width: 100%; padding: 12px; margin-top: 15px; background: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .c-btn:hover { background: #004494; } .type-btn { width: 100%; padding: 12px; border: 1px solid #eee; margin-bottom: 8px; border-radius: 4px; cursor: pointer; text-align: left; font-size: 14px; background: #fff; font-weight: 600; color: #444; } .type-btn:hover { border-color: #0056b3; background: #f0f7ff; color: #0056b3; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; } .label { font-size: 11px; font-weight: bold; color: #666; text-transform: uppercase; } .dot-box { display: flex; gap: 5px; justify-content: center; margin-top: 15px; } .dot { width: 30px; height: 4px; background: #eee; border-radius: 2px; transition: 0.3s; } .dot.active { background: #0056b3; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="c-card"><div class="c-header"><strong>New Pass Creator</strong></div><div id="c-content" class="c-body"></div><div style="padding: 0 25px 20px;"><div class="dot-box"><div id="d1" class="dot active"></div><div id="d2" class="dot"></div><div id="d3" class="dot"></div><div id="d4" class="dot"></div></div><button onclick="document.getElementById('${modalId}').remove()" style="background:none; border:none; color:#999; width:100%; margin-top:10px; cursor:pointer; font-size:11px;">CLOSE & ABORT</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let state = { userId: '', type: '', place: '', purpose: '', startDate: '', endDate: '', outTime: null };
            window.move = (step) => {
                const view = document.getElementById('c-content');
                for(let i=1; i<=4; i++) if(document.getElementById(`d${i}`)) document.getElementById(`d${i}`).className = i <= step ? "dot active" : "dot";
                if (step === 1) view.innerHTML = `<label class="label">STUDENT USER ID</label><input type="text" id="in-uid" class="c-input" placeholder="e.g. 2430xxx" onkeyup="if(event.key==='Enter') window.move(2)"><button onclick="window.move(2)" class="c-btn">Continue</button>`;
                if (step === 2) { state.userId = document.getElementById('in-uid').value; if (!state.userId) return; const types = [{ db: 'weekendPass', label: '1. Weekend Pass' }, { db: 'eveningOutPass', label: '2. Evening Out Pass' }, { db: 'workingDayPass', label: '3. Working Day Pass' }, { db: 'holidayPass', label: '4. Holiday Pass' }]; view.innerHTML = `<label class="label">SELECT PASS CATEGORY</label><div style="margin-top:10px;">` + types.map(t => `<button onclick="window.setT('${t.db}')" class="type-btn">${t.label}</button>`).join('') + `</div>`; }
                if (step === 3) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<label class="label">LOCATION / DESTINATION</label><input type="text" id="in-place" class="c-input" placeholder="Enter destination"><label class="label" style="display:block; margin-top:10px;">PURPOSE</label><input type="text" id="in-purp" class="c-input" placeholder="Enter purpose"><div class="grid"><div><label class="label">OUT DATE</label><input type="date" id="d-d" value="${today}" class="c-input"></div><div><label class="label">OUT TIME</label><input type="time" id="d-t" value="09:00" class="c-input"></div></div><div class="grid"><div><label class="label">IN DATE</label><input type="date" id="r-d" value="${today}" class="c-input"></div><div><label class="label">IN TIME</label><input type="time" id="r-t" value="21:00" class="c-input"></div></div><button onclick="window.saveStep3()" class="c-btn">Next Step</button>`; }
                if (step === 4) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<div style="background:#fff9f0; padding:15px; border-radius:4px; border:1px solid #ffeeba; text-align:center;"><strong style="font-size:14px; color:#856404;">Apply Manual Out-Scan?</strong><div class="grid"><input type="date" id="s-d" value="${today}" class="c-input"><input type="time" id="s-t" value="16:30" class="c-input"></div></div><button onclick="window.finish(true)" class="c-btn" style="background:#333;">Create with Scan</button><button onclick="window.finish(false)" class="c-btn" style="background:#6c757d;">Create without Scan</button>`; }
            };
            window.setT = (type) => { state.type = type; window.move(3); };
            window.saveStep3 = () => { const fmt = (d, t) => new Date(`${d}T${t}:00+05:30`).toISOString(); state.place = document.getElementById('in-place').value || "Home"; state.purpose = document.getElementById('in-purp').value || "Personal"; state.startDate = fmt(document.getElementById('d-d').value, document.getElementById('d-t').value); state.endDate = fmt(document.getElementById('r-d').value, document.getElementById('r-t').value); window.move(4); };
            window.finish = async (scan) => { if (scan) state.outTime = new Date(`${document.getElementById('s-d').value}T${document.getElementById('s-t').value}:00+05:30`).toISOString(); let finalData = { students: state.userId, requestType: state.type, place: state.place, purpose: state.purpose, startDate: state.startDate, endDate: state.endDate, outTime: state.outTime, inTime: null, status: 'approved', wardenApproval: 'approved', numberOfDays: 1 }; if (state.type === 'workingDayPass') { finalData.mentorApproval = 'approved'; finalData.supervisorApproval = 'exempted'; } else { finalData.mentorApproval = 'exempted'; finalData.supervisorApproval = 'approved'; } try { await database.createDocument('ssndb', 'gatepassRequests', 'unique()', finalData); document.getElementById(modalId).remove(); alert("Success! New pass has been generated."); } catch (e) { alert("Failed: " + e.message); } };
            window.move(1);
        })();
    }

    // ==========================================
    // 3. Gatepass Modifier
    // ==========================================
    function runTool3() {
        (async () => {
            const modalId = 'minimal-architect-modal';
            if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style');
            style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.5); font-family: sans-serif; } .m-card { background: #fff; width: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #ccc; box-shadow: 0 4px 12px rgba(0,0,0,0.2); } .m-header { background: #f4f4f7; padding: 15px; border-bottom: 1px solid #ddd; text-align: center; } .m-body { padding: 20px; } .m-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; } .m-btn { width: 100%; padding: 12px; margin-top: 15px; background: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .m-btn:hover { background: #004494; } .m-btn-alt { background: none; border: none; color: #666; width: 100%; margin-top: 10px; cursor: pointer; font-size: 12px; } .type-opt { padding: 12px; border: 1px solid #eee; margin-bottom: 8px; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; justify-content: space-between; } .type-opt:hover { border-color: #0056b3; background: #f0f7ff; } .type-opt.current { border-color: #28a745; background: #f3faf5; color: #155724; font-weight: bold; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; } .label { font-size: 11px; font-weight: bold; color: #555; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="m-card"><div class="m-header"><strong>Gatepass Modifier</strong></div><div id="m-content" class="m-body"></div><div style="padding: 0 20px 20px;"><button onclick="document.getElementById('${modalId}').remove()" class="m-btn-alt">Cancel & Abort</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let state = { id: '', doc: {}, payload: {} };
            window.nav = async (step) => {
                const view = document.getElementById('m-content');
                if (step === 1) view.innerHTML = `<label class="label">REQUEST ID</label><input type="text" id="in-id" class="m-input" placeholder="e.g. 6966..." onkeyup="if(event.key==='Enter') window.nav(2)"><button onclick="window.nav(2)" class="m-btn">Fetch Data</button>`;
                if (step === 2) { state.id = document.getElementById('in-id').value; if (!state.id) return; try { state.doc = await database.getDocument('ssndb', 'gatepassRequests', state.id); const types = [{ db: 'weekendPass', label: 'Weekend Pass' }, { db: 'eveningOutPass', label: 'Evening Out Pass' }, { db: 'workingDayPass', label: 'Working Day Pass' }, { db: 'holidayPass', label: 'Holiday Pass' }]; view.innerHTML = `<label class="label">SELECT PASS TYPE</label><div style="margin-top:10px;">` + types.map(t => `<div onclick="window.setPass('${t.db}')" class="type-opt ${state.doc.requestType === t.db ? 'current' : ''}">${t.label} ${state.doc.requestType === t.db ? '<span>(Current)</span>' : ''}</div>`).join('') + `</div>`; } catch (e) { alert("Error: " + e.message); window.nav(1); } }
                if (step === 3) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<label class="label">DESTINATION</label><input type="text" id="p-place" value="${state.doc.place || ''}" class="m-input"><label class="label" style="display:block; margin-top:10px;">PURPOSE</label><input type="text" id="p-purpose" value="${state.doc.purpose || ''}" class="m-input"><div class="grid"><div><label class="label">OUT DATE</label><input type="date" id="d-d" value="${today}" class="m-input"></div><div><label class="label">OUT TIME</label><input type="time" id="d-t" value="09:00" class="m-input"></div></div><div class="grid"><div><label class="label">IN DATE</label><input type="date" id="r-d" value="${today}" class="m-input"></div><div><label class="label">IN TIME</label><input type="time" id="r-t" value="21:00" class="m-input"></div></div><button onclick="window.saveMeta()" class="m-btn">Next Step</button>`; }
                if (step === 4) { const today = new Date().toISOString().split('T')[0]; view.innerHTML = `<div style="background:#fff9f0; padding:15px; border-radius:4px; border:1px solid #ffeeba;"><strong>Manual Out-Scan?</strong><div class="grid"><input type="date" id="s-d" value="${today}" class="m-input"><input type="time" id="s-t" value="16:30" class="m-input"></div></div><button onclick="window.finalize(true)" class="m-btn" style="background:#333;">Confirm with Scan</button><button onclick="window.finalize(false)" class="m-btn" style="background:#6c757d;">Confirm without Scan</button>`; }
            };
            window.setPass = (type) => { state.payload = { requestType: type, status: 'approved', wardenApproval: 'approved' }; if (type === 'workingDayPass') { state.payload.mentorApproval = 'approved'; state.payload.supervisorApproval = 'exempted'; } else { state.payload.mentorApproval = 'exempted'; state.payload.supervisorApproval = 'approved'; } window.nav(3); };
            window.saveMeta = () => { const fmt = (d, t) => new Date(`${d}T${t}:00+05:30`).toISOString(); state.payload.place = document.getElementById('p-place').value || "Home"; state.payload.purpose = document.getElementById('p-purpose').value || "Personal"; state.payload.startDate = fmt(document.getElementById('d-d').value, document.getElementById('d-t').value); state.payload.endDate = fmt(document.getElementById('r-d').value, document.getElementById('r-t').value); window.nav(4); };
            window.finalize = async (scan) => { if (scan) state.payload.outTime = new Date(`${document.getElementById('s-d').value}T${document.getElementById('s-t').value}:00+05:30`).toISOString(); try { await database.updateDocument('ssndb', 'gatepassRequests', state.id, state.payload); document.getElementById(modalId).remove(); alert("Success!"); } catch (e) { alert("Failed: " + e.message); } };
            window.nav(1);
        })();
    }

    // ==========================================
    // 4. Manual Scan-Out
    // ==========================================
    function runTool4() {
        (async () => {
            const modalId = 'minimal-scanout-modal';
            if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style');
            style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .s-card { background: #fff; width: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .s-header { background: #fffcf5; padding: 15px; border-bottom: 1px solid #fceec7; text-align: center; color: #856404; } .s-body { padding: 25px; } .s-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; } .s-btn { width: 100%; padding: 12px; margin-top: 15px; background: #d97706; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .s-btn:hover { background: #b45309; } .s-btn-alt { background: none; border: none; color: #999; width: 100%; margin-top: 10px; cursor: pointer; font-size: 11px; } .info-box { background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 15px; } .label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-top: 8px; display: block; } .val { font-size: 13px; color: #1e293b; font-weight: 600; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="s-card"><div class="s-header"><strong>Manual Scan-Out</strong></div><div id="s-content" class="s-body"><label class="label">REQUEST ID</label><input type="text" id="target-id" class="s-input" placeholder="e.g. 694b..." onkeyup="if(event.key==='Enter') window.verifyPass()"><button onclick="window.verifyPass()" class="s-btn">Verify Request</button><button onclick="document.getElementById('${modalId}').remove()" class="s-btn-alt">Cancel</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let activeId = '';
            window.verifyPass = async () => { activeId = document.getElementById('target-id').value; try { const d = await database.getDocument('ssndb', 'gatepassRequests', activeId); const today = new Date().toISOString().split('T')[0]; document.getElementById('s-content').innerHTML = `<div class="info-box"><label class="label">Pass Type</label><span class="val">${d.requestType}</span><div class="grid"><div><label class="label">Requested Out</label><span class="val" style="font-size:11px;">${new Date(d.startDate).toLocaleString('en-IN')}</span></div><div><label class="label">Requested In</label><span class="val" style="font-size:11px;">${new Date(d.endDate).toLocaleString('en-IN')}</span></div></div></div><label class="label">Actual Departure</label><div class="grid"><input type="date" id="act-d" value="${today}" class="s-input"><input type="time" id="act-t" value="16:00" class="s-input"></div><button onclick="window.recordExit()" class="s-btn">Record Departure</button><button onclick="window.location.reload()" class="s-btn-alt">Back</button>`; } catch (e) { alert("ID not found."); } };
            window.recordExit = async () => { const ts = new Date(`${document.getElementById('act-d').value}T${document.getElementById('act-t').value}:00+05:30`).toISOString(); try { await database.updateDocument('ssndb', 'gatepassRequests', activeId, { "outTime": ts, "status": "approved" }); document.getElementById(modalId).remove(); alert("Success!"); } catch (e) { alert("Failed: " + e.message); } };
        })();
    }

    // ==========================================
    // 5. Manual Scan-In
    // ==========================================
    function runTool5() {
        (async () => {
            const modalId = 'minimal-scanin-modal';
            if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style');
            style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .si-card { background: #fff; width: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .si-header { background: #f6ffed; padding: 15px; border-bottom: 1px solid #b7eb8f; text-align: center; color: #389e0d; } .si-body { padding: 25px; } .si-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; } .si-btn { width: 100%; padding: 12px; margin-top: 15px; background: #52c41a; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .si-btn:hover { background: #389e0d; } .si-btn-alt { background: none; border: none; color: #999; width: 100%; margin-top: 10px; cursor: pointer; font-size: 11px; } .info-box { background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 15px; } .label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-top: 8px; display: block; } .val { font-size: 13px; color: #1e293b; font-weight: 600; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="si-card"><div class="si-header"><strong>Manual Scan-In</strong></div><div id="si-content" class="si-body"><label class="label">REQUEST ID</label><input type="text" id="target-id" class="si-input" placeholder="e.g. 694b..." onkeyup="if(event.key==='Enter') window.verifyPass()"><button onclick="window.verifyPass()" class="si-btn">Verify Request</button><button onclick="document.getElementById('${modalId}').remove()" class="si-btn-alt">Cancel</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let activeId = '';
            window.verifyPass = async () => { activeId = document.getElementById('target-id').value; try { const d = await database.getDocument('ssndb', 'gatepassRequests', activeId); const today = new Date().toISOString().split('T')[0]; document.getElementById('si-content').innerHTML = `<div class="info-box"><label class="label">Applied Pass Type</label><span class="val">${d.requestType}</span><div class="grid"><div><label class="label">Requested Out</label><span class="val" style="font-size:11px;">${new Date(d.startDate).toLocaleString('en-IN')}</span></div><div><label class="label">Requested In</label><span class="val" style="font-size:11px;">${new Date(d.endDate).toLocaleString('en-IN')}</span></div></div></div><label class="label">Actual Arrival</label><div class="grid"><input type="date" id="act-d" value="${today}" class="si-input"><input type="time" id="act-t" value="20:30" class="si-input"></div><button onclick="window.recordArrival()" class="si-btn">Record Arrival</button><button onclick="window.location.reload()" class="si-btn-alt">Back</button>`; } catch (e) { alert("ID not found."); } };
            window.recordArrival = async () => { const ts = new Date(`${document.getElementById('act-d').value}T${document.getElementById('act-t').value}:00+05:30`).toISOString(); try { await database.updateDocument('ssndb', 'gatepassRequests', activeId, { "inTime": ts, "status": "approved" }); document.getElementById(modalId).remove(); alert("Success!"); } catch (e) { alert("Failed: " + e.message); } };
        })();
    }

    // ==========================================
    // 6. Delete Entry
    // ==========================================
    function runTool6() {
        (async () => {
            const modalId = 'minimal-terminator-modal';
            if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style');
            style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .t-card { background: #fff; width: 400px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .t-header { background: #fff5f5; padding: 15px; border-bottom: 1px solid #fed7d7; text-align: center; color: #c53030; } .t-body { padding: 25px; } .t-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; } .t-btn-danger { width: 100%; padding: 12px; margin-top: 15px; background: #c53030; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .t-btn-danger:hover { background: #9b2c2c; } .t-btn-secondary { width: 100%; padding: 10px; margin-top: 10px; background: #edf2f7; color: #4a5568; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; } .summary-box { background: #f7fafc; padding: 15px; border-radius: 6px; border: 1px solid #edf2f7; margin-top: 10px; } .label { font-size: 11px; font-weight: bold; color: #718096; text-transform: uppercase; } .data-val { font-size: 14px; color: #2d3748; font-weight: 600; margin-bottom: 8px; display: block; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="t-card"><div class="t-header"><strong>Gatepass Terminator</strong></div><div id="t-content" class="t-body"><label class="label">REQUEST ID TO DELETE</label><input type="text" id="del-id" class="t-input" placeholder="e.g. 694b..." onkeyup="if(event.key==='Enter') window.verifyTarget()"><button onclick="window.verifyTarget()" class="t-btn-danger">Fetch & Verify</button><button onclick="document.getElementById('${modalId}').remove()" class="t-btn-secondary">Cancel</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let targetId = '';
            window.verifyTarget = async () => { targetId = document.getElementById('del-id').value; try { const doc = await database.getDocument('ssndb', 'gatepassRequests', targetId); document.getElementById('t-content').innerHTML = `<div class="summary-box"><label class="label">Pass Type</label><span class="data-val">${doc.requestType}</span><label class="label">Status</label><span class="data-val">${doc.status}</span></div><p style="color:#c53030; font-size:11px; margin-top:15px; font-weight:bold; text-align:center;">Warning: Document will be removed.</p><button onclick="window.executePurge()" class="t-btn-danger">Confirm Deletion</button><button onclick="window.location.reload()" class="t-btn-secondary">Go Back</button>`; } catch (e) { alert("ID not found."); } };
            window.executePurge = async () => { try { await database.deleteDocument('ssndb', 'gatepassRequests', targetId); document.getElementById(modalId).remove(); alert("Success!"); } catch (e) { alert("Failed: " + e.message); } };
        })();
    }

    // ==========================================
    // 7. Manual Approval
    // ==========================================
    function runTool7() {
        (async () => {
            const modalId = 'authority-suite-modal';
            if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style');
            style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.6); font-family: sans-serif; } .as-card { background: #fff; width: 440px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 10px 25px rgba(0,0,0,0.3); } .as-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #eee; text-align: center; color: #333; font-weight: bold; } .as-body { padding: 20px; } .as-input { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; } .as-btn-main { width: 100%; padding: 12px; margin-top: 15px; background: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; } .info-panel { background: #f1f5f9; padding: 12px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #0056b3; } .role-row { padding: 12px 0; border-bottom: 1px solid #f0f0f0; } .role-name { font-size: 12px; font-weight: bold; color: #666; display: block; margin-bottom: 8px; text-transform: uppercase; } .btn-group { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; } .opt-btn { padding: 8px 2px; font-size: 10px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: #fff; font-weight: bold; color: #777; transition: 0.2s; } .opt-btn.active-app { background: #e6fffa; color: #088a68; border-color: #088a68; } .opt-btn.active-exm { background: #f7fafc; color: #4a5568; border-color: #4a5568; } .opt-btn.active-rej { background: #fff5f5; color: #c53030; border-color: #c53030; } .label-tiny { font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase; } .val-text { font-size: 13px; color: #333; font-weight: 600; display: block; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="as-card"><div class="as-header">Manual Approval System</div><div id="as-content" class="as-body"><label class="label-tiny">REQUEST ID</label><input type="text" id="target-id" class="as-input" placeholder="e.g. 694b..." onkeyup="if(event.key==='Enter') window.fetchDoc()"><button onclick="window.fetchDoc()" class="as-btn-main">Verify & Load</button><button onclick="document.getElementById('${modalId}').remove()" style="background:none; border:none; color:#999; width:100%; margin-top:10px; cursor:pointer; font-size:11px;">CANCEL</button></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            let state = { id: '', doc: {}, mentor: '', supervisor: '', warden: '' };
            window.fetchDoc = async () => { state.id = document.getElementById('target-id').value; if (!state.id) return; try { state.doc = await database.getDocument('ssndb', 'gatepassRequests', state.id); state.mentor = state.doc.mentorApproval || 'pending'; state.supervisor = state.doc.supervisorApproval || 'pending'; state.warden = state.doc.wardenApproval || 'pending'; window.renderSuite(); } catch (e) { alert("ID not found."); } };
            window.renderSuite = () => { const view = document.getElementById('as-content'); const roles = [{ key: 'mentor', label: '1. Staff Mentor' }, { key: 'supervisor', label: '2. Hostel Supervisor' }, { key: 'warden', label: '3. Main Warden' }]; view.innerHTML = `<div class="info-panel"><label class="label-tiny">Pass Details</label><span class="val-text">${state.doc.requestType}</span></div>${roles.map(r => `<div class="role-row"><span class="role-name">${r.label}</span><div class="btn-group"><button onclick="window.setLocal('${r.key}', 'approved')" class="opt-btn ${state[r.key] === 'approved' ? 'active-app' : ''}">Approve</button><button onclick="window.setLocal('${r.key}', 'exempted')" class="opt-btn ${state[r.key] === 'exempted' ? 'active-exm' : ''}">Exempt</button><button onclick="window.setLocal('${r.key}', 'rejected')" class="opt-btn ${state[r.key] === 'rejected' ? 'active-rej' : ''}">Reject</button></div></div>`).join('')}<button onclick="window.applyChanges()" class="as-btn-main">Sync Authority Status</button><button onclick="window.location.reload()" style="background:none; border:none; color:#999; width:100%; margin-top:10px; cursor:pointer; font-size:11px;">BACK</button>`; };
            window.setLocal = (role, val) => { state[role] = val; window.renderSuite(); };
            window.applyChanges = async () => { try { await database.updateDocument('ssndb', 'gatepassRequests', state.id, { mentorApproval: state.mentor, supervisorApproval: state.supervisor, wardenApproval: state.warden, status: 'approved' }); document.getElementById(modalId).remove(); alert("Success!"); } catch (e) { alert("Failed: " + e.message); } };
        })();
    }

    // ==========================================
    // 8. Overall History
    // ==========================================
    function runTool8() {
        (async () => {
            const modalId = 'filtered-500-archive';
            if (document.getElementById(modalId)) document.getElementById(modalId).remove();
            const style = document.createElement('style');
            style.innerHTML = `#${modalId} { z-index: 2147483647; position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.7); font-family: sans-serif; } .v-card { background: #fff; width: 98%; max-width: 1350px; height: 85vh; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); } .v-header { padding: 15px 25px; border-bottom: 1px solid #ddd; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; } .v-body { flex: 1; overflow: auto; padding: 0; } .v-table { width: 100%; border-collapse: collapse; font-size: 11px; } .v-table th { position: sticky; top: 0; background: #f1f5f9; padding: 10px 8px; text-align: left; color: #475569; font-weight: bold; border-bottom: 2px solid #e2e8f0; z-index: 10; } .v-table td { padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; } .badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; display: inline-block; } .b-app { background: #dcfce7; color: #166534; } .b-rej { background: #fee2e2; color: #991b1b; } .b-exm { background: #f1f5f9; color: #475569; } .b-pen { background: #fef9c3; color: #854d0e; } .filter-input { display: block; width: 100%; margin-top: 5px; padding: 4px 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 10px; }`;
            document.head.appendChild(style);
            const modalHTML = `<div id="${modalId}"><div class="v-card"><div class="v-header"><div><strong>Overall Request (Recent 500)</strong><div id="v-status" style="font-size:11px; color:#64748b; font-weight:bold;">Initializing...</div></div><button onclick="document.getElementById('${modalId}').remove()" style="padding:6px 12px; cursor:pointer; background:#fff; border:1px solid #ccc; border-radius:4px; font-weight:bold;">Close</button></div><div class="v-body"><table class="v-table"><thead><tr><th>REQUESTED ON<input type="text" id="f-date" class="filter-input" onkeyup="window.applyVFilters()"></th><th>REQUEST ID</th><th>STUDENT NAME</th><th>DEPARTMENT<input type="text" id="f-dept" class="filter-input" onkeyup="window.applyVFilters()"></th><th>TYPE</th><th>TRAVEL (OUT / IN)</th><th>MENTOR</th><th>SUPERVISOR</th><th>WARDEN</th></tr></thead><tbody id="v-tbody"></tbody></table></div></div></div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);
            const getB = (s) => { const v = (s || 'pending').toLowerCase(); if (v === 'approved') return `<span class="badge b-app">Approved</span>`; if (v === 'rejected') return `<span class="badge b-rej">Rejected</span>`; if (v === 'exempted') return `<span class="badge b-exm">Exempted</span>`; return `<span class="badge b-pen">Pending</span>`; };
            const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '---';
            window.applyVFilters = () => { const dQ = document.getElementById('f-date').value.toLowerCase(); const deptQ = document.getElementById('f-dept').value.toLowerCase(); document.querySelectorAll('#v-tbody tr').forEach(row => { const matches = row.children[0].innerText.toLowerCase().includes(dQ) && row.children[3].innerText.toLowerCase().includes(deptQ); row.style.display = matches ? '' : 'none'; }); };
            let total = 0; async function fBatch(o) { try { const res = await database.listDocuments('ssndb', 'gatepassRequests', [Appwrite.Query.orderDesc('$createdAt'), Appwrite.Query.limit(100), Appwrite.Query.offset(o)]); res.documents.forEach(d => { document.getElementById('v-tbody').insertAdjacentHTML('beforeend', `<tr><td>${fmt(d.$createdAt)}</td><td style="font-family:monospace; font-size:10px;">${d.$id}</td><td>${d.students?.aadharName || 'N/A'}</td><td>${d.students?.department || 'N/A'}</td><td>${d.requestType}</td><td>Out: ${fmt(d.startDate)}<br>In: ${fmt(d.endDate)}</td><td>${getB(d.mentorApproval)}</td><td>${getB(d.supervisorApproval)}</td><td>${getB(d.wardenApproval)}</td></tr>`); }); total += res.documents.length; document.getElementById('v-status').innerText = `Retrieved ${total} records...`; if (total < 500 && total < res.total) setTimeout(() => fBatch(total), 50); else document.getElementById('v-status').innerHTML = `<span style="color:#16a34a;">✅ Load Complete</span>`; } catch (e) {} }
            fBatch(0);
        })();
    }

    // ==========================================
    // 9. Live Activity Monitor (EXACT VERSION)
    // ==========================================
    function runTool9() {
        (async () => {
            const modalId = 'live-activity-architect';
            if (document.getElementById(modalId)) document.getElementById(modalId).remove();

            // --- Minimal Styling ---
            const style = document.createElement('style');
            style.innerHTML = `
                #${modalId} { 
                    z-index: 2147483647; position: fixed; inset: 0; 
                    display: flex; align-items: center; justify-content: center; 
                    background: rgba(0, 0, 0, 0.7); font-family: sans-serif;
                }
                .v-card { background: #fff; width: 98%; max-width: 1350px; height: 85vh; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .v-header { padding: 15px 25px; border-bottom: 1px solid #ddd; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; }
                .v-body { flex: 1; overflow: auto; }
                .v-table { width: 100%; border-collapse: collapse; font-size: 11px; }
                .v-table th { position: sticky; top: 0; background: #f1f5f9; padding: 12px 10px; text-align: left; color: #475569; font-weight: bold; border-bottom: 2px solid #e2e8f0; z-index: 10; }
                .v-table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
                .v-table tr:hover { background: #f8fafc; }
                
                .status-tag { padding: 4px 10px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 9px; display: inline-block; }
                .s-new { background: #e0f2fe; color: #0369a1; }
                .s-wait { background: #fef3c7; color: #92400e; }
                .s-app { background: #dcfce7; color: #166534; }
                .s-out { background: #ffedd5; color: #9a3412; }
                .s-back { background: #f3e8ff; color: #6b21a8; }
                .s-rej { background: #fee2e2; color: #991b1b; }

                .full-id { font-family: monospace; color: #4f46e5; font-weight: bold; font-size: 11px; background: #f5f3ff; padding: 2px 6px; border-radius: 4px; }
                .time-hint { font-size: 9px; color: #94a3b8; display: block; margin-top: 2px; font-weight: normal; }
            `;
            document.head.appendChild(style);

            const modalHTML = `
            <div id="${modalId}">
                <div class="v-card">
                    <div class="v-header">
                        <div>
                            <strong style="font-size:16px;">Live Activity Monitor (Sorted by Update Time)</strong>
                            <div id="v-status" style="font-size:11px; color:#64748b;">Monitoring system-wide database changes...</div>
                        </div>
                        <button onclick="document.getElementById('${modalId}').remove()" style="padding:6px 12px; cursor:pointer; background:#fff; border:1px solid #ccc; border-radius:4px; font-weight:bold;">Close</button>
                    </div>
                    <div class="v-body">
                        <table class="v-table">
                            <thead>
                                <tr>
                                    <th>REQUEST ID</th>
                                    <th>STUDENT NAME</th>
                                    <th>DEPARTMENT</th>
                                    <th>TYPE</th>
                                    <th>TRAVEL DATES</th>
                                    <th>CURRENT LIFECYCLE STATUS</th>
                                </tr>
                            </thead>
                            <tbody id="v-tbody"></tbody>
                        </table>
                    </div>
                </div>
            </div>`;

            document.body.insertAdjacentHTML('beforeend', modalHTML);

            const client = new Appwrite.Client().setEndpoint('https://hostelgatepass.ssn.edu.in/v1').setProject('ssn-gatepass-1');
            const database = new Appwrite.Databases(client);

            async function fetchLiveActivity() {
                const tbody = document.getElementById('v-tbody');
                try {
                    const res = await database.listDocuments('ssndb', 'gatepassRequests', [
                        Appwrite.Query.orderDesc('$updatedAt'), 
                        Appwrite.Query.limit(500)
                    ]);

                    res.documents.forEach(d => {
                        const updated = new Date(d.$updatedAt);
                        const created = new Date(d.$createdAt);
                        let statusHTML = '';
                        
                        if (d.inTime) {
                            statusHTML = `<span class="status-tag s-back">Returned</span><span class="time-hint">Scanned In: ${new Date(d.inTime).toLocaleString('en-IN')}</span>`;
                        } else if (d.outTime) {
                            statusHTML = `<span class="status-tag s-out">Scanned Out</span><span class="time-hint">Scanned Out: ${new Date(d.outTime).toLocaleString('en-IN')}</span>`;
                        } else if (d.wardenApproval === 'approved') {
                            statusHTML = `<span class="status-tag s-app">Approved</span><span class="time-hint">Awaiting Security Scan</span>`;
                        } else if (d.status === 'rejected' || d.wardenApproval === 'rejected') {
                            statusHTML = `<span class="status-tag s-rej">Rejected</span>`;
                        } else {
                            let pendingWho = "Warden";
                            if (d.mentorApproval === 'pending') pendingWho = "Mentor";
                            else if (d.supervisorApproval === 'pending') pendingWho = "Supervisor";
                            const isNew = Math.abs(updated - created) < 5000;
                            if (isNew) {
                                statusHTML = `<span class="status-tag s-new">New Pass Created</span><span class="time-hint">Awaiting ${pendingWho}</span>`;
                            } else {
                                statusHTML = `<span class="status-tag s-wait">Awaiting ${pendingWho}</span>`;
                            }
                        }

                        const row = `
                            <tr>
                                <td><span class="full-id">${d.$id}</span></td>
                                <td style="font-weight:bold;">${d.students?.aadharName || 'N/A'}</td>
                                <td style="color:#64748b; font-weight:600;">${d.students?.department || 'N/A'}</td>
                                <td style="font-weight:600; color:#4338ca;">${d.requestType}</td>
                                <td style="font-size:10px;">
                                    <span style="color:#64748b;">Out: ${new Date(d.startDate).toLocaleString('en-IN')}</span><br>
                                    <span style="color:#64748b;">In: ${new Date(d.endDate).toLocaleString('en-IN')}</span>
                                </td>
                                <td>
                                    ${statusHTML}
                                    <span class="time-hint" style="color:#6366f1; font-weight:bold;">Last Change: ${updated.toLocaleTimeString('en-IN')}</span>
                                </td>
                            </tr>`;
                        tbody.insertAdjacentHTML('beforeend', row);
                    });
                    document.getElementById('v-status').innerHTML = `<span style="color:#16a34a;">✅ Active: Showing ${res.documents.length} records.</span>`;
                } catch (e) { tbody.innerHTML = `<tr><td colspan="6">Error: ${e.message}</td></tr>`; }
            }
            fetchLiveActivity();
        })();
    }
})();
