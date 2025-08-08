document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const joinSessionCard = document.getElementById('joinSessionCard');
    const translationCard = document.getElementById('translationCard');
    
    if (sessionId) {
        // Direct link with session ID
        joinSession(sessionId);
    }
    
    // Manual join
    document.getElementById('joinSessionBtn').addEventListener('click', function() {
        const sessionIdInput = document.getElementById('sessionIdInput').value.trim();
        if (sessionIdInput) {
            joinSession(sessionIdInput);
        } else {
            showAlert('Please enter a session ID', 'warning');
        }
    });
    
    // Language selection
    const languageSelect = document.getElementById('targetLanguage');
    let currentLanguage = languageSelect.value;
    let synth = window.speechSynthesis;
    let utterance = null;
    
    languageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        if (utterance) {
            synth.cancel();
        }
    });
    
    // Audio toggle
    const toggleAudioBtn = document.getElementById('toggleAudioBtn');
    let audioEnabled = false;
    
    toggleAudioBtn.addEventListener('click', function() {
        audioEnabled = !audioEnabled;
        this.textContent = audioEnabled ? 'Disable Audio' : 'Enable Audio';
        this.classList.toggle('btn-outline-primary');
        this.classList.toggle('btn-primary');
        
        if (!audioEnabled && utterance) {
            synth.cancel();
        }
    });
    
    // Join session function
    async function joinSession(sessionId) {
        const response = await apiRequest('session_data.php', {
            action: 'get',
            session_id: sessionId
        });
        
        if (response.success) {
            document.getElementById('sessionTitle').textContent = response.session.title;
            joinSessionCard.classList.add('d-none');
            translationCard.classList.remove('d-none');
            
            // Start polling for translations
            pollTranslations(sessionId);
        } else {
            showAlert('Error joining session: ' + response.error, 'danger');
        }
    }
    
    // Poll for new translations
    async function pollTranslations(sessionId) {
        let lastUpdate = 0;
        
        async function checkUpdates() {
            const response = await apiRequest('translate.php', {
                session_id: sessionId,
                language: currentLanguage,
                last_update: lastUpdate
            });
            
            if (response.success && response.translation) {
                document.getElementById('translationText').textContent = response.translation.text;
                lastUpdate = response.translation.timestamp;
                
                // Read aloud if enabled
                if (audioEnabled && response.translation.text) {
                    if (utterance) {
                        synth.cancel();
                    }
                    
                    utterance = new SpeechSynthesisUtterance(response.translation.text);
                    utterance.lang = currentLanguage;
                    synth.speak(utterance);
                }
            }
            
            // Continue polling
            setTimeout(checkUpdates, 3000);
        }
        
        // Start polling
        checkUpdates();
    }
});