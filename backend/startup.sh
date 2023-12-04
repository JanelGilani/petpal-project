# Description: This script is used to setup the Django project

# Note: you may need to run 'chmod +x startup.sh' in the terminal (in the petpal folder) to make this file executable


# Install the latest Django version
pip3 install Django

# Create a new Django virtual environment
python3 -m venv petpal/myenv

# Activate the virtual environment
source petpal/myenv/bin/activate

# Install packages from requirements.txt
pip install -r petpal/requirements.txt

# Make migrations
python petpal/manage.py makemigrations

# Migrate
python petpal/manage.py migrate

# Load data from test.json
python petpal/manage.py loaddata petpal/test.json