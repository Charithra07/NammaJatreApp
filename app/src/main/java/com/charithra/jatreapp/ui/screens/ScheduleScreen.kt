package com.charithra.nammajatreapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.ui.unit.sp

@Composable
fun ScheduleScreen() {

    var selectedCategory by remember {

        mutableStateOf("All")
    }

    val filteredList = if (selectedCategory == "All") {

        scheduleList

    } else {

        scheduleList.filter {

            it.category == selectedCategory
        }
    }

    Column(

        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF7F5F2))
            .padding(16.dp)
    ) {

        Text(
            text = "JATRE SCHEDULE",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF8B0000)
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Daily events and rituals",
            color = Color.Gray,
            fontSize = 18.sp
        )

        Spacer(modifier = Modifier.height(20.dp))

        Card(

            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp),

            shape = RoundedCornerShape(30.dp),

            colors = androidx.compose.material3.CardDefaults.cardColors(
                containerColor = Color(0xFF8B0000)
            )
        ) {

            Column(

                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),

                verticalArrangement = Arrangement.SpaceBetween
            ) {

                Column {

                    Text(
                        text = "NAMMA JATRE 2026",
                        color = Color.White,
                        fontSize = 30.sp,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Celebrate traditions, rituals, games and divine festivities together.",
                        color = Color(0xFFFFF3E0),
                        fontSize = 16.sp
                    )
                }

                Box(

                    modifier = Modifier
                        .background(
                            Color(0xFFFFD54F),
                            RoundedCornerShape(20.dp)
                        )
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {

                    Text(
                        text = "LIVE FESTIVAL",
                        color = Color.Black,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.horizontalScroll(rememberScrollState())
        ) {

            CategoryButton("All", selectedCategory) {
                selectedCategory = "All"
            }

            CategoryButton("Religious", selectedCategory) {
                selectedCategory = "Religious"
            }

            CategoryButton("Games", selectedCategory) {
                selectedCategory = "Games"
            }

            CategoryButton("Drama", selectedCategory) {
                selectedCategory = "Drama"
            }

            CategoryButton("Other", selectedCategory) {
                selectedCategory = "Other"
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        LazyColumn(

            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {

            items(filteredList) { item ->



                ScheduleCard(item)
            }
        }
    }
}

@Composable
fun CategoryButton(

    text: String,
    selected: String,
    onClick: () -> Unit
) {

    val backgroundColor = if (text == selected) {

        Color(0xFF8B0000)

    } else {

        Color.White
    }

    val textColor = if (text == selected) {

        Color.White

    } else {

        Color.Black
    }

    Box(

        modifier = Modifier
            .background(
                backgroundColor,
                RoundedCornerShape(50.dp)
            )
            .clickable {

                onClick()
            }
            .padding(horizontal = 16.dp, vertical = 10.dp)
    ) {

        Text(
            text = text,
            color = textColor,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun ScheduleCard(item: ScheduleItem) {

    val categoryColor = when(item.category) {

        "Religious" -> Color(0xFFFFE0B2)
        "Games" -> Color(0xFFD6E4FF)
        "Drama" -> Color(0xFFE9D5FF)
        else -> Color(0xFFE5E7EB)
    }

    val cardBackground = if(item.isLive) {

        Color(0xFFFFF8E1)

    } else {

        Color.White
    }

    Card(

        shape = RoundedCornerShape(28.dp),

        modifier = Modifier.fillMaxWidth(),

        colors = androidx.compose.material3.CardDefaults.cardColors(
            containerColor = Color.White
        ),

        elevation = androidx.compose.material3.CardDefaults.cardElevation(
            defaultElevation = 6.dp
        )
    ) {

        Column(

            modifier = Modifier
                .background(cardBackground)
                .padding(20.dp)
        ) {

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {

                Box(

                    modifier = Modifier
                        .background(
                            categoryColor,
                            RoundedCornerShape(20.dp)
                        )
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {

                    Text(
                        text = item.category.uppercase(),
                        color = Color(0xFF8B0000),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Box(

                    modifier = Modifier
                        .background(
                            Color(0xFFFFEBEE),
                            RoundedCornerShape(14.dp)
                        )
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {

                    Text(
                        text = item.date,
                        color = Color(0xFF8B0000),
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            if(item.isLive) {

                Spacer(modifier = Modifier.height(10.dp))

                Box(

                    modifier = Modifier
                        .background(
                            Color.Red,
                            RoundedCornerShape(12.dp)
                        )
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {

                    Text(
                        text = "HAPPENING NOW",
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))
            }

            Text(
                text = item.title,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1A1A1A)
            )

            Spacer(modifier = Modifier.height(18.dp))

            Row {

                Icon(
                    imageVector = Icons.Default.LocationOn,
                    contentDescription = null,
                    tint = Color.Gray
                )

                Spacer(modifier = Modifier.width(6.dp))

                Text(
                    text = item.location,
                    color = Color.Gray,
                    fontSize = 18.sp
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = item.time,
                color = Color(0xFF8B0000),
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = item.description,
                color = Color.DarkGray,
                fontSize = 17.sp
            )
        }
    }
}