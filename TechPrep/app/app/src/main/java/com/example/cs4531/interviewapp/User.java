package com.example.cs4531.interviewapp;

import java.io.Serializable;

/** This class implements Serializable in order to send a User object
 *  to other activities via Intents.
 */
public class User implements Serializable {

    private String username;
    private boolean admin;

    public User(String username, boolean admin) {
        this.username = username;
        this.admin = admin;
    }

    public String getUsername() {
        return username;
    }

    public boolean isAdmin() {
        return admin;
    }
}
