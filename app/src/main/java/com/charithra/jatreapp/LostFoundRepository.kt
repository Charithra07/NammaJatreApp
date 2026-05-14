package com.charithra.nammajatreapp

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ListenerRegistration

data class LostFoundItem(

    val title: String = "",
    val description: String = "",
    val type: String = "",
    val contact: String = ""
)

object LostFoundRepository {

    private val firestore =
        FirebaseFirestore.getInstance()

    fun addReport(

        item: LostFoundItem,

        onSuccess: () -> Unit,

        onError: (String) -> Unit
    ) {

        firestore
            .collection("lost_found")

            .add(item)

            .addOnSuccessListener {

                onSuccess()
            }

            .addOnFailureListener {

                onError(
                    it.message ?: "Upload failed"
                )
            }
    }

    fun fetchReports(

        onDataChanged: (List<LostFoundItem>) -> Unit
    ): ListenerRegistration {

        return firestore
            .collection("lost_found")

            .addSnapshotListener { snapshot, _ ->

                if (snapshot != null) {

                    val reports = snapshot.documents.mapNotNull {

                        it.toObject(LostFoundItem::class.java)
                    }

                    onDataChanged(reports)
                }
            }
    }
}