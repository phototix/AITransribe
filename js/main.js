// Common functions used across all pages
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    element.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Copied to clipboard!");
}

function generateQRCode(text, elementId) {
    const qr = qrcode(0, 'L');
    qr.addData(text);
    qr.make();
    document.getElementById(elementId).innerHTML = qr.createImgTag(4);
}

// API helper functions
async function apiRequest(endpoint, data = {}) {
    try {
        const response = await fetch(`api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// Common UI functions
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.container');
    container.prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
}