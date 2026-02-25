from django.urls import path
from .views import CompanyList, CompanyDetail, EnrichCompany

urlpatterns = [
    path('companies/', CompanyList.as_view(), name='company-list'),
    path('companies/<int:pk>/', CompanyDetail.as_view(), name='company-detail'),
    path('enrich/', EnrichCompany.as_view(), name='enrich'),
]