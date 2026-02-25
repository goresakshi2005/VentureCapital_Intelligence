from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Company
from .serializers import CompanySerializer

class CompanyList(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'description', 'industry']
    ordering_fields = ['name', 'founded', 'total_funding']
    filterset_fields = ['industry', 'location']
    # pagination can be added if needed

class CompanyDetail(generics.RetrieveAPIView):
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
            # 1. Scrape using Tavily Extract
            tavily = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))
            # Tavily extract expects a list of URLs
            response = tavily.extract(urls=[url])
            if not response.get('results'):
                return Response({'error': 'Failed to scrape URL'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            content = response['results'][0].get('raw_content', '')

            # 2. Structure using Gemini
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
            {content[:10000]}  # limit to 10k chars
            """
            gemini_response = model.generate_content(prompt)
            # Gemini returns text; we need to parse JSON
            text = gemini_response.text
            # Remove markdown code fences if present
            if text.startswith('```json'):
                text = text[7:]
            if text.endswith('```'):
                text = text[:-3]
            data = json.loads(text.strip())

            # Add metadata
            data['sources'] = [url]
            data['timestamp'] = response['results'][0].get('url')  # or current time
            return Response(data)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)