document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (!sessionId) {
        showAlert('No session ID provided. Please join via admin interface.', 'danger');
        return;
    }
    
    // Load session details
    loadSessionDetails(sessionId);
    
    // Session controls
    const toggleSessionBtn = document.getElementById('toggleSessionBtn');
    const sessionStatus = document.getElementById('sessionStatus');
    let sessionActive = false;
    
    toggleSessionBtn.addEventListener('click', async function() {
        sessionActive = !sessionActive;
        
        const response = await apiRequest('session_data.php', {
            action: 'set_status',
            session_id: sessionId,
            active: sessionActive
        });
        
        if (response.success) {
            if (sessionActive) {
                toggleSessionBtn.textContent = 'End Session';
                toggleSessionBtn.classList.remove('btn-success');
                toggleSessionBtn.classList.add('btn-danger');
                sessionStatus.textContent = 'Active';
                sessionStatus.classList.remove('bg-secondary');
                sessionStatus.classList.add('bg-success');
            } else {
                toggleSessionBtn.textContent = 'Start Session';
                toggleSessionBtn.classList.remove('btn-danger');
                toggleSessionBtn.classList.add('btn-success');
                sessionStatus.textContent = 'Inactive';
                sessionStatus.classList.remove('bg-success');
                sessionStatus.classList.add('bg-secondary');
            }
        } else {
            showAlert('Error updating session status: ' + response.error, 'danger');
            sessionActive = !sessionActive; // Revert
        }
    });
    
    // Speech recognition
    const startRecording = document.getElementById('startRecording');
    const stopRecording = document.getElementById('stopRecording');
    const transcriptionText = document.getElementById('transcriptionText');
    const languageSelect = document.getElementById('languageSelect');
    
    let recognition;
    let lastTranscriptTime = 0;
    
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;  // Ensure continuous listening
        recognition.interimResults = true;
        recognition.lang = languageSelect.value;

        // Add error handling
        recognition.onerror = function(event) {
            console.error('Recognition error:', event.error);
            if (event.error === 'no-speech') {
                // Automatically restart if no speech detected
                recognition.start();
            }
        };

        recognition.onend = function() {
            // Automatically restart recognition when it ends
            if (startRecording.disabled) { // If still in recording mode
                recognition.start();
            }
        };
        
        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            transcriptionText.innerHTML = finalTranscript + '<i>' + interimTranscript + '</i>';
            
            // Send to server every 5 seconds if there's new content
            const now = Date.now();
            if (finalTranscript && now - lastTranscriptTime > 5000) {
                lastTranscriptTime = now;
                sendTranscript(sessionId, finalTranscript, languageSelect.value);
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            stopRecording.click();
            showAlert('Speech recognition error: ' + event.error, 'danger');
        };
    } else {
        startRecording.disabled = true;
        showAlert('Speech recognition not supported in this browser', 'warning');
    }

    startRecording.addEventListener('click', function() {
        recognition.lang = languageSelect.value;
        recognition.start();
        startRecording.disabled = true;
        stopRecording.disabled = false;
        showAlert('Recording started', 'success');
        // Add visual indicator
        document.getElementById('recordingIndicator').classList.remove('d-none');
    });

    stopRecording.addEventListener('click', function() {
        recognition.stop();
        startRecording.disabled = false;
        stopRecording.disabled = true;
        showAlert('Recording stopped', 'info');
        // Remove visual indicator
        document.getElementById('recordingIndicator').classList.add('d-none');
    });
    
    // Load session details
    async function loadSessionDetails(sessionId) {
        const response = await apiRequest('session_data.php', {
            action: 'get',
            session_id: sessionId
        });
        
        if (response.success) {
            document.getElementById('sessionTitle').textContent = response.session.title;
        } else {
            showAlert('Error loading session details: ' + response.error, 'danger');
        }
    }
    
    // Send transcript to server
    async function sendTranscript(sessionId, text, language) {
        const response = await apiRequest('transcribe.php', {
            session_id: sessionId,
            text: text,
            language: language
        });
        
        if (!response.success) {
            console.error('Error saving transcript:', response.error);
        }
    }
});