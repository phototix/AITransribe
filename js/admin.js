document.addEventListener('DOMContentLoaded', function() {
    // Form submission for new session
    document.getElementById('sessionForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('createSessionModal'));
        const sessionTitle = document.getElementById('sessionTitle').value;
        const openaiKey = document.getElementById('openaiKey').value;
        const model = document.getElementById('modelSelect').value;
        
        const response = await apiRequest('create_session.php', {
            title: sessionTitle,
            openai_key: openaiKey,
            model: model
        });
        
        if (response.success) {
            modal.hide();
            showAlert('Session created successfully!');
            loadSessions();
            showSessionDetails(response.session_id);
            
            // Clear form
            document.getElementById('sessionForm').reset();
        } else {
            showAlert('Error creating session: ' + response.error, 'danger');
        }
    });

    // Load existing sessions
    async function loadSessions() {
        const response = await apiRequest('session_data.php', { action: 'list' });
        if (response.success) {
            const tableBody = document.getElementById('sessionsTable');
            tableBody.innerHTML = '';
            response.sessions.forEach(session => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${session.id}</td>
                    <td>${session.title}</td>
                    <td>${new Date(session.created_at).toLocaleString()}</td>
                    <td><span class="badge ${session.active ? 'bg-success' : 'bg-secondary'}">${session.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="showSessionDetails('${session.id}')">Details</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    }

    // Initial load
    loadSessions();
});

// Show session details in modal
async function showSessionDetails(sessionId) {
    const response = await apiRequest('session_data.php', {
        action: 'get',
        session_id: sessionId
    });

    if (response.success) {
        const session = response.session;
        const baseUrl = window.location.origin + "/";
        
        document.getElementById('speakerUrl').value = `${baseUrl}speaker.html?session=${sessionId}`;
        document.getElementById('attendeeUrl').value = `${baseUrl}attendee.html?session=${sessionId}`;
        document.getElementById('sessionId').value = sessionId;
        
        // Generate QR code for attendee URL
        generateQRCode(
            `${baseUrl}attendee.html?session=${sessionId}`,
            'qrCodeContainer'
        );

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('sessionDetailsModal'));
        modal.show();
    } else {
        showAlert('Error loading session details: ' + response.error, 'danger');
    }
}

function gotoGloassayManage(){
    const sessionId = document.getElementById('sessionId').value;
    if (sessionId) {
        window.location.href = `glossary.html?session=${sessionId}`;
    }
}