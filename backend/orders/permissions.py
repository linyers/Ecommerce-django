from rest_framework import permissions


class IsOwnerOrDeliverer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if not obj.shipping and request.user.is_deliverer:
            return True
        return obj.costumer == request.user or obj.shipping.deliverer == request.user  or request.user.is_superuser
