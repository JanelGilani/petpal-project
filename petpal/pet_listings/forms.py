from django import forms
from .models import Pets

class SearchForm(forms.Form):
    SHELTER = 'shelter'
    STATUS = 'status'
    BREED = 'breed'
    AGE = 'age'
    SIZE = 'size'
    COLOR = 'color'
    GENDER = 'gender'
    
    ORDER_BY_NAME = 'name'
    ORDER_BY_AGE = 'age'
    ORDER_BY_SIZE = 'size'

    STATUS_CHOICES = (
        ('available', 'Available'),
        ('adopted', 'Adopted'),
        ('pending', 'Pending'),
    )

    ORDER_BY_CHOICES = (
        (ORDER_BY_NAME, 'Name'),
        (ORDER_BY_AGE, 'Age'),
        (ORDER_BY_SIZE, 'Size'),
    )

    shelter = forms.CharField(required=False, help_text="Filter by shelter",
                              widget=forms.TextInput({'placeholder': 'Enter shelter name'}))
    status = forms.ChoiceField(choices=STATUS_CHOICES, required=False, initial='available',
                               help_text="Filter by status")
    breed = forms.CharField(required=False, help_text="Filter by breed",
                            widget=forms.TextInput({'placeholder': 'Enter breed'}))
    age = forms.IntegerField(required=False, help_text="Filter by age",
                             widget=forms.NumberInput(attrs={'placeholder': 'Enter age'}))
    size = forms.CharField(required=False, help_text="Filter by size",
                           widget=forms.TextInput({'placeholder': 'Enter size'}))
    color = forms.CharField(required=False, help_text="Filter by color",
                            widget=forms.TextInput({'placeholder': 'Enter color'}))
    gender = forms.CharField(required=False, help_text="Filter by gender",
                             widget=forms.TextInput({'placeholder': 'Enter gender'}))
    order_by = forms.ChoiceField(choices=ORDER_BY_CHOICES, required=False)

    def clean(self):
        cleaned = super().clean()
        if not cleaned.get('status'):
            cleaned['status'] = 'available'
        if not cleaned.get('order_by'):
            cleaned['order_by'] = SearchForm.ORDER_BY_NAME
        return cleaned
