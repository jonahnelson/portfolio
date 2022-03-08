package com.example.cs4531.interviewapp;

import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Color;
import android.media.Image;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.MediaController;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.VideoView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;


public class PlayVideoActivity extends AppCompatActivity {
    private VideoView vid;
    private String url, title, username, comments;
    private TextView titleView, usernameView, videoLoadingView, commentsView;
    private Button deleteVideoButton;

    //Need both. Don't want to only delete one reference when the delete button is hit.
    private StorageReference mStorageRef;
    private DatabaseReference mDatabaseRef;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_play_video);
        Bundle bundle = getIntent().getExtras();
        vid = findViewById(R.id.videoview);
        titleView = findViewById(R.id.titleView);
        usernameView = findViewById(R.id.usernameView);
        videoLoadingView = findViewById(R.id.videoLoadingView);
        commentsView = findViewById(R.id.commentsView);
        deleteVideoButton = findViewById(R.id.deleteVideoButton);
        deleteVideoButton.setBackgroundColor(Color.argb(0xff,255,0,40));

        //The URL and metadata of the video sent along by GetVideoActivity.
        url = bundle.getString("URL");
        title = bundle.getString("title");
        username = bundle.getString("username");
        comments = bundle.getString("comments");
        mStorageRef = FirebaseStorage.getInstance().getReference("Users").child(username).child(title);
        mDatabaseRef = FirebaseDatabase.getInstance().getReference("Users").child(username).child(title);

        //Allows for control of the video (pausing, starting, skipping, going backward).
        MediaController mediacontroller = new MediaController(this);

        //Converts URL sent along to a Uri object.
        Uri videoUri = Uri.parse(url);
        vid.setMediaController(mediacontroller);
        mediacontroller.setAnchorView(vid);

        //Sets everything to the URL and metadata sent along by GetVideoActivity.
        vid.setVideoURI(videoUri);
        usernameView.setText(username);
        titleView.setText(title);
        commentsView.setText(comments);
        vid.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
            public void onPrepared(MediaPlayer mp) {

                //The videoLoadingView displays "Loading..." until the video is prepared to start,
                //and then it empties the videoLoadingView and starts the video.
                videoLoadingView.setText("");
                vid.start();
            }
        });
        vid.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
            @Override
            public void onCompletion(MediaPlayer mp) {

                //Loops the video.
                vid.start();
            }
        });
    }
    public void onClickDeleteVideo(View view){

        //Deletes database reference to video, and if that works, it deletes storage reference to
        //video, and if that works, it gives a toast saying that the video has been deleted.
        mDatabaseRef.removeValue().addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                mStorageRef.delete().addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Toast.makeText(getApplicationContext(), "Video has been deleted.", Toast.LENGTH_LONG).show();
                    }
                });
            }
        });
    }
}
