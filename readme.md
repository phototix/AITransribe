# AI Translate - Real-time Translation System

## Overview
AI Translate is an open-source, self-hosted alternative to Wordly that provides real-time speech transcription and translation for events and meetings. It supports multiple languages and offers separate interfaces for administrators, speakers, and attendees.

## Features
- **Real-time transcription** of speaker's speech using OpenAI
- **Multi-language translation** for attendees
- **Speaker interface** with microphone capture and transcription
- **Attendee interface** with language selection and text-to-speech
- **Admin panel** for session management
- **Glossary management** for term blocking, boosting, and replacement

## System Requirements
- Web server (Apache/Nginx)
- PHP 8.0+
- MySQL 5.7+
- Node.js (for optional development)
- Modern web browser with Web Speech API support

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/phototix/AITransribe.git
cd AITransribe
```

### 2. Database Setup
```bash
mysql -u root -p
CREATE DATABASE translation_system;
exit
```

### 3. Configure Database
Edit `api/db_connect.php` with your database credentials:
```php
$host = 'localhost';
$dbname = 'translation_system';
$username = 'root';
$password = 'your_password';
```

### 4. Web Server Configuration
Set up your web server to point to the project directory. For Apache, you might add:
```
<VirtualHost *:80>
    ServerName aitranslate.local
    DocumentRoot /path/to/AITransribe
    <Directory /path/to/AITransribe>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 5. Create Required Directories
```bash
mkdir transcripts
chmod 777 transcripts
```

## Usage

### Starting a Session
1. Access the admin interface at `http://yourdomain/admin.html`
2. Create a new session with your OpenAI API key
3. Share the generated QR code or URLs with speakers and attendees

### Speaker Interface
1. Open the speaker URL
2. Select source language
3. Click "Start Recording" to begin transcription

### Attendee Interface
1. Scan the QR code or enter session ID
2. Select preferred language
3. View real-time translations

## Configuration Options

### Environment Variables
Create a `.env` file in the root directory:
```
OPENAI_DEFAULT_MODEL=gpt-3.5-turbo
DEFAULT_LANGUAGE=en
```

### Glossary Management
Access glossary management through the admin interface to:
- Block specific terms
- Boost term importance
- Replace terms with alternatives

## API Endpoints
- `/api/create_session.php` - Create new sessions
- `/api/transcribe.php` - Handle speech transcription
- `/api/translate.php` - Handle translation requests
- `/api/session_data.php` - Manage session data
- `/api/glossary.php` - Manage glossary terms

## Development

### Prerequisites
- Node.js 16+
- npm/yarn

### Setup
```bash
npm install
```

### Building Assets
```bash
npm run build
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License
MIT License

## Support
For issues and feature requests, please open an issue on GitHub.

## Screenshots
![Admin Interface](screenshots/admin.png)
![Speaker Interface](screenshots/speaker.png)
![Attendee Interface](screenshots/attendee.png)

## Roadmap
- [ ] Add more language options
- [ ] Implement offline speech recognition
- [ ] Add user authentication
- [ ] Develop mobile apps

## Acknowledgements
This project was inspired by the need for accessible real-time translation tools in multilingual environments like religious institutions and international conferences.

Note: This documentation assumes basic knowledge of web server administration and PHP/MySQL setup. For detailed deployment instructions, refer to the [GitHub repository](https://github.com/phototix/AITransribe).