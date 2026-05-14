package com.charithra.nammajatreapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Phone

import androidx.compose.material3.*

import androidx.compose.runtime.*

import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

import com.charithra.nammajatreapp.LostFoundItem
import com.charithra.nammajatreapp.LostFoundRepository

@Composable
fun LostFoundScreen() {

    var showDialog by remember {

        mutableStateOf(false)
    }

    var items by remember {

        mutableStateOf<List<LostFoundItem>>(emptyList())
    }

    LaunchedEffect(Unit) {

        LostFoundRepository.fetchReports {

            items = it
        }
    }

    Scaffold(

        floatingActionButton = {

            ExtendedFloatingActionButton(

                onClick = {

                    showDialog = true
                },

                containerColor = Color(0xFF800000),

                contentColor = Color(0xFFFFD700),

                icon = {

                    Icon(
                        Icons.Default.Add,
                        contentDescription = null
                    )
                },

                text = {

                    Text(
                        "REPORT ITEM",
                        fontWeight = FontWeight.Black
                    )
                }
            )
        }
    ) { padding ->

        LazyColumn(

            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),

            verticalArrangement =
                Arrangement.spacedBy(16.dp)
        ) {

            item {

                SectionHeader(
                    "Bulletin Board",
                    "Recent reports from the fair grounds."
                )
            }

            items(items) { item ->

                ItemCard(item)
            }

            item {

                NoticeCard()
            }
        }

        if(showDialog) {

            ReportDialog(

                onDismiss = {

                    showDialog = false
                }
            )
        }
    }
}

@Composable
fun ReportDialog(
    onDismiss: () -> Unit
) {

    var title by remember {

        mutableStateOf("")
    }

    var description by remember {

        mutableStateOf("")
    }

    var contact by remember {

        mutableStateOf("")
    }

    var type by remember {

        mutableStateOf("lost")
    }

    AlertDialog(

        onDismissRequest = onDismiss,

        confirmButton = {

            Button(

                onClick = {

                    val item = LostFoundItem(

                        title = title,

                        description = description,

                        type = type,

                        contact = contact
                    )

                    LostFoundRepository.addReport(

                        item = item,

                        onSuccess = {

                            onDismiss()
                        },

                        onError = {

                        }
                    )
                }
            ) {

                Text("SUBMIT")
            }
        },

        dismissButton = {

            TextButton(
                onClick = onDismiss
            ) {

                Text("CANCEL")
            }
        },

        title = {

            Text("Report Item")
        },

        text = {

            Column {

                OutlinedTextField(

                    value = title,

                    onValueChange = {

                        title = it
                    },

                    label = {

                        Text("Item Title")
                    }
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(

                    value = description,

                    onValueChange = {

                        description = it
                    },

                    label = {

                        Text("Description")
                    }
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(

                    value = contact,

                    onValueChange = {

                        contact = it
                    },

                    label = {

                        Text("Phone Number")
                    }
                )

                Spacer(modifier = Modifier.height(12.dp))

                Row {

                    Button(

                        onClick = {

                            type = "lost"
                        },

                        colors = ButtonDefaults.buttonColors(

                            containerColor =
                                if(type == "lost")
                                    Color(0xFF940637)
                                else
                                    Color.LightGray
                        )
                    ) {

                        Text(
                            "LOST",
                            color = Color.White
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Button(

                        onClick = {

                            type = "found"
                        },

                        colors = ButtonDefaults.buttonColors(

                            containerColor =
                                if(type == "found")
                                    Color(0xFF085425)
                                else
                                    Color.LightGray
                        )
                    ) {

                        Text(
                            "FOUND",
                            color = Color.White
                        )
                    }
                }
            }
        }
    )
}

@Composable
fun ItemCard(item: LostFoundItem) {

    val bgColor =
        if (item.type == "lost")
            Color(0xFFFEF2F2)
        else
            Color(0xFFF0FDF4)

    val borderColor =
        if (item.type == "lost")
            Color(0xFFFEE2E2)
        else
            Color(0xFFDCFCE7)

    val accentColor =
        if (item.type == "lost")
            Color(0xFFB91C1C)
        else
            Color(0xFF15803D)

    Card(

        modifier = Modifier
            .fillMaxWidth()
            .border(
                1.dp,
                borderColor,
                RoundedCornerShape(24.dp)
            ),

        colors = CardDefaults.cardColors(
            containerColor = bgColor
        ),

        shape = RoundedCornerShape(24.dp)
    ) {

        Row(

            modifier = Modifier.padding(16.dp),

            verticalAlignment =
                Alignment.CenterVertically
        ) {

            Box(

                modifier = Modifier
                    .background(
                        accentColor,
                        RoundedCornerShape(8.dp)
                    )
                    .padding(
                        horizontal = 8.dp,
                        vertical = 4.dp
                    )
            ) {

                Text(

                    item.type.uppercase(),

                    color = Color.White,

                    fontSize = 8.sp,

                    fontWeight = FontWeight.Black
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(
                modifier = Modifier.weight(1f)
            ) {

                Text(
                    item.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )

                Text(
                    item.description,
                    fontSize = 12.sp,
                    color = Color.Gray
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    verticalAlignment =
                        Alignment.CenterVertically
                ) {

                    Icon(
                        Icons.Default.Phone,
                        contentDescription = null,
                        modifier = Modifier.size(12.dp),
                        tint = accentColor
                    )

                    Spacer(modifier = Modifier.width(4.dp))

                    Text(
                        item.contact,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = accentColor
                    )
                }
            }
        }
    }
}

@Composable
fun NoticeCard() {

    Card(

        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 16.dp),

        colors = CardDefaults.cardColors(
            containerColor = Color(0xFFFFF8E1)
        ),

        shape = RoundedCornerShape(32.dp)
    ) {

        Column(

            modifier = Modifier.padding(24.dp),

            horizontalAlignment =
                Alignment.CenterHorizontally
        ) {

            Icon(
                Icons.Default.Info,
                contentDescription = null,
                tint = Color(0xFF800000)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                "NOTICE",
                fontWeight = FontWeight.Black,
                color = Color(0xFF800000)
            )

            Text(

                "Found items can be collected from the Temple Office.",

                textAlign = TextAlign.Center,

                fontSize = 11.sp,

                color = Color(0xFF800000)
                    .copy(alpha = 0.7f)
            )
        }
    }
}

@Composable
fun SectionHeader(
    title: String,
    subtitle: String? = null
) {

    Column(
        modifier = Modifier.padding(bottom = 8.dp)
    ) {

        Text(

            text = title.uppercase(),

            fontSize = 24.sp,

            fontWeight = FontWeight.Black,

            color = Color(0xFF800000)
        )

        if (subtitle != null) {

            Text(

                text = subtitle,

                fontSize = 12.sp,

                color = Color.Gray,

                lineHeight = 16.sp
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Box(

            modifier = Modifier
                .width(60.dp)
                .height(3.dp)
                .background(Color(0xFFFFD700))
        )
    }
}