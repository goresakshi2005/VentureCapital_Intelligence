from django.db import models

class Company(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    website = models.URLField()
    description = models.TextField(blank=True)
    logo = models.URLField(blank=True)          # placeholder image URL
    industry = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)
    founded = models.IntegerField(null=True, blank=True)
    total_funding = models.CharField(max_length=50, blank=True)   # e.g. "$10M"
    last_signal = models.CharField(max_length=200, blank=True)    # e.g. "Hiring 3 roles"

    def __str__(self):
        return self.name