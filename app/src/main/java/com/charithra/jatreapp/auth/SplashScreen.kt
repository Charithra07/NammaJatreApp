package com.charithra.nammajatreapp.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.charithra.nammajatreapp.R
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onFinished: () -> Unit
) {

    LaunchedEffect(Unit) {
        delay(10000)
        onFinished()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8F1DE))
            .padding(horizontal = 20.dp),

        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {

        Image(
            painter = painterResource(id = R.drawable.jatre_logo),
            contentDescription = "Namma Jatre Logo",
            modifier = Modifier.size(150.dp)
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = "NAMMA JATRE",
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF8B0000)
        )

        Spacer(modifier = Modifier.height(18.dp))

        Text(
            text = "ॐ त्र्यम्बकं यजामहे\nसुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥",
            fontSize = 18.sp,
            lineHeight = 30.sp,
            textAlign = TextAlign.Center,
            color = Color(0xFF7A0000),
            fontWeight = FontWeight.Medium
        )

        Spacer(modifier = Modifier.height(14.dp))

        Text(
            text = "Meaning:",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFFB08B00)
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "We worship Lord Shiva,\nwho protects and blesses all beings." +
                    "\nMay He liberate us from fear and suffering," +
                    "\nand bless us with peace and immortality.",

            fontSize = 16.sp,
            lineHeight = 26.sp,
            textAlign = TextAlign.Center,
            color = Color.DarkGray
        )

        Spacer(modifier = Modifier.height(20.dp))

        Image(
            painter = painterResource(id = R.drawable.shiva_bg),
            contentDescription = "Lord Shiva",
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp),

            contentScale = ContentScale.Fit
        )
    }
}