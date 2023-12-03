from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import UserRegisterView, LoginView, UserProfileView, FollowerView, FollowingView

urlpatterns = [
    path('token/', LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path("register/", UserRegisterView.as_view(), name="user-register"),
    path("profile/<str:user>/", UserProfileView.as_view(), name="user-profile"),
    path("profile/<str:user>/follower/", FollowerView.as_view(), name="follower"),
    path("profile/<str:user>/following/", FollowingView.as_view(), name="following"),
]
