# Description: This script is used to run the Django project

# Note: you may need to run 'chmod +x run.sh' in the terminal (in the petpal folder) to make this file executable


source myenv/bin/activate

# Run the server
python3 manage.py runserver

# Press Ctrl+C to stop the server

# Deactivate the virtual environment (UNCOMMENT THIS IF YOU WANT TO DEACTIVATE THE VENV)
# deactivate