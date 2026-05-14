package com.jatre.namma

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.jatre.namma.ui.theme.JatreTheme
import com.jatre.namma.ui.ScheduleScreen
import com.jatre.namma.ui.MapScreen
import com.jatre.namma.ui.LostFoundScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            JatreTheme {
                val navController = rememberNavController()
                Scaffold(
                    bottomBar = {
                        NavigationBar {
                            NavigationBarItem(
                                icon = { /* Schedule Icon */ },
                                label = { Text("Schedule") },
                                selected = false,
                                onClick = { navController.navigate("schedule") }
                            )
                            NavigationBarItem(
                                icon = { /* Map Icon */ },
                                label = { Text("Map") },
                                selected = false,
                                onClick = { navController.navigate("map") }
                            )
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "schedule",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("schedule") { ScheduleScreen() }
                        composable("map") { MapScreen() }
                        composable("lostfound") { LostFoundScreen() }
                    }
                }
            }
        }
    }
}
