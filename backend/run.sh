# Description: This script is used to run the Django project

# Note: you may need to run 'chmod +x run.sh' in the terminal (in the petpal folder) to make this file executable


source petpal/myenv/bin/activate

# Run the server
python3 petpal/manage.py runserver

# Press Ctrl+C to stop the server

# Deactivate the virtual environment by running 'deactivate' in the terminal