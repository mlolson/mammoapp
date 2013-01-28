from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic.simple import direct_to_template
from finding import views
import settings
from dajaxice.core import dajaxice_autodiscover
dajaxice_autodiscover()
#from dajaxice.core import dajaxice_autodiscover, dajaxice_config
#dajaxice_autodiscover()

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    #url(dajaxice_config.dajaxice_url, include('dajaxice.urls')),
    (r'^accounts/', include('registration.backends.default.urls')),
    # Examples:
    # url(r'^$', 'radappbackend.views.home', name='home'),
    # url(r'^radappbackend/', include('radappbackend.foo.urls')),
    # url(r'^$', 'views.display_homepage'),
    url(r'^userhome/$', 'finding.views.userhome'),
    url(r'^mammointro/(\d{1})', 'finding.views.mammointro'),
    url(r'^mammoupload/$', 'finding.views.mammoupload'),
    url(r'^mammo/$', 'finding.views.mammo'),
    url(r'^answers/$', 'finding.views.answerform'),
    url(r'^$', 'finding.views.home'),
    url(r'^about', 'finding.views.about'),
    url(r'^recordapp/$', 'formapp.views.form'),
    url(r'^recordapp/export/$', 'formapp.views.exportToCSV'),
    
    url(r'^mammo/score/(\d{1})/(\d{1})/$', 'finding.views.score'),
    #url(r'^form/$', 'finding.views.form'),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    #Dajaxice URLS
    (r'^%s/' % settings.DAJAXICE_MEDIA_PREFIX, include('dajaxice.urls')),
)

urlpatterns += staticfiles_urlpatterns()
