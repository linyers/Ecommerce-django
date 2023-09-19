from rest_framework import pagination


class ProductPagination(pagination.PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    page_query_param = 'p'