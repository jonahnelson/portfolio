from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Field, Button
from crispy_forms.bootstrap import InlineCheckboxes

RANK = (
    ('1', '1'),
    ('2', '2'),
    ('3', '3'),
    ('4', '4'),
    ('5', '5'),
    ('6', '6'),
    ('7', '7'),
    ('8', '8'),
    ('9', '9'),
    ('10', '10'),
)

class CreateFlashcardForm(forms.Form):
    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.label_class = 'h4'
        self.helper.form_id = 'crispy_form'
        self.helper.add_input(Submit('submit', 'Create Flashcard'))
        super(CreateFlashcardForm, self).__init__(*args, **kwargs)
        self.fields['question'] = forms.CharField(label='Question', widget= forms.Textarea)
        self.fields['answer'] = forms.CharField(label='Answer', widget= forms.Textarea)

class CreateTechForm(forms.Form):
    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.label_class = 'h4'
        self.helper.form_id = 'crispy_form'
        self.helper.add_input(Submit('submit', 'Create Technical Card'))
        super(CreateTechForm, self).__init__(*args, **kwargs)
        self.fields['question'] = forms.CharField(label='Question', widget= forms.Textarea)

class RankFlashForm(forms.Form):
    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.label_class = 'h4'
        self.helper.form_id = 'crispy_form'
        self.helper.add_input(Submit('submit', 'Rank Flash Card'))
        super(RankFlashForm, self).__init__(*args, **kwargs)

    def load_fields(self, *, questions):
        self.fields['question'] = forms.CharField(label='Question', widget= forms.Select(choices= questions))
        self.fields['rank'] = forms.ChoiceField(label='Rank', choices=RANK, widget=forms.RadioSelect())
        self.fields['comment'] = forms.CharField(label='Comment')

class RankTechForm(forms.Form):
    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.label_class = 'h4'
        self.helper.form_id = 'crispy_form'
        self.helper.add_input(Submit('submit', 'Rank Technical Card'))
        super(RankTechForm, self).__init__(*args, **kwargs)
    
    def load_fields(self, *, questions):
        self.fields['question'] = forms.CharField(label='Question', widget= forms.Select(choices= questions))
        self.fields['rank'] = forms.ChoiceField(label='Rank', choices=RANK, widget=forms.RadioSelect())
        self.fields['comment'] = forms.CharField(label='Comment')
