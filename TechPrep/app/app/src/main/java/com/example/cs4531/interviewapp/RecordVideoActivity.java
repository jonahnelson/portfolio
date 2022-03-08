package com.example.cs4531.interviewapp;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Handler;
import android.provider.MediaStore;
import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.material.navigation.NavigationView;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.Toast;
import android.widget.VideoView;
import android.widget.TextView;

import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;
import com.google.gson.JsonObject;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;


public class RecordVideoActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {


    private Button recordView, playView;
    private VideoView viewOfVideo;
    private TextView questionView;
    private int ACTIVITY_START_CAMERA_APP = 0;
    private DrawerLayout mDrawerLayout;
    private ActionBarDrawerToggle mToggle;
    private boolean admin;
    private User user;
    private StorageReference mStorageRef;
    private DatabaseReference mDatabaseRef;
    private TextInputEditText username;
    private TextInputEditText titleOfVideo;
    boolean recordViewEnabled;
    boolean videoRecorded;

    @Override
    protected void onCreate(Bundle savedInstanceState)  {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                == PackageManager.PERMISSION_DENIED){
            ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, 1);
        }

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_record_video);
        recordView = findViewById(R.id.recordButton);
        recordView.setBackgroundColor(Color.argb(0xff,200,180,180));
        playView =  findViewById(R.id.playbackButton);
        playView.setBackgroundColor(Color.argb(0xff,200,180,180));
        viewOfVideo = findViewById(R.id.videoView);
        username = findViewById(R.id.username);
        titleOfVideo = findViewById(R.id.titleOfVideo);

        //Makes sure that if the RecordVideoActivity is returned to, the buttons are enabled accordingly.
        if(username.getText().toString().isEmpty() || titleOfVideo.getText().toString().isEmpty()){
            recordViewEnabled = false;
        }

        //This mess enables and changes the color of the record button in real time according to
        //the input text fields.
        username.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(!titleOfVideo.getText().toString().isEmpty() && !username.getText().toString().isEmpty()){
                    recordViewEnabled = true;
                    recordView.setBackgroundColor(Color.argb(255,122,0,25));
                } else {
                    recordView.setBackgroundColor(Color.argb(0xff,200,180,180));
                    titleOfVideo.addTextChangedListener(new TextWatcher(){

                    @Override
                    public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

                    @Override
                    public void onTextChanged(CharSequence s, int start, int before, int count) {
                        if(!titleOfVideo.getText().toString().isEmpty() && !username.getText().toString().isEmpty()) {
                            recordViewEnabled = true;
                            recordView.setBackgroundColor(Color.argb(255,122,0,25));
                        } else {
                            recordView.setBackgroundColor(Color.argb(0xff,200,180,180));
                        }
                    }

                    @Override
                    public void afterTextChanged(Editable s) {

                    }
                });}
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        mDrawerLayout= (DrawerLayout) findViewById(R.id.nav_drawer);
        mToggle = new ActionBarDrawerToggle(RecordVideoActivity.this, mDrawerLayout, R.string.open, R.string.close);
        mDrawerLayout.addDrawerListener(mToggle);
        mToggle.syncState();
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        NavigationView navigationView=(NavigationView)findViewById(R.id.navigation_view);
        Intent intent = getIntent();
        user = (User) intent.getSerializableExtra("user");
        admin = user.isAdmin();
        mStorageRef = FirebaseStorage.getInstance().getReference("Users");
        mDatabaseRef = FirebaseDatabase.getInstance().getReference("Users");
        if (!admin){
            Menu nav_Menu = navigationView.getMenu();
            nav_Menu.findItem(R.id.nav_addQuestions).setVisible(false);
            nav_Menu.findItem(R.id.nav_rankQuestions).setVisible(false);
            nav_Menu.findItem(R.id.nav_reportedQuestions).setVisible(false);
        }
        navigationView.setNavigationItemSelectedListener(this);

        //Checks if input fields are empty and opens phone camera to record video if not.
        recordView.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                if(recordViewEnabled && !titleOfVideo.getText().toString().isEmpty() && !username.getText().toString().isEmpty()){
                    videoRecorded = false;
                Intent playBackIntent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
                startActivityForResult(playBackIntent, ACTIVITY_START_CAMERA_APP);
                } else {
                    Toast.makeText(getApplicationContext(), "Please fill in both fields to upload.", Toast.LENGTH_LONG).show();
                }
            }
        });

        playView.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                if(videoRecorded){
                viewOfVideo.start();
            } else {
                Toast.makeText(getApplicationContext(), "Record a video to watch.", Toast.LENGTH_LONG).show();
            }
        }});
        getQuestion(questionView);
    }
    Retro interfaceName = Retro.retro.create(Retro.class);
    public void getQuestion(View v) {
        Call<JsonObject> call = this.interfaceName.getTechnical();
        call.enqueue(new Callback<JsonObject>() {

            @Override
            public void onResponse(Call<JsonObject> call, retrofit2.Response<JsonObject> response) {
                Log.d("GETALL", response.body().toString());
                questionView.setText(response.body().get("question").toString());
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.d("GETALL", "FAILED     " + t.toString());
            }
        });
    }


    /**
     * @author smatthys
     * @param item
     * This function allows the menu toggle button and other menu buttons
     * properly function when clicked.
     */
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if(mToggle.onOptionsItemSelected(item)){
            return true;
        }
        return super.onOptionsItemSelected(item);
    }


    /**
     * @author smatthys
     * @param item
     * This function takes a boolean value to transition between different activities.
     * It holds all the logic necessary for the navigation side bar.
     */
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();
        if(id == R.id.nav_home){
            Intent intent = new Intent(this, MainActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_recordVideo){
            Intent intent = new Intent(this, RecordVideoActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_flashcards){
            Intent intent = new Intent(this, FlashcardsActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_addQuestions){
            Intent intent = new Intent(this, AddQuestionsActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_rankQuestions) {
            Intent intent = new Intent(this, RankQuestionsActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_reportedQuestions) {
            Intent intent = new Intent(this, ReportedQuestionsAdminActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_resources){
            Intent intent = new Intent(this, ResourcesActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_myAccount){
            Intent intent = new Intent(this, LogIn.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_getVideo){
            Intent intent = new Intent(this, GetVideoActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        return false;
    }

    //Displays toast and uploads video to Firebase storage and database.
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == ACTIVITY_START_CAMERA_APP && resultCode == RESULT_OK) {
            Uri videoUri = data.getData();
            videoRecorded = true;
            playView.setBackgroundColor(Color.argb(255,122,0,25));
            viewOfVideo.setVideoURI(videoUri);
            final StorageReference fileReference = mStorageRef.child(username.getText().toString())
                    .child(titleOfVideo.getText().toString());
            fileReference.putFile(videoUri)
                    .addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>(){
                        @Override
                        public void onSuccess(UploadTask.TaskSnapshot taskSnapshot){
                            fileReference.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                                @Override
                                public void onSuccess(Uri uri) {
                                    Upload upload = new Upload(username.getText().toString(),
                                            uri.toString(), titleOfVideo.getText().toString(),
                                            "Very good.");
                                    mDatabaseRef.child(username.getText().toString()).child(
                                            titleOfVideo.getText().toString()).setValue(upload);
                                }
                            });
                        }
                    });
            Toast.makeText(getApplicationContext(), "Video will be uploaded shortly.", Toast.LENGTH_LONG).show();
        }
        if(resultCode != RESULT_OK) {
            Toast.makeText(getApplicationContext(), "Error. Video not saved. Try again.", Toast.LENGTH_LONG).show();
        }
    }
}
