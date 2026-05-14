package com.charithra.nammajatreapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.ListAlt
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

import com.charithra.nammajatreapp.auth.LoginScreen
import com.charithra.nammajatreapp.auth.RegisterScreen
import com.charithra.nammajatreapp.auth.SplashScreen

import com.charithra.nammajatreapp.ui.screens.*

import com.charithra.nammajatreapp.ui.theme.JatreAPPTheme

import com.google.firebase.auth.FirebaseAuth

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        setContent {

            var authState by remember {

                mutableStateOf<AuthState>(
                    AuthState.Splash
                )
            }

            when (authState) {

                AuthState.Splash -> {

                    SplashScreen(

                        onFinished = {

                            authState = AuthState.Login
                        }
                    )
                }

                AuthState.Login -> {

                    LoginScreen(

                        onLoginSuccess = {

                            authState = AuthState.Home
                        },

                        onRegisterClick = {

                            authState = AuthState.Register
                        }
                    )
                }

                AuthState.Register -> {

                    RegisterScreen(

                        onRegisterSuccess = {

                            authState = AuthState.Home
                        },

                        onLoginClick = {

                            authState = AuthState.Login
                        }
                    )
                }

                AuthState.Home -> {

                    JatreAPPTheme {

                        val navController = rememberNavController()

                        var currentScreen by remember {

                            mutableStateOf("schedule")
                        }

                        Scaffold(

                            bottomBar = {

                                NavigationBar(
                                    containerColor = Color.White
                                ) {

                                    NavigationBarItem(

                                        icon = {

                                            Icon(
                                                Icons.Default.CalendarToday,
                                                contentDescription = "Schedule"
                                            )
                                        },

                                        label = {

                                            Text("Schedule")
                                        },

                                        selected =
                                            currentScreen == "schedule",

                                        onClick = {

                                            currentScreen = "schedule"

                                            navController.navigate("schedule")
                                        }
                                    )

                                    NavigationBarItem(

                                        icon = {

                                            Icon(
                                                Icons.Default.ListAlt,
                                                contentDescription = "Reports"
                                            )
                                        },

                                        label = {

                                            Text("Reports")
                                        },

                                        selected =
                                            currentScreen == "lostfound",

                                        onClick = {

                                            currentScreen = "lostfound"

                                            navController.navigate("lostfound")
                                        }
                                    )

                                    NavigationBarItem(

                                        icon = {

                                            Icon(
                                                Icons.Default.Shield,
                                                contentDescription = "Safety"
                                            )
                                        },

                                        label = {

                                            Text("Safety")
                                        },

                                        selected =
                                            currentScreen == "safety",

                                        onClick = {

                                            currentScreen = "safety"

                                            navController.navigate("safety")
                                        }
                                    )

                                    NavigationBarItem(

                                        icon = {

                                            Icon(
                                                Icons.Default.Person,
                                                contentDescription = "Profile"
                                            )
                                        },

                                        label = {

                                            Text("Profile")
                                        },

                                        selected =
                                            currentScreen == "profile",

                                        onClick = {

                                            currentScreen = "profile"

                                            navController.navigate("profile")
                                        }
                                    )
                                }
                            }

                        ) { innerPadding ->

                            NavHost(

                                navController = navController,

                                startDestination = "schedule",

                                modifier =
                                    Modifier.padding(innerPadding)

                            ) {

                                composable("schedule") {

                                    ScheduleScreen(


                                    )
                                }

                                composable("lostfound") {

                                    LostFoundScreen()
                                }

                                composable("safety") {

                                    SafetyScreen()
                                }

                                composable("profile") {

                                    val firebaseUser =
                                        FirebaseAuth
                                            .getInstance()
                                            .currentUser

                                    ProfileScreen(

                                        user = UserProfile(

                                            displayName =
                                                firebaseUser?.displayName
                                                    ?: "DEVOTEE",

                                            email =
                                                firebaseUser?.email
                                                    ?: "guest@example.com",

                                            photoUrl =
                                                "https://ui-avatars.com/api/?name=Jatre"
                                        ),

                                        onLogout = {

                                            FirebaseAuth
                                                .getInstance()
                                                .signOut()

                                            authState =
                                                AuthState.Login
                                        },

                                        onBack = {

                                            currentScreen = "schedule"

                                            navController.navigate("schedule") {

                                                popUpTo("schedule") {
                                                    inclusive = false
                                                }

                                                launchSingleTop = true
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}