package com.charithra.nammajatreapp

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.auth.userProfileChangeRequest

object AuthManager {

    private val auth = FirebaseAuth.getInstance()
    private val firestore = FirebaseFirestore.getInstance()

    fun currentUser() = auth.currentUser

    fun loginUser(
        email: String,
        password: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        auth.signInWithEmailAndPassword(email, password)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it.message ?: "Login failed")
            }
    }

    fun registerUser(
        name: String,
        email: String,
        password: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {

        auth.createUserWithEmailAndPassword(email, password)

            .addOnSuccessListener { result ->

                val profileUpdates = userProfileChangeRequest {

                    displayName = name
                }

                result.user?.updateProfile(profileUpdates)

                    ?.addOnCompleteListener {

                        onSuccess()
                    }
            }

            .addOnFailureListener {

                onError(
                    it.message ?: "Registration Failed"
                )
            }
    }

    fun signOut() {
        auth.signOut()
    }
}