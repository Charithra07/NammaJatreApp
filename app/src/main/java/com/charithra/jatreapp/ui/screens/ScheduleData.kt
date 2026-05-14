package com.charithra.nammajatreapp.ui.screens

data class ScheduleItem(

    val title: String,
    val location: String,
    val time: String,
    val description: String,
    val category: String,
    val date: String,
    val isLive: Boolean = false
)

val scheduleList = listOf(

    ScheduleItem(
        "Suprabhatha Seva",
        "Main Temple",
        "05:30 AM",
        "Morning prayers",
        "Religious",
        "May 14",
        true
    ),

    ScheduleItem(
        "Dhwajarohana",
        "Temple Mast",
        "10:00 AM",
        "Flag hoisting",
        "Religious",
        "May 14",
        true
    ),

    ScheduleItem(
        "Mass Annadana",
        "Bhojana Shale",
        "01:00 PM",
        "Community feast",
        "Other",
        "May 14"
    ),

    ScheduleItem(
        "Grand Wrestling",
        "Village Akhada",
        "08:30 PM",
        "Traditional kusti matches",
        "Games",
        "May 14"
    ),

    ScheduleItem(
        "Mythological Drama",
        "Open Air Theatre",
        "10:00 PM",
        "Night drama performance",
        "Drama",
        "May 17"
    ),ScheduleItem(
        "Pallakki Utsava",
        "Temple Street",
        "07:00 AM",
        "Sacred deity procession through village streets",
        "Religious",
        "May 15"
    ),

    ScheduleItem(
        "Maha Mangalarathi",
        "Main Temple",
        "08:00 PM",
        "Grand evening aarati with devotees",
        "Religious",
        "May 14",

    ),

    ScheduleItem(
        "Village Wrestling Finals",
        "Jatre Ground",
        "06:30 PM",
        "Traditional kusti championship event",
        "Games",
        "May 14"
    ),

    ScheduleItem(
        "Bullock Cart Race",
        "East Field",
        "04:00 PM",
        "Traditional village racing competition",
        "Games",
        "May 16"
    ),

    ScheduleItem(
        "Yakshagana Night",
        "Cultural Stage",
        "09:30 PM",
        "Mythological Kannada stage performance",
        "Drama",
        "May 15"
    ),

    ScheduleItem(
        "Comedy Drama",
        "Open Theatre",
        "10:30 PM",
        "Village comedy entertainment show",
        "Drama",
        "May 16"
    ),

    ScheduleItem(
        "Classical Dance Program",
        "Cultural Stage",
        "05:00 PM",
        "Bharatanatyam and folk dance performances",
        "Other",
        "May 15"
    ),

    ScheduleItem(
        "Devotional Orchestra",
        "Temple Grounds",
        "07:30 PM",
        "Live devotional music concert",
        "Other",
        "May 15"
    ),

    ScheduleItem(
        "Mass Annadana",
        "Bhojana Shale",
        "01:00 PM",
        "Community lunch for all devotees",
        "Other",
        "May 17"
    ),

    ScheduleItem(
        "Chariot Festival",
        "Temple Entrance",
        "08:30 PM",
        "Grand ratha pulling ceremony",
        "Religious",
        "May 14",
        true
    ),

    ScheduleItem(
        "Fireworks Celebration",
        "Lake Ground",
        "11:45 PM",
        "Colorful fireworks marking festival finale",
        "Other",
        "May 17"
    ),
    ScheduleItem(
        "Temple Decoration Ceremony",
        "Temple Entrance",
        "09:00 AM",
        "Flower decoration and lighting rituals",
        "Religious",
        "May 16"
    ),

    ScheduleItem(
        "Kids Fancy Dress",
        "School Ground",
        "11:00 AM",
        "Children cultural costume competition",
        "Other",
        "May 16"
    ),

    ScheduleItem(
        "Folk Dance Competition",
        "Main Stage",
        "04:30 PM",
        "Village teams performing folk dances",
        "Other",
        "May 16"
    ),

    ScheduleItem(
        "Dollu Kunitha",
        "Cultural Stage",
        "06:00 PM",
        "Traditional drum dance performance",
        "Drama",
        "May 14",
        true
    ),

    ScheduleItem(
        "Night DJ Festival",
        "Open Ground",
        "09:00 PM",
        "Youth celebration music event",
        "Other",
        "May 14",
        true
    ),

    ScheduleItem(
        "Special Pooja",
        "Garbhagudi",
        "05:00 AM",
        "Early morning deity worship",
        "Religious",
        "May 16"
    ),

    ScheduleItem(
        "Drama Finals",
        "Village Theatre",
        "08:00 PM",
        "Final stage drama competition",
        "Drama",
        "May 17"
    )


)