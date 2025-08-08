/translation-system/
├── index.html                 # Main entry point
├── admin.html                 # Admin interface
├── speaker.html               # Speaker interface
├── attendee.html              # Attendee interface
├── api/                       # PHP API endpoints
│   ├── create_session.php      # Create new session
│   ├── transcribe.php         # Handle speech-to-text
│   ├── translate.php          # Handle translation
│   └── session_data.php       # Get session data
├── css/
│   └── style.css              # Main stylesheet
└── js/
    ├── main.js                # Common functions
    ├── admin.js              # Admin specific functions
    ├── speaker.js            # Speaker specific functions
    └── attendee.js           # Attendee specific functions