from django.shortcuts import redirect
from django.contrib.auth import login as login_user, \
                                logout as logout_user
from django.urls import reverse
from django.views.generic.edit import FormView
from .forms import LoginForm

class LoginView(FormView):
    form_class = LoginForm
    template_name = 'accounts/login.html'

    def form_valid(self, form):
        login_user(self.request, form.cleaned_data['user'])
        return super().form_valid(form)
    
    def get_success_url(self):
        return reverse("shop")

def logout(request):
    logout_user(request)
    return redirect('accounts:login')
