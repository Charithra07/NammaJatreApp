package com.charithra.nammajatreapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SafetyScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFFFDF9))
            .padding(16.dp)
    ) {
        SectionHeader("Safety Guide", "Emergency contacts & tips")
        
        Spacer(modifier = Modifier.height(16.dp))
        
        LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            item {
                EmergencyCard()
            }
            item {
                Text(
                    "SAFETY TIPS",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray,
                    letterSpacing = 2.sp
                )
            }
            items(safetyTips) { tip ->
                SafetyTipCard(tip)
            }
        }
    }
}

@Composable
fun EmergencyCard() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF800000)),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.LocalHospital, contentDescription = null, tint = Color(0xFFFFD700))
                Spacer(modifier = Modifier.width(12.dp))
                Text("EMERGENCY HELP", color = Color(0xFFFFD700), fontWeight = FontWeight.Black)
            }
            Spacer(modifier = Modifier.height(16.dp))
            EmergencyRow("Police / Security", "100 / 112")
            EmergencyRow("Medical Booth", "+91 99887 76655")
            EmergencyRow("Lost & Found Desk", "Available at Main Office")
        }
    }
}

@Composable
fun EmergencyRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = Color.White.copy(alpha = 0.7f), fontSize = 12.sp)
        Text(value, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
    }
}

data class SafetyTip(val title: String, val desc: String, val icon: ImageVector)

@Composable
fun SafetyTipCard(tip: SafetyTip) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(tip.icon, contentDescription = null, tint = Color(0xFF800000), modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(tip.title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(tip.desc, fontSize = 12.sp, color = Color.Gray)
            }
        }
    }
}

val safetyTips = listOf(
    SafetyTip("Stay Hydrated", "Free drinking water is available at all food halls.", Icons.Default.Shield),
    SafetyTip("Child Safety", "Ensure children have your contact info in their pockets.", Icons.Default.Shield),
    SafetyTip("First Aid", "Primary medical booth is near the North Entrance.", Icons.Default.Shield)
)
