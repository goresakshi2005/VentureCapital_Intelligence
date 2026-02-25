from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Company
from .serializers import CompanySerializer

class CompanyList(generics.ListCreateAPIView):  # Changed to ListCreateAPIView (if you want POST, but we have add-company)
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'description', 'industry']
    ordering_fields = ['name', 'founded', 'total_funding']
    filterset_fields = ['industry', 'location']

class CompanyDetail(generics.RetrieveUpdateDestroyAPIView):  # Added Destroy
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from tavily import TavilyClient
import google.generativeai as genai

class EnrichCompany(APIView):
    def post(self, request):
        url = request.data.get('url')
        if not url:
            return Response({'error': 'URL required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tavily = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))
            response = tavily.extract(urls=[url])
            if not response.get('results'):
                return Response({'error': 'Failed to scrape URL'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            content = response['results'][0].get('raw_content', '')

            genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
            Based on the following website content, extract:
            - summary (1-2 sentences)
            - what_they_do (3-6 bullet points)
            - keywords (5-10)
            - derived_signals (2-4 insights like "Careers page exists", "Blog updated recently", "Changelog present")

            Return valid JSON only with keys: summary, what_they_do, keywords, derived_signals.

            Content:
            {content[:10000]}
            """
            gemini_response = model.generate_content(prompt)
            text = gemini_response.text
            if text.startswith('```json'):
                text = text[7:]
            if text.endswith('```'):
                text = text[:-3]
            data = json.loads(text.strip())

            data['sources'] = [url]
            data['timestamp'] = response['results'][0].get('url')
            return Response(data)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddCompany(APIView):
    def post(self, request):
        url = request.data.get('url')
        if not url:
            return Response({'error': 'URL required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tavily = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))
            response = tavily.extract(urls=[url])
            if not response.get('results'):
                return Response({'error': 'Failed to scrape URL'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            content = response['results'][0].get('raw_content', '')

            genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = f"""
            Based on the following website content, extract company information with these fields:
            - name (company name)
            - description (short description, 1-2 sentences)
            - industry
            - location (HQ city and country)
            - founded (year as integer, if available, otherwise null)
            - total_funding (e.g., "$10M" if available, otherwise empty string)
            - last_signal (a recent signal like "Hiring", "Launched product", if available, otherwise empty string)
            - logo (URL of logo if found, otherwise empty string)

            Return valid JSON only with keys: name, description, industry, location, founded, total_funding, last_signal, logo.
            If a field is not found, use empty string or null as appropriate.

            Content:
            {content[:10000]}
            """
            gemini_response = model.generate_content(prompt)
            text = gemini_response.text
            if text.startswith('```json'):
                text = text[7:]
            if text.endswith('```'):
                text = text[:-3]
            data = json.loads(text.strip())

            company = Company.objects.create(
                name=data.get('name', ''),
                website=url,
                description=data.get('description', ''),
                industry=data.get('industry', ''),
                location=data.get('location', ''),
                founded=data.get('founded'),
                total_funding=data.get('total_funding', ''),
                last_signal=data.get('last_signal', ''),
                logo=data.get('logo', '')
            )
            serializer = CompanySerializer(company)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)