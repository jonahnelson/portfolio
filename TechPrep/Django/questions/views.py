import re, json, requests
from django.shortcuts import render
from datetime import datetime
from django.http import HttpResponse, JsonResponse
from questions.forms import *
from questions.api import *

def home(request):
    return render(request, "questions/home.html")

def create_flash(request):
    if request.method == 'GET':
        form = CreateFlashcardForm(request.GET or None)
        return render(request, "questions/create-flash.html", {'form': form,'error_message': None, 'success_message': None})
    if request.method == 'POST':
        form = CreateFlashcardForm(request.POST or None)
        question = request.POST.get('question', default=None)
        answer = request.POST.get('answer', default=None)
        if form.is_valid:
            creation = create_flash_api(question, answer)
            form = CreateFlashcardForm(request.GET or None)
            if not isinstance(creation, requests.exceptions.ConnectionError):
                if creation:
                    return render(request, "questions/create-flash.html", {'form': form,'error_message': None, 'success_message': 'Question Created Successfully'})
                else:
                    return render(request, "questions/create-flash.html", {'form': form,'error_message': (str(creation) + ' ' + creation.text), 'success_message': None})
            else:
                return render(request, "questions/create-flash.html", {'form': form,'error_message': (str(creation.args[0])), 'success_message': None})
        else:
            return render(request, "questions/create-flash.html", {'form': form,'error_message': form.errors, 'success_message': None})

def create_tech(request):
    if request.method == 'GET':
        form = CreateTechForm(request.GET or None)
        return render(request, "questions/create-tech.html", {'form': form,'error_message': None, 'success_message': None})
    if request.method == 'POST':
        form = CreateTechForm(request.POST or None)
        question = request.POST.get('question', default=None)
        if form.is_valid:
            creation = create_tech_api(question)
            form = CreateTechForm(request.GET or None)
            if not isinstance(creation, requests.exceptions.ConnectionError):
                if creation:
                    return render(request, "questions/create-tech.html", {'form': form,'error_message': None, 'success_message': 'Question Created Successfully'})
                else:
                    return render(request, "questions/create-tech.html", {'form': form,'error_message': (str(creation) + ' ' + creation.text), 'success_message': None})
            else:
                return render(request, "questions/create-tech.html", {'form': form,'error_message': (str(creation.args[0])), 'success_message': None})
        else:
            return render(request, "questions/create-tech.html", {'form': form,'error_message': form.errors, 'success_message': None})

def rank_flash(request):
    questions = get_all_flash_questions()
    if request.method == 'GET':
        form = RankFlashForm(request.GET or None)
        form.load_fields(questions = questions)
        return render(request, "questions/rank-flash.html", {'form': form,'error_message': None, 'success_message': None})
    if request.method == 'POST':
        form = RankFlashForm(request.POST or None)
        question = request.POST.get('question', default=None)
        rank = request.POST.get('rank', default=None)
        comment = request.POST.get('comment', default=None)
        if form.is_valid:
            creation = rank_flash_api(question, rank, comment)
            form = RankFlashForm(request.GET or None)
            form.load_fields(questions = questions)
            if not isinstance(creation, requests.exceptions.ConnectionError):
                if creation:
                    return render(request, "questions/rank-flash.html", {'form': form,'error_message': None, 'success_message': 'Question Ranked Successfully'})
                else:
                    return render(request, "questions/rank-flash.html", {'form': form,'error_message': (str(creation) + ' ' + creation.text), 'success_message': None})
            else:
                return render(request, "questions/rank-flash.html", {'form': form,'error_message': (str(creation.args[0])), 'success_message': None})
        else:
            return render(request, "questions/rank-flash.html", {'form': form,'error_message': form.errors, 'success_message': None})

def rank_tech(request):
    questions = get_all_tech_questions()
    if request.method == 'GET':
        form = RankTechForm(request.GET or None)
        form.load_fields(questions = questions)
        return render(request, "questions/rank-tech.html", {'form': form,'error_message': None, 'success_message': None})
    if request.method == 'POST':
        form = RankTechForm(request.POST or None)
        question = request.POST.get('question', default=None)
        rank = request.POST.get('rank', default=None)
        comment = request.POST.get('comment', default=None)
        if form.is_valid:
            creation = rank_flash_api(question, rank, comment)
            form = RankTechForm(request.GET or None)
            form.load_fields(questions = questions)
            if not isinstance(creation, requests.exceptions.ConnectionError):
                if creation:
                    return render(request, "questions/rank-tech.html", {'form': form,'error_message': None, 'success_message': 'Question Created Successfully'})
                else:
                    return render(request, "questions/rank-tech.html", {'form': form,'error_message': (str(creation) + ' ' + creation.text), 'success_message': None})
            else:
                return render(request, "questions/rank-tech.html", {'form': form,'error_message': (str(creation.args[0])), 'success_message': None})
        else:
            return render(request, "questions/rank-tech.html", {'form': form,'error_message': form.errors, 'success_message': None})

def view_flash(request):
    return render(request, "questions/view-flash.html")

def view_tech(request):
    return render(request, "questions/view-tech.html")

def get_flash(request):
    return JsonResponse(get_all_flash(), safe=False)

def get_tech(request):
    return JsonResponse(get_all_tech(), safe=False)
