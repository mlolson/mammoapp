from django.utils import simplejson
from dajaxice.decorators import dajaxice_register
from dajaxice.core import dajaxice_functions
from finding.models import *
#from finding.models import AnswerFin

@dajaxice_register
def getFindings(request):
    finding_list = Finding.objects.all()
    data = []
    for i in range(len(finding_list)):
        data.append(finding_list[i].findingNum)
    #data = [1,2,3]
    return simplejson.dumps({'message':'getFindings','fnumbers': data})

dajaxice_functions.register(getFindings)

@dajaxice_register
def addFinding(request,type,description,npts,xArr,yArr):
    finding_list = Finding.objects.all()
    #data = {}
    uniqueNum = 1
    newFindingNum = len(finding_list);
    while(uniqueNum):
        uniqueNum = 0
        for i in range(len(finding_list)):
            if finding_list[i].findingNum == newFindingNum:
                newFindingNum += 1
                uniqueNum = 1
    #try:    
    newFind = Finding(findingNum=newFindingNum, npoints=npts,type=type,description=description,xArr=xArr,yArr=yArr)
    newFind.save()      
    s = 'num fs before add = ' + str(len(finding_list))
    
    finding_list = Finding.objects.all()
    data = []
    for i in range(len(finding_list)):
        data.append(finding_list[i].findingNum)
    
    return simplejson.dumps({'message':s,'fnumbers': data,'numUpdated':newFindingNum})

dajaxice_functions.register(addFinding)

@dajaxice_register
def addAnswerFinding(request,imageNum,setNum,findingNum,isCCView,isMLOView,xLocCC,yLocCC,xLocMLO,yLocMLO,ftype,description):
    message="";
    
    try:
        set = Set.objects.get(setNum=setNum)
    except Set.DoesNotExist:
        message = "set does not exist"
        return simplejson.dumps({'message':message})   
    try:
        image = Image.objects.get(imageNum=imageNum,set=set)
    except Image.DoesNotExist:
        message = "image does not exist"
        return simplejson.dumps({'message':message})      

    newFind = AnswerFinding(image=image,setNum=setNum,findingNum=findingNum,isCCView=isCCView,isMLOView=isMLOView,xLocCC=xLocCC,yLocCC=yLocCC,xLocMLO=xLocMLO,yLocMLO=yLocMLO,type=ftype,description=description)
    newFind.save()   
    message = "success"
    return simplejson.dumps({'message':message})
#dajaxice_functions.register(addAnswerFinding)

@dajaxice_register
def addAnswerImpression(request,imageNum,setNum,biradsNum,description,finalPathology):
    message = "";  
    try:
        set = Set.objects.get(setNum=setNum)
    except Set.DoesNotExist:
        message = "set does not exist"
        return simplejson.dumps({'message':message}) 
    try:
        image = Image.objects.get(imageNum=imageNum,set=set)
    except Image.DoesNotExist:
        message = "image does not exist"
        return simplejson.dumps({'message':message})  
            
    newImp = AnswerImpression(image=image,setNum=setNum,biradsNum=biradsNum,description=description,finalPathology=finalPathology)
    newImp.save()
    message = "success"
    return simplejson.dumps({"message":message})


@dajaxice_register
def getMaxImageNum(request,setNum):
    message = "";  
    try:
        set = Set.objects.get(setNum=setNum)
    except Set.DoesNotExist:
        message = "set does not exist"
        return simplejson.dumps({'message':message})  
    
    image_list = set.image_set.all()
    maxNum = len(image_list)
    return simplejson.dumps({"maxImageNum":maxNum})

@dajaxice_register
def updateFinding(request,findingNum,type,description,npts,xArr,yArr):
    message = ""
    success = 1
    try:
        f = Finding.objects.get(findingNum=findingNum)
    except Finding.DoesNotExist:
        message = str(findingNum) + " does no exist"
        success = 0
    except Finding.MultipleObjectsReturned:
        message = "Multiple records with #"+str(findingNum)
        success = 0
   
    return simplejson.dumps({'message':message,'success': success,'numUpdated':findingNum})
dajaxice_functions.register(updateFinding)

@dajaxice_register
def deleteFinding(request, numToDelete):
    message = "delete "+str(numToDelete)
    delete = 1
    try:
        f = Finding.objects.get(findingNum=numToDelete)
    except Finding.DoesNotExist:
        message = str(numToDelete) + " Does no exist"
        delete=0
    except Finding.MultipleObjectsReturned:
        message = "Multiple records with #"+str(numToDelete)
        delete=0
    if delete:    
        f.delete()
        
    finding_list = Finding.objects.all()
    data = []
    for i in range(len(finding_list)):
        data.append(finding_list[i].findingNum)
        
    return simplejson.dumps({'message':message,'fnumbers': data,'numDeleted':numToDelete})

dajaxice_functions.register(deleteFinding)

@dajaxice_register
def deleteAllFindings(request):
    findings_list= Finding.objects.all()
    for i in range(len(findings_list)):
        findings_list[i].delete()
        
    finding_list = Finding.objects.all()
    data = []
    for i in range(len(finding_list)):
        data.append(finding_list[i].findingNum)
        
    return simplejson.dumps({'message':"alldelete",'fnumbers': data})

@dajaxice_register
def returnAllAnswerFindings(request,setNum,imageNum):
    #returns answer impression too.
    message = "";  
    try:
        set = Set.objects.get(setNum=setNum)
    except Set.DoesNotExist:
        message = "set does not exist"
        return simplejson.dumps({'message':message}) 
    try:
        image = Image.objects.get(imageNum=imageNum,set=set)
    except Image.DoesNotExist:
        message = "image does not exist"
        return simplejson.dumps({'message':message}) 
    
    ai = AnswerImpression.objects.get(image__imageNum=imageNum,setNum=setNum)
    
    af_list = AnswerFinding.objects.filter(image__imageNum=imageNum,setNum=setNum)  
    data = {"AnswerFindings":[],
            "AnswerImpression":[{
                    "biradsNum":ai.biradsNum,
                    "description":ai.description,
                    "finalPathology":ai.finalPathology,
                    "indications":ai.indications
                               }]}
    choice_list = ai.choices.all()
    
    
    
    for af in af_list:
        choice_list = af.choices.all()
        cdat = []
        for i in range(len(choice_list)):
            cdat.append([choice_list[i].option,choice_list[i].isCorrect])
            
        data['AnswerFindings'].append({"findingNum":af.findingNum,"isCCView":af.isCCView,"isMLOView":af.isMLOView,
                     "xLocCC":af.xLocCC,"yLocCC":af.yLocCC,"xLocMLO":af.xLocMLO,"yLocMLO":af.yLocMLO,
                     "type":af.type,"description":af.description,"choices":cdat})
        
    return simplejson.dumps(data)
        
    





