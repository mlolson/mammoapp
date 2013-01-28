from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Team(models.Model):
    name = models.CharField(max_length=40)
    def __str__(self):
        return "%s" % self.name
    
class UserProfile(models.Model):
    user = models.OneToOneField(User)
    team = models.ForeignKey(Team)      
    def __str__(self):  
          return "%s" % self.user

class Record1(models.Model):
    description = models.CharField(max_length=100)
    last_to_update = models.ForeignKey(User,related_name='record1s')
    date_last_updated = models.DateField()
    number1 = models.IntegerField()
    number2 = models.IntegerField()
    radio_choice = models.IntegerField()
    text_data = models.CharField(max_length=100)
    checkbox_choices = models.CommaSeparatedIntegerField(max_length=10) 
    def __str__(self):
        return "%s" % self.id
    
class Record2(models.Model):
    name = models.CharField(max_length=40)
    description = models.CharField(max_length=40)
    last_to_update = models.ForeignKey(User,related_name='record2s')
    team = models.ForeignKey(Team)
    date_last_updated = models.DateField()
    first_number = models.IntegerField()
    number = models.IntegerField()
    text = models.CharField(max_length=100) 
    radio_choice = models.IntegerField()
    checkbox_choice = models.CommaSeparatedIntegerField(max_length=10)
    def __str__(self):
        return "%s" % self.name
    
class Record3(models.Model):
    name = models.CharField(max_length=40)
    description = models.CharField(max_length=40)
    last_to_update = models.ForeignKey(User,related_name='record3s')
    team = models.ForeignKey(Team)
    date_last_updated = models.DateField()
    number = models.IntegerField()
    text = models.CharField(max_length=100)
    checkbox_choice = models.CommaSeparatedIntegerField(max_length=10)
    def __str__(self):
        return "%s" % self.name   