package com.nammajatre.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val MaroonPrimary = Color(0xFF800000)
val GoldSecondary = Color(0xFFFFD700)
val BackgroundBeige = Color(0xFFFFFDF9)

val CustomColorScheme = lightColorScheme(
    primary = MaroonPrimary,
    secondary = GoldSecondary,
    background = BackgroundBeige,
    surface = Color.White
)

val CustomTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Black,
        fontSize = 58.sp,
        letterSpacing = (-2).sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp
    ),
    labelMedium = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 12.sp,
        letterSpacing = 0.1.sp
    )
)
