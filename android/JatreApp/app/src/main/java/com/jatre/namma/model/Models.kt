package com.jatre.namma.model

data class Event(
    val id: String = "",
    val title: String = "",
    val time: String = "",
    val location: String = "",
    val type: String = "other",
    val status: String = "upcoming",
    val description: String = ""
)

data class LostFoundItem(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val type: String = "lost",
    val status: String = "active",
    val imageUrl: String = "",
    val contactInfo: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

data class FairMarker(
    val id: String = "",
    val name: String = "",
    val type: String = "stall",
    val lat: Double = 0.0,
    val lng: Double = 0.0
)
