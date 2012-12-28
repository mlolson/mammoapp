from django.db import models
from django.contrib.auth.models import User

#class UserProfile(models.Model):
#    user = models.OneToOneField(User)
#    activation_key = models.CharField(max_length=40)
#    key_expires = models.DateTimeField()
#    currentSet = models.IntegerField()
#    currentImage = models.IntegerField() 
#    def __unicode__(self):
#        return self.id
        
class Set(models.Model):
<<<<<<< HEAD
    creator = models.ForeignKey(User)
    setNum = models.IntegerField()
    description = models.CharField(max_length=100) 
    def __unicode__(self):
        return unicode(self.id)
=======
    setNum = models.IntegerField()
    type = models.CharField(max_length=10) 
    def __unicode__(self):
        return self.id
>>>>>>> d8c8866efb424a7886463217e0cda3c9cf4aa6b6
        
class Image(models.Model):
    imageNum = models.IntegerField()
    set = models.ForeignKey(Set)
    type = models.CharField(max_length=10)
    def __unicode__(self):
<<<<<<< HEAD
        return unicode(self.id)
=======
        return self.imageNum
>>>>>>> d8c8866efb424a7886463217e0cda3c9cf4aa6b6

class Finding(models.Model):
    #image = models.ForeignKey(Image)
    #ROI params
    #setNum = models.ForeignKey(Set)
    #image = models.ForeignKey(Image)
    xArr = models.CommaSeparatedIntegerField(max_length=100)
    yArr = models.CommaSeparatedIntegerField(max_length=100)
    npoints = models.IntegerField()
    findingNum = models.IntegerField()
    type = models.CharField(max_length=10)
    description = models.CharField(max_length=1000) 
    #def __init__(self, fNum): 
    #    self.findingNum = fNum
    def __unicode__(self):
<<<<<<< HEAD
        return unicode(self.id)
=======
        return self.findingNum
>>>>>>> d8c8866efb424a7886463217e0cda3c9cf4aa6b6

class AnswerFinding(models.Model):  
    #set = models.ForeignKey(Set)
    image = models.ForeignKey(Image)
    setNum = models.IntegerField()
    findingNum = models.IntegerField()
    isCCView = models.BooleanField()
    isMLOView = models.BooleanField()  
    xLocCC = models.IntegerField()
    yLocCC = models.IntegerField()
    xLocMLO = models.IntegerField()
    yLocMLO = models.IntegerField()
    type = models.CharField(max_length=10)
    description = models.CharField(max_length=1000) 
    def __unicode__(self):
<<<<<<< HEAD
        return unicode(self.id)
=======
        return self.findingNum
>>>>>>> d8c8866efb424a7886463217e0cda3c9cf4aa6b6
    
class AnswerImpression(models.Model):
    #setNum = models.IntegerField()
    image =  models.ForeignKey(Image)
<<<<<<< HEAD
    setNum = models.IntegerField()
    biradsNum = models.IntegerField()
    description = models.CharField(max_length=1000)
    indications = models.CharField(max_length=100) 
    finalPathology = models.CharField(max_length=100)      
    def __unicode__(self):
        return unicode(self.id)
=======
    biradsNum = models.IntegerField()
    description = models.CharField(max_length=1000) 
    finalPathology = models.CharField(max_length=1000)      
    def __unicode__(self):
        return self.imageNum
>>>>>>> d8c8866efb424a7886463217e0cda3c9cf4aa6b6
