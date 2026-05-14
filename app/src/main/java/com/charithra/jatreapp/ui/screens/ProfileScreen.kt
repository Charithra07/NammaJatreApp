package com.charithra.nammajatreapp.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle

import androidx.compose.material3.*

import androidx.compose.runtime.Composable

import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip

import androidx.compose.ui.graphics.Color

import androidx.compose.ui.layout.ContentScale

import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight

import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

import coil.compose.rememberAsyncImagePainter

@Composable
fun ProfileScreen(
    user: UserProfile,
    onLogout: () -> Unit,
    onBack: () -> Unit
) {

    Column(

        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .background(Color(0xFFFFFDF9))
            .padding(24.dp),

        horizontalAlignment = Alignment.CenterHorizontally

    ) {

        Text(
            text = "|| SHUBHAMASTHU ||",
            fontSize = 10.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = 4.sp,
            color = Color(0xFF800000),

            modifier = Modifier.padding(top = 16.dp)
        )

        Text(
            text = "DEVATARA SWAGAATHA",

            fontSize = 18.sp,

            fontWeight = FontWeight.Bold,

            fontFamily = FontFamily.Serif,

            color = Color(0xFF800000)
        )

        Spacer(modifier = Modifier.height(8.dp))

        Box(

            modifier = Modifier
                .width(100.dp)
                .height(2.dp)
                .background(Color(0xFFFFD700))
        )

        Spacer(modifier = Modifier.height(32.dp))

        Box(
            contentAlignment = Alignment.BottomEnd
        ) {

            Image(

                painter =
                    rememberAsyncImagePainter(
                        user.photoUrl
                    ),

                contentDescription = null,

                modifier = Modifier
                    .size(140.dp)
                    .clip(CircleShape)
                    .border(
                        4.dp,
                        Color(0xFFFFD700),
                        CircleShape
                    ),

                contentScale = ContentScale.Crop
            )

            Surface(

                modifier = Modifier.size(40.dp),

                shape = CircleShape,

                color = Color(0xFFFFD700),

                shadowElevation = 8.dp
            ) {

                Icon(

                    imageVector =
                        Icons.Default.CheckCircle,

                    contentDescription = null,

                    tint = Color(0xFF800000),

                    modifier = Modifier.padding(8.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(

            text = user.displayName.uppercase(),

            fontSize = 28.sp,

            fontWeight = FontWeight.Black,

            fontFamily = FontFamily.Serif
        )

        Text(

            text = user.email,

            fontSize = 10.sp,

            fontWeight = FontWeight.Bold,

            color = Color.Gray,

            letterSpacing = 2.sp
        )

        Spacer(modifier = Modifier.height(32.dp))

        Card(

            modifier = Modifier
                .fillMaxWidth()
                .border(
                    2.dp,
                    Color(0xFFFFD700),
                    RoundedCornerShape(32.dp)
                ),

            colors = CardDefaults.cardColors(
                containerColor = Color(0xFFFFF8E1)
            ),

            shape = RoundedCornerShape(32.dp)

        ) {

            Column(
                modifier = Modifier.padding(24.dp)
            ) {

                Text(

                    text = "PERSONALIZED INVITATION",

                    fontSize = 9.sp,

                    fontWeight = FontWeight.Black,

                    color = Color(0xFF800000),

                    modifier = Modifier.alpha(0.6f)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text(

                    text =
                        "\"Koti koti namaskaara! You are warmly invited to witness the divine grandeur and traditions of Namma Jatre. May the deity bless your home.\"",

                    fontSize = 20.sp,

                    fontFamily = FontFamily.Serif,

                    fontStyle = FontStyle.Italic,

                    lineHeight = 28.sp,

                    color = Color(0xFF800000)
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        Button(

            onClick = onBack,

            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),

            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF800000)
            ),

            shape = RoundedCornerShape(16.dp)

        ) {

            Text(

                text = "RETURN TO JATRE",

                fontWeight = FontWeight.Black,

                color = Color(0xFFFFD700)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        TextButton(
            onClick = onLogout
        ) {

            Text(

                text = "SIGN OUT",

                color = Color.Red,

                fontSize = 10.sp,

                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(40.dp))
    }
}

data class UserProfile(

    val displayName: String,

    val email: String,

    val photoUrl: String
)