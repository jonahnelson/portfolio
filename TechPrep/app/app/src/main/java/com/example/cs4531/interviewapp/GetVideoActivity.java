package com.example.cs4531.interviewapp;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.DisplayMetrics;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.StyleRes;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.drawerlayout.widget.DrawerLayout;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;


public class GetVideoActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener{
    private DrawerLayout mDrawerLayout;
    private ActionBarDrawerToggle mToggle;
    private boolean admin = false;
    private User user;
    private DatabaseReference mDatabaseRef;
    private TextInputEditText UsernameInput, VideoNameInput;
    private TextView Results, videosText;
    private Button searchButton, getAllButton;
    private DisplayMetrics displayMetrics;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_get_video);
        searchButton = (Button) findViewById(R.id.SearchButton);
        getAllButton = (Button) findViewById(R.id.GetAllButton);

        //Sets buttons' colors as faded to imply unclickability until text fields are filled,
        //both for the search button and only the username one for the get all button.
        searchButton.setBackgroundColor(Color.argb(0xff,200,180,180));
        searchButton.setTextColor(Color.argb(0xff,255,255,255));
        getAllButton.setBackgroundColor(Color.argb(0xff,200,180,180));
        getAllButton.setTextColor(Color.argb(0xff,255,255,255));
        UsernameInput = (TextInputEditText) findViewById(R.id.UserNameInput);
        VideoNameInput = (TextInputEditText) findViewById(R.id.VideoNameInput);
        UsernameInput.addTextChangedListener(new TextWatcher() {

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(UsernameInput.getText().toString().equals("")){
                    getAllButton.setBackgroundColor(Color.argb(0xff,200,180,180));
                    searchButton.setBackgroundColor(Color.argb(0xff,200,180,180));
                } else {
                    if(VideoNameInput.getText().toString().equals("")) {
                        searchButton.setBackgroundColor(Color.argb(0xff, 200, 180, 180));
                    } else {
                        searchButton.setBackgroundColor(Color.argb(255, 122, 0, 25));
                    }
                    getAllButton.setBackgroundColor(Color.argb(255, 122, 0, 25));
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
        VideoNameInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if(VideoNameInput.getText().toString().equals("")){
                    searchButton.setBackgroundColor(Color.argb(0xff, 200, 180, 180));
                } else {
                    if(UsernameInput.getText().toString().equals("")){
                        searchButton.setBackgroundColor(Color.argb(0xff, 200, 180, 180));
                    } else {
                        searchButton.setBackgroundColor(Color.argb(255, 122, 0, 25));
                    }
                }
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        //The text view that displays "<user>'s videos" is set to empty at the beginning.
        videosText = (TextView) findViewById(R.id.videosTextView);
        videosText.setText("");

        mDrawerLayout= (DrawerLayout) findViewById(R.id.nav_drawer);
        mToggle = new ActionBarDrawerToggle(GetVideoActivity.this, mDrawerLayout, R.string.open, R.string.close);
        mDrawerLayout.addDrawerListener(mToggle);
        mToggle.syncState();
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        NavigationView navigationView=(NavigationView)findViewById(R.id.navigation_view);
        Intent intent = getIntent();
        user = (User) intent.getSerializableExtra("user");
        admin = user.isAdmin();
        if (admin == false){
            Menu nav_Menu = navigationView.getMenu();
            nav_Menu.findItem(R.id.nav_addQuestions).setVisible(false);
            nav_Menu.findItem(R.id.nav_rankQuestions).setVisible(false);
            nav_Menu.findItem(R.id.nav_reportedQuestions).setVisible(false);
        }
        navigationView.setNavigationItemSelectedListener(this);

        //We only need access to the database reference for this activity. Each video child contains
        //the video URL that will be converted to a URI that will be fed into the video view in
        //PlayVideoActivity, by being sent along with putExtra() and getExtra().
        mDatabaseRef = FirebaseDatabase.getInstance().getReference("Users");
    }

    public void onClickGetAll(final View view) {
        String UserName = UsernameInput.getText().toString().trim();
        final GetVideoActivity This = this;

        //Checks to see if the username input text field is empty. If it is, it prompts
        //to enter a username. Otherwise it doesn't know whose videos to retrieve.
        if(UsernameInput.getText().toString().equals("")){
            Toast.makeText(getApplicationContext(), "Please enter a username whose videos to retrieve.", Toast.LENGTH_LONG).show();
        //Username input is not empty.
        } else {
            ValueEventListener postListener = new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    if (dataSnapshot.exists()) {
                        videosText.setText(UsernameInput.getText().toString() + "'s Videos");
                        //This creates and places buttons dynamically, using the name of the video
                        //as the button's text.
                        int i = 0;
                        ConstraintLayout layout = findViewById(R.id.linearLayout);
                        for (DataSnapshot postSnapshot : dataSnapshot.getChildren()) {
                            Upload video = postSnapshot.getValue(Upload.class);
                            String Title = video.getTitle();
                            Button button = new Button(This);
                            button.setText(Title);
                            button.setLayoutParams(new ConstraintLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
                            displayMetrics = new DisplayMetrics();
                            getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
                            int screenHeight = displayMetrics.heightPixels;
                            int screenWidth = displayMetrics.widthPixels;
                            double y = Math.pow(screenHeight /displayMetrics.xdpi, 2);
                            double x = Math.pow(screenWidth /displayMetrics.xdpi, 2);
                            button.setY(550 + 175 * i);
                            //An attempt to center the buttons. Doesn't work perfectly because
                            //we can't check the width (which we need to subtract that from the
                            //width of the screen to center perfectly) of the button until it's
                            //placed, but we want to place it in the center. So it'd be placed
                            //then move, which is just silly.
                            button.setX((screenWidth/2)-121);
                            button.setBackgroundColor(Color.argb(255, 122, 0, 25));
                            button.setTextColor(Color.argb(255, 255, 255, 255));
                            button.setId(i);
                            button.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View view) {
                                    This.onClickDynamicButton(view);
                                }
                            });
                            layout.addView(button);
                            i++;
                        }
                    } else {
                        //This "else" always signifies that the username input field has a value,
                        //but there is no user in our database that matches the name.
                        Toast.makeText(getApplicationContext(), "There is no user who matches that name.", Toast.LENGTH_LONG).show();
                    }
                }

                @Override
                public void onCancelled(@NonNull DatabaseError error) {}
            };
            //Necessary to be able to access actual values in database rather than only
            //database references.
            mDatabaseRef.child(UserName).addListenerForSingleValueEvent(postListener);
        }
    }

    //This is for each video button that's listed.
    public void onClickDynamicButton(View view){
        final Intent intent = new Intent(this, PlayVideoActivity.class);
        Button playVid = (Button) findViewById(view.getId());
        final String UserName = UsernameInput.getText().toString().trim();
        final String VideoName = (String) playVid.getText();
        ValueEventListener postListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                if (dataSnapshot.exists()) {
                    //Gets actual values from the database.
                    String VideoUrl = dataSnapshot.child("videoUrl").getValue(String.class);

                    //We have a field for comments to show we thought of it, but there's no way
                    //to add comments, as the epics made it clear that the admins give feedback,
                    //and users do not necessarily need to have the functionality available to
                    //them to respond. It wasn't in the scope of our epic.
                    String comments = dataSnapshot.child("comments").getValue(String.class);
                    String title = dataSnapshot.child("title").getValue(String.class);
                    String username = dataSnapshot.child("name").getValue(String.class);

                    //Lets PlayVideoActivity know the video's URL, which will be converted into
                    //a URI with parse(), and its metadata.
                    intent.putExtra("URL", VideoUrl);
                    intent.putExtra("comments", comments);
                    intent.putExtra("title", title);
                    intent.putExtra("username", username);
                    startActivity(intent);
                }
                else{
                    Toast.makeText(getApplicationContext(), "Video does not exist.", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {}
        };
        mDatabaseRef.child(UserName).child(VideoName).addListenerForSingleValueEvent(postListener);
    }

    public void onClickSearch(View view){
        final Intent intent = new Intent(this, PlayVideoActivity.class);
        final String UserName = UsernameInput.getText().toString().trim();
        final String VideoName = VideoNameInput.getText().toString().trim();

        //If either inputs fields are empty, then the search button will not be able to find
        //a match in our database.
        if(UsernameInput.getText().toString().equals("") || VideoNameInput.getText().toString().equals("")){
            Toast.makeText(getApplicationContext(), "Please fill in both fields to find a video.", Toast.LENGTH_LONG).show();
        } else {
            ValueEventListener postListener = new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    if (dataSnapshot.exists()) {
                        //Retrieving actual values from database, and sending them along to
                        //PlayVideoActivity, as onClickGetAll did.
                        String VideoUrl = dataSnapshot.child("videoUrl").getValue(String.class);
                        String comments = dataSnapshot.child("comments").getValue(String.class);
                        String title = dataSnapshot.child("title").getValue(String.class);
                        String username = dataSnapshot.child("name").getValue(String.class);
                        intent.putExtra("URL", VideoUrl);
                        intent.putExtra("comments", comments);
                        intent.putExtra("title", title);
                        intent.putExtra("username", username);
                        startActivity(intent);
                    } else {
                        Toast.makeText(getApplicationContext(), "There are no videos matching that name and title.", Toast.LENGTH_LONG).show();
                    }
                }

                @Override
                public void onCancelled(@NonNull DatabaseError error) {}
            };
            mDatabaseRef.child(UserName).child(VideoName).addListenerForSingleValueEvent(postListener);
        }
    }

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

}
