package com.charithra.nammajatreapp

sealed class AuthState {
    object Splash : AuthState()
    object Login : AuthState()
    object Register : AuthState()
    object Home : AuthState()
}