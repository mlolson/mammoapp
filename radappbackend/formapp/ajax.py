from django.utils import simplejson
from dajaxice.decorators import dajaxice_register
from dajaxice.core import dajaxice_functions
from formapp.models import *
from django.http import HttpResponse
import csv

#from finding.models import AnswerFin

@dajaxice_register
def getRecord1List(request):
    record_list = Record1.objects.all()
    data = {'records':[]}
    for record in record_list:
        data['records'].append({'id':record.id,
                                'description':record.description,
                                'last_to_update':record.last_to_update.username,
                                'date_last_updated':record.date_last_updated.isoformat(),
                                'text_data':record.text_data,
                                'number1':record.number1,
                                'number2':record.number2,
                                'checkbox_choices':record.checkbox_choices,
                                'radio_choice':record.radio_choice
                                })

    return simplejson.dumps(data)

dajaxice_functions.register(getRecord1List)

@dajaxice_register
def saveRecord(request,
               isNewRecord,
               idn,
               date_updated,
               last_to_update,
               description,
               text_data,
               number1,
               number2,
               radio_choice,
               checkbox_choices):
    
    try:
        user = User.objects.get(username=last_to_update)
    except User.DoesNotExist:
        return simplejson.dumps({'message':'error: user DNE'})
    
    if(isNewRecord):       
        rec = Record1(date_last_updated=date_updated,last_to_update=user,
                             description=description,text_data=text_data,number1=number1,
                             number2=number2,radio_choice=radio_choice,checkbox_choices=checkbox_choices)
    
        rec.save()
        
    else:
        try:
            rec = Record1.objects.get(id=idn)
        except Record1.DoesNotExist:
            return simplejson.dumps({'message':'error: record DNE'})
        
        rec.date_last_updated = date_updated
        rec.last_to_update = user
        rec.description = description
        rec.text_data = text_data
        rec.number1 = number1
        rec.number2 = number2
        rec.radio_choice = radio_choice
        rec.checkbox_choices = checkbox_choices
        rec.save()
    return simplejson.dumps({'message':'Saved',
                                 'isNewRecord':isNewRecord,
                                 'newid':rec.id,
                                 'date_last_updated':date_updated,
                                 'last_to_update':last_to_update,
                                 'description':description,
                                 'text_data':text_data,
                                 'number1':number1,
                                 'number2':number2,
                                 'radio_choice':radio_choice,
                                 'checkbox_choices':checkbox_choices
                                 })
        
dajaxice_functions.register(saveRecord)  
    

@dajaxice_register
def deleteRecord(request,idn):
    try:
        rec = Record1.objects.get(id=idn)
    except Record1.DoesNotExist:
        return simplejson.dumps({'message':'error: record DNE'})
    
    rec.delete()
    return simplejson.dumps({'message':'Saved','id':idn})
    
dajaxice_functions.register(deleteRecord)  
    
    
