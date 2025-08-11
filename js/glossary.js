document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    document.getElementById('sessionId').value = sessionId;

    console.log(window.location.search); // Should show "?session=6895b74942dff"
    console.log(sessionId); // Should show "6895b74942dff"

    // Show/hide fields based on action
    document.getElementById('action').addEventListener('change', function() {
        const action = this.value;
        const replacementContainer = document.getElementById('replacementContainer');
        const weightContainer = document.getElementById('weightContainer');

        replacementContainer.style.display = action === 'replace' ? 'block' : 'none';
        weightContainer.style.display = action === 'boost' ? 'block' : 'none';
    });

    // Form submission
    document.getElementById('glossaryForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const term = document.getElementById('term').value.trim();
        const action = document.getElementById('action').value;
        const replacement = document.getElementById('replacement').value.trim();
        const weight = parseFloat(document.getElementById('weight').value) || 1.0;

        const response = await apiRequest('glossary.php', {
            action: 'add',
            session_id: sessionId,
            term,
            action,
            replacement,
            weight
        });

        console.log(response.success);

        if (response.success) {
            loadGlossaryTerms();
            document.getElementById('glossaryForm').reset();
        } else {
            showAlert('Error adding term: ' + response.error, 'danger');
        }
    });

    // Load initial terms
    loadGlossaryTerms();
});

async function loadGlossaryTerms() {
    const sessionId = document.getElementById('sessionId').value;
    const response = await apiRequest('glossary.php', {
        action: 'list',
        session_id: sessionId
    });

    if (response.success) {
        const tableBody = document.getElementById('glossaryTable');
        tableBody.innerHTML = '';

        response.terms.forEach(term => {
            const row = document.createElement('tr');
            
            let actionDetail = '';
            if (term.action === 'replace') {
                actionDetail = `→ ${term.replacement}`;
            } else if (term.action === 'boost') {
                actionDetail = `(Weight: ${term.weight})`;
            }

            row.innerHTML = `
                <td>${term.term}</td>
                <td>${term.action.charAt(0).toUpperCase() + term.action.slice(1)}</td>
                <td>${actionDetail}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteTerm('${term.id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

async function deleteTerm(termId) {
    if (confirm('Are you sure you want to delete this term?')) {
        const response = await apiRequest('glossary.php', {
            action: 'delete',
            term_id: termId
        });

        if (response.success) {
            loadGlossaryTerms();
            showAlert('Term deleted successfully', 'success');
        } else {
            showAlert('Error deleting term: ' + response.error, 'danger');
        }
    }
}