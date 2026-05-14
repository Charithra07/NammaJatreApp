package com.charithra.nammajatreapp.ui.theme // Make sure this matches your project

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF800000), // Maroon
    secondary = Color(0xFFFFD700), // Gold
    background = Color(0xFFFFFDF9)
)

@Composable
fun JatreAPPTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}