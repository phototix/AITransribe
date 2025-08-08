document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const joinSessionCard = document.getElementById('joinSessionCard');
    const translationCard = document.getElementById('translationCard');
    const sessionStatusAlert = document.getElementById('sessionStatusAlert');
    const sessionStatusText = document.getElementById('sessionStatusText');
    const inactiveSessionAlert = document.getElementById('inactiveSessionAlert');
    const activeSessionControls = document.getElementById('activeSessionControls');

    // Session status polling variables
    let sessionStatusInterval;
    let isSessionActive = false;
    let currentSessionId = null;

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

    // Join session function
    async function joinSession(sessionId) {
        const response = await apiRequest('session_data.php', {
            action: 'get',
            session_id: sessionId
        });

        if (response.success) {
            currentSessionId = sessionId;
            document.getElementById('sessionTitle').textContent = response.session.title;
            joinSessionCard.classList.add('d-none');
            translationCard.classList.remove('d-none');
            
            // Start checking session status
            checkSessionStatus();
            sessionStatusInterval = setInterval(checkSessionStatus, 3000);
        } else {
            showAlert('Error joining session: ' + response.error, 'danger');
        }
    }

    // Check session status
    async function checkSessionStatus() {
        if (!currentSessionId) return;

        const response = await apiRequest('session_data.php', {
            action: 'get',
            session_id: currentSessionId
        });

        if (response.success) {
            const sessionActive = response.session.active;
            
            if (sessionActive !== isSessionActive) {
                // Status changed
                isSessionActive = sessionActive;
                updateUIForSessionStatus();
            }

            sessionStatusText.textContent = isSessionActive 
                ? 'Session is active' 
                : 'Session is not active yet';
            sessionStatusAlert.className = `alert ${isSessionActive ? 'alert-success' : 'alert-warning'}`;
        }
    }

    // Update UI based on session status
    function updateUIForSessionStatus() {
        if (isSessionActive) {
            inactiveSessionAlert.classList.add('d-none');
            activeSessionControls.classList.remove('d-none');
            // Start polling for translations if session becomes active
            if (!window.translationPolling) {
                pollTranslations(currentSessionId);
                window.translationPolling = true;
            }
        } else {
            inactiveSessionAlert.classList.remove('d-none');
            activeSessionControls.classList.add('d-none');
        }
    }

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
        if (!isSessionActive) return;
        
        audioEnabled = !audioEnabled;
        this.textContent = audioEnabled ? 'Disable Audio' : 'Enable Audio';
        this.classList.toggle('btn-outline-primary');
        this.classList.toggle('btn-primary');
        if (!audioEnabled && utterance) {
            synth.cancel();
        }
    });

    // Poll for new translations
    async function pollTranslations(sessionId) {
        let lastUpdate = 0;
        let isSpeaking = false;

        const lastTranscriptId = document.getElementById('lastTranscriptId').value;
        const readTranscript = document.getElementById('readTranscript').value;

        // Add event listeners for speech synthesis
        synth.onstart = function() {
            isSpeaking = true;
        };

        synth.onend = synth.onerror = function() {
            isSpeaking = false;
            utterance = null;
        };

        async function checkUpdates() {
            if (!isSessionActive) return;

            if (!isSpeaking) {
                const response = await apiRequest('translate.php', {
                    session_id: sessionId,
                    language: currentLanguage,
                    last_update: lastUpdate,
                    last_id: lastTranscriptId
                });
                if (response.success && response.translation) {

                    if(document.getElementById('lastTranscriptId').value == response.transcript_id){
                        
                    }else{
                        document.getElementById('readTranscript').value = "0";
                    }

                    document.getElementById('lastTranscriptId').value = response.transcript_id;
                    console.log("id:" + response.transcript_id);
                    console.log(response.translation.text);
                    document.getElementById('translationText').textContent = response.translation.text;
                    lastUpdate = response.translation.timestamp;

                    if(document.getElementById('readTranscript').value == "1"){

                    }else{
                        // Read aloud if enabled
                        if (audioEnabled && response.translation.text) {
                            if (utterance) {
                                synth.cancel();
                            }
                            utterance = new SpeechSynthesisUtterance(response.translation.text);
                            utterance.lang = currentLanguage;
                            synth.speak(utterance);
                            document.getElementById('readTranscript').value = "1";
                        }
                    }
                        
                }
                
                // Continue polling if session is still active
                if (isSessionActive&&!isSpeaking) {
                    setTimeout(checkUpdates, 3000);
                }

            }

                
        }

        function loadHistory() {
            const response = await apiRequest('translateHistory.php', {
                session_id: sessionId,
                language: currentLanguage,
                last_id: document.getElementById('lastTranscriptId').value || 0,
                limit: 30
            });
            if (response.success && response.history.length > 0) {
                // Process the history data
                const historyContainer = document.getElementById('translationHistory');
                const lastItem = response.history[response.history.length - 1];

                // Append new translations to history
                response.history.forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.innerHTML = `
                        <small class="text-muted">${new Date(item.timestamp).toLocaleString()}</small>
                        <div class="translation-text">${item.translated_text}</div>
                    `;
                    historyContainer.appendChild(historyItem);
                });
            }
        }

        setTimeout(loadHistory, 3000);
        // Start polling
        checkUpdates();
        loadHistory();
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        if (sessionStatusInterval) {
            clearInterval(sessionStatusInterval);
        }
        if (utterance) {
            synth.cancel();
        }
    });
});