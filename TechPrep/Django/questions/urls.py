from django.urls import path
from questions import views

urlpatterns = [
    path("", views.home, name="home"),
    path("create-question-flash/", views.create_flash, name="create-flash"),
    path("rank-question-flash/", views.rank_flash, name="rank-flash"),
    path("view-question-flash/", views.view_flash, name="view-flash"),
    path("view-question-flash/get-flash", views.get_flash, name="get-flash"),
    path("create-question-tech/", views.create_tech, name="create-tech"),
    path("rank-question-tech/", views.rank_tech, name="rank-tech"),
    path("view-question-tech/", views.view_tech, name="view-tech"),
    path("view-question-tech/get-tech", views.get_tech, name="get-tech"),

]