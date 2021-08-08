#!/usr/bin/env python3
# Make sure you add WSGIPassAuthorization to the apache conf
import sys
import logging
logging.basicConfig(stream=sys.stderr)
# sys.path.insert(0, '/usr/local/src')

# from signout.app import application
# from signout.db import load_db_settings
# load_db_settings(application)
# application = create_app()


sys.path.insert(0, '/usr/local/src/ro-tools')
from tools import app as application

# vim: ft=python:
