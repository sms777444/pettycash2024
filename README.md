# Petty Cash Tracker

## Python Version Requirements

This project uses Python 3.11.5. Make sure you have Python 3.11.5 installed on your system.

### Checking Python Version

```bash
python --version
```

### Setting Up Python Environment

1. Using pyenv (recommended):
```bash
pyenv install 3.11.5
pyenv local 3.11.5
```

2. Using venv:
```bash
python3.11 -m venv venv
source venv/bin/activate  # On Unix/macOS
.\venv\Scripts\activate   # On Windows
```

### Installing Dependencies

```bash
pip install -r requirements.txt
```

Or using Pipenv:
```bash
pipenv install
```

## Development Tools

- Black for code formatting
- Flake8 for linting
- MyPy for type checking
- Pytest for testing

## Running the Application

```bash
python run.py
```

The application will be available at `http://localhost:5000`.