# Real-Time Translation System (Open Source Alternative to Wordly)

## Project Overview
This is a self-hosted, open-source real-time translation system designed for events and conferences. It provides:
- Real-time speech-to-text transcription
- Multi-language translation using OpenAI
- Speaker and attendee interfaces
- Session management for administrators

## Repository Structure
```
/real-time-translation/
├── frontend/                  # Web application
│   ├── index.html             # Landing page
│   ├── admin.html             # Admin interface
│   ├── speaker.html           # Speaker interface
│   ├── attendee.html          # Attendee interface
│   ├── css/                   # Stylesheets
│   └── js/                    # JavaScript files
├── api/                       # PHP API endpoints
│   ├── create_session.php
│   ├── transcribe.php
│   ├── translate.php
│   └── session_data.php
├── scripts/                   # Database and setup scripts
├── transcripts/               # Storage for session transcripts
├── README.md                  # This documentation
├── LICENSE                    # MIT License
└── .gitignore
```

## Prerequisites
- Web server (Apache/Nginx)
- PHP 8.0+
- MySQL 5.7+
- Node.js (for optional development)
- OpenAI API key

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/real-time-translation.git
cd real-time-translation
```

### 2. Database Setup
```bash
mysql -u root -p < scripts/database_setup.sql
```

### 3. Configuration
Edit `api/db_connect.php` with your database credentials:
```php
$host = 'localhost';
$dbname = 'translation_system';
$username = 'your_db_user';
$password = 'your_db_password';
```

### 4. File Permissions
```bash
chmod -R 775 transcripts/
```

### 5. Web Server Configuration
Point your web server to the `frontend` directory as the document root.

## Usage

### Admin Interface
- Create sessions with unique QR codes
- Set OpenAI API keys
- Manage active sessions

### Speaker Interface
- Real-time speech transcription
- Language selection
- Session controls

### Attendee Interface
- Join sessions via QR code
- Select preferred language
- Real-time translation with optional audio

## API Documentation
The system provides these endpoints:

1. `POST /api/create_session.php` - Create new session
2. `POST /api/transcribe.php` - Handle speech transcription
3. `POST /api/translate.php` - Handle translation requests
4. `POST /api/session_data.php` - Manage session data

## Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
The PHP API can be tested using Postman or curl:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Test Session"}' http://localhost/api/create_session.php
```

## Deployment Considerations

### Security
1. Add authentication middleware
2. Implement HTTPS
3. Restrict API access
4. Regularly rotate OpenAI API keys

### Scaling
1. Implement Redis for session caching
2. Add load balancing for high-traffic events
3. Consider database replication

## License
MIT License - Free for personal and commercial use

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Support
For issues, please open a GitHub ticket or contact:
Brandon Chong - brandon@kkbuddy.com

## Roadmap
- [ ] Mobile app integration
- [ ] Offline translation capability
- [ ] Advanced analytics dashboard
- [ ] Multi-speaker support
- [ ] Integration with hardware translation devices

## Credits
Developedunder leadership of Brandon Chong [1]

[1] Source: AI Transribe context provided