#
# To help clean-up, set up, and zip up everything
#

NOADD  := db.sqlite3 $(wildcard *.tar)
FILES  := $(filter-out $(NOADD), $(wildcard *))
OUTPUT := $(notdir $(abspath .))

all: clean

.PHONY: clean
clean:
	rm -rf myenv
	rm -rf static/*
	rm -rf */__pycache__/ */*/__pycache__/ */*/*/__pycache__/ */migrations/0*.py
	rm -rf $(NOADD) *~ *.tar
	
setup: clean
	chmod a+x ./manage.py
	./manage.py makemigrations
	./manage.py migrate
	./manage.py loaddata test.json
