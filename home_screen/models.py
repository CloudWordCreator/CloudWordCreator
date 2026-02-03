from django.db import models

# Create your models here.

class Announcement(models.Model):
    CATEGORY_CHOICES = (
        ('UPDATE', 'Update'),
        ('MATERIAL', 'New Material'),
        ('MAINTENANCE', 'Maintenance'),
        ('INFO', 'Information'),
    )

    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='INFO')

    def __str__(self):
        return f"{self.get_category_display()}: {self.title}"
    
    class Meta:
        ordering = ['-created_at']
