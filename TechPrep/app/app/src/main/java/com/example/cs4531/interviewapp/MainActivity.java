package com.example.cs4531.interviewapp;


import android.content.Intent;
import androidx.annotation.NonNull;
import com.google.android.material.navigation.NavigationView;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private DrawerLayout mDrawerLayout;
    private ActionBarDrawerToggle mToggle;
    private LogIn logIn;
    private User user;
    private boolean admin = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mDrawerLayout = (DrawerLayout) findViewById(R.id.nav_drawer);
        mToggle = new ActionBarDrawerToggle(MainActivity.this, mDrawerLayout, R.string.open, R.string.close);
        mDrawerLayout.addDrawerListener(mToggle);
        mToggle.syncState();
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        NavigationView navigationView = (NavigationView) findViewById(R.id.navigation_view);
        Intent intent = getIntent();
        user = (User) intent.getSerializableExtra("user");
        admin = user.isAdmin();
        if (!admin) {
            Menu nav_Menu = navigationView.getMenu();
            nav_Menu.findItem(R.id.nav_addQuestions).setVisible(false);
            nav_Menu.findItem(R.id.nav_rankQuestions).setVisible(false);
            nav_Menu.findItem(R.id.nav_reportedQuestions).setVisible(false);
        }
        navigationView.setNavigationItemSelectedListener(this);
    }

    /**
     * @param item This function allows the menu toggle button and other menu buttons
     *             properly function when clicked.
     * @author smatthys
     */
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (mToggle.onOptionsItemSelected(item)) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }


    /**
     * @param item This function takes a boolean value to transition between different activities.
     *             It holds all the logic necessary for the navigation side bar.
     * @author smatthys
     */
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.nav_home) {
            Intent intent = new Intent(this, MainActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_recordVideo) {
            Intent intent = new Intent(this, RecordVideoActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_flashcards) {
            Intent intent = new Intent(this, FlashcardsActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_addQuestions) {
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
        if (id == R.id.nav_resources) {
            Intent intent = new Intent(this, ResourcesActivity.class);
            intent.putExtra("user", user);
            startActivity(intent);
        }
        if (id == R.id.nav_myAccount) {
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

    /**
     * @param myView This function transitions to RecordVideoActivity
     * @author ghutch
     */
    public void switchToVideo(View myView) {
        Intent intent = new Intent(this, RecordVideoActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

    /**
     * @param myView This function transitions to FlashcardsActivity
     * @author ghutch
     */
    public void switchToFlashcards(View myView) {
        Intent intent = new Intent(this, FlashcardsActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

    public void switchToGetVideos(View myView) {
        Intent intent = new Intent(this, GetVideoActivity.class);
        intent.putExtra("user", user);
        startActivity(intent);
    }

}
