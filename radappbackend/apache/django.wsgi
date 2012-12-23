import os
import sys

os.environ['DJANGO_SETTINGS_MODULE'] = 'radappbackend.settings'

path = '/home/ubuntu/www/radappbackend'
if path not in sys.path:
    sys.path.append(path)

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
