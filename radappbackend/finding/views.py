from django.template import RequestContext, loader
from finding.models import Finding
from django.http import HttpResponse
from django.http import Http404
#from django import forms
#from django.core import validators
from django.contrib.auth.models import User
from django.shortcuts import redirect

def userhome(request):
    if request.user.is_authenticated():
        t = loader.get_template('userhome.html')
    else:
        return redirect('/')    
    username = request.user.username   
    c = RequestContext(request,{'username':username})
    return HttpResponse(t.render(c))

def mammointro(request):
    if request.user.is_authenticated():
        t = loader.get_template('mammointro.html')
    else:
        return redirect('/')    
    username = request.user.username   
    c = RequestContext(request,{'username':username})
    return HttpResponse(t.render(c))

def mammoupload(request):
    if request.user.is_authenticated():
        t = loader.get_template('mammoupload.html')
    else:
        return redirect('/')    
    username = request.user.username   
    c = RequestContext(request,{'username':username})
    return HttpResponse(t.render(c))

def mammo(request):
    #finding_list = Finding.objects.order_by('findingNum')
    if request.user.is_authenticated():
        t = loader.get_template('template.html')
    else:
        return redirect('/')        
    c = RequestContext(request,{})
    return HttpResponse(t.render(c))

def answerform(request):
    t = loader.get_template('answertemplate.html')
    #finding_list = Finding.objects.order_by('findingNum')    
    c = RequestContext(request,{})
    return HttpResponse(t.render(c))

def home(request):
    if request.user.is_authenticated():
         return redirect('/userhome/')    
    t = loader.get_template('home.html')   
    c = RequestContext(request,{})
    return HttpResponse(t.render(c))

def submit(request):
    return HttpResponse()

def getType(request):
    return HttpResponse()

<<<<<<< HEAD
def score(request,numCorrect,numTotal):
    
    if not request.user.is_authenticated():
        return redirect('/')  
    
    t = loader.get_template('score.html') 
    c = RequestContext(request,{
            'numCorrect':numCorrect,
            'numTotal':numTotal,
                                })
    return HttpResponse(t.render(c))
    

=======
>>>>>>> d8c8866efb424a7886463217e0cda3c9cf4aa6b6
