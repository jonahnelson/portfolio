package com.example.cs4531.interviewapp;

public class Credentials {
    private User [] UserArray = new User[4];//create an array of type user, currently with our emails as the users

    public Credentials(){
            UserArray[0] = new User("baume032@d.umn.edu", true);
            UserArray[1] = new User("favor019@d.umn.edu",true);
            UserArray[2] = new User("schab076@d.umn.edu", true);
            UserArray[3] = new User("moexx399@d.umn.edu", true);
        }

    public User[] getUserArray()
    {
        return UserArray;
    }

    public void setUserArray(User[] userArray)
    {
        UserArray = userArray;
    }

}
