from django.template import RequestContext, loader
from django.http import HttpResponse
from django.http import Http404
from dojango.decorators import json_response
from dojango.decorators import expect_post_request
from django.core.context_processors import csrf
from django.shortcuts import render_to_response
from formapp.models import *
import csv


#from django import forms
#from django.core import validators
from django.contrib.auth.models import User
from django.shortcuts import redirect

def form(request):
    t = loader.get_template('formtemplate.html')
    c = RequestContext(request,{})
    return HttpResponse(t.render(c))  

def exportToCSV(request):
    response = HttpResponse(mimetype='text/csv')
    response['Content-Disposition'] = 'attachment; filename="record_summary.csv"'
    
    
    record_list = Record1.objects.all()
    
    writer = csv.writer(response)
    
    writer.writerow(['Number of records:',len(record_list)]);
    writer.writerow(['Record ID', 'Last user to update', 'Date of last update', 'Description',
                     'Text Data','Integer Data 1','Integer Data 2','Radio Choice','Checkbox Choices'])
    
    
    for rec in record_list:
        if rec.radio_choice > -1:
            rchoice = rec.radio_choice
        else:
            rchoice = ""
        
        writer.writerow([rec.id, rec.last_to_update.username, rec.date_last_updated.isoformat(), 
                         rec.description, rec.text_data, rec.number1, rec.number2, rchoice,rec.checkbox_choices])
    
    

    return response   
       

