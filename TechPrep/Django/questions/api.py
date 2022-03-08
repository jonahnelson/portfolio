import requests, json
from web_project.settings import SERVER_URL
from django.http import HttpResponse

def create_tech_api(question):
    url = SERVER_URL + "/createTechAPI"
    payload  = {
	'question' : question,
	'authorName' : "Admin Interface",
    'loguser': 'admin@d.umn.edu',
    'logpassword': 'Bulldogs'
    }
    headers = {
    'Content-Type': 'application/json'
    }
    try:
        response = requests.post(url, headers=headers, json = payload)
        return response
    except requests.exceptions.RequestException as e:
        return e

def create_flash_api(question, answer):
    url = SERVER_URL + "/createFlashAPI"
    payload  = {
	'question' : question,
    'answer' : answer,
	'authorName' : "Admin Interface",
    'loguser': 'admin@d.umn.edu',
    'logpassword': 'Bulldogs'
    }
    headers = {
    'Content-Type': 'application/json'
    }
    try:
        response = requests.post(url, headers=headers, json = payload)
        return response
    except requests.exceptions.RequestException as e:
        return e

def rank_flash_api(question, rank, comment):
    url = SERVER_URL + "/RankFlashAdmin"
    payload  = {
	'question' : question,
    'rank' : int(rank),
	'user' : "Admin Interface",
    'comment' : comment
    }
    headers = {
    'Content-Type': 'application/json'
    }
    try:
        response = requests.post(url, headers=headers, json = payload)
        return response
    except requests.exceptions.RequestException as e:
        return e

def rank_tech_api(question, rank, comment):
    url = SERVER_URL + "/RankTechAdmin"
    payload  = {
	'question' : question,
    'rank' : int(rank),
	'user' : "Admin Interface",
    'comment' : comment
    }
    headers = {
    'Content-Type': 'application/json'
    }
    try:
        response = requests.post(url, headers=headers, json = payload)
        return response
    except requests.exceptions.RequestException as e:
        return e

def get_all_flash_questions():
    url = SERVER_URL + "/getAllFlash"
    questions = []
    try:
        response = requests.get(url)
        data = json.loads(response.text)
        for items in data:
            questions += [(items['question'], items['question'])]
        return questions
    except:
        questions += [('Server is Down', 'Server is Down')]
        return questions

def get_all_tech_questions():
    url = SERVER_URL + "/getAllTechnical"
    questions = []
    try:
        response = requests.get(url)
        data = json.loads(response.text)
        for items in data:
            questions += [(items['question'], items['question'])]
        return questions
    except:
        questions += [('Server is Down', 'Server is Down')]
        return questions

def get_all_flash():
    url = SERVER_URL + "/getAllFlash"
    try:
        response = requests.get(url)
        data = json.loads(response.text)
        return data
    except:
        return None

def get_all_tech():
    url = SERVER_URL + "/getAllTechnical"
    try:
        response = requests.get(url)
        data = json.loads(response.text)
        return data
    except:
        return None