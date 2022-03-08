package com.example.cs4531.interviewapp;

import android.content.Intent;
import androidx.annotation.NonNull;
import com.google.android.material.navigation.NavigationView;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.Callback;

/**
 * Once database is up and running, we can set functions to the getQuestion
 * button to retrieve a sample question from the database, and then put it in
 * the textview. The getAnswer should have the same functionality.
 */
public class FlashcardsActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener{

    private DrawerLayout mDrawerLayout;
    private ActionBarDrawerToggle mToggle;
    //public RestRequests requests; //our RestRequests class
    public String answerString; //the answer response
    private boolean admin = false;
    private User user;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_flashcards);
        mDrawerLayout= (DrawerLayout) findViewById(R.id.nav_drawer);
        mToggle = new ActionBarDrawerToggle(FlashcardsActivity.this, mDrawerLayout, R.string.open, R.string.close);
        mDrawerLayout.addDrawerListener(mToggle);
        mToggle.syncState();
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        NavigationView navigationView=(NavigationView)findViewById(R.id.navigation_view);
        Intent intent = getIntent();
        user = (User) intent.getSerializableExtra("user");
        admin = user.isAdmin();
        if (!admin){
            Menu nav_Menu = navigationView.getMenu();
            nav_Menu.findItem(R.id.nav_addQuestions).setVisible(false);
            nav_Menu.findItem(R.id.nav_rankQuestions).setVisible(false);
           // nav_Menu.findItem(R.id.nav_reportedQuestions).setVisible(false);
        }
        navigationView.setNavigationItemSelectedListener(this);
        TextView tv = (TextView)findViewById(R.id.qAView); //Question view
        TextView answerView = (TextView)findViewById(R.id.answerView);
        //requests = RestRequests.getInstance(getApplicationContext());
        tv.setText("");
        final Button answerButton = (Button)findViewById(R.id.getAnswer);
        Button viewRankButton = (Button)findViewById(R.id.review_question);
        getQuestion(tv);
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

    /**
     * getQuestion changes the name of the buttons, textViews, and updates the view with a new flashcard question.
     * @author Jaron
     * @param v the view
     */
    Retro interfaceName = Retro.retro.create(Retro.class);
    public void getQuestion(View v)
    {
        final TextView tv = (TextView)findViewById(R.id.qAView);
        TextView answerView = (TextView) findViewById(R.id.answerView);
        answerView.setText(""); //Resets the answer field to default on click
        Button getQuestionButton = (Button)findViewById(R.id.get_question);
        Button reviewAnswer = (Button)findViewById(R.id.review_question);
        reviewAnswer.setVisibility(View.GONE);
        getQuestionButton.setText(R.string.new_Question);
        Button answerButton = (Button)findViewById(R.id.getAnswer);
            if(answerButton.getText().toString() == getString(R.string.hide_Answer)) {
                hideAnswer(v);
            }
        Call<JsonObject> call = this.interfaceName.getFlash();
        call.enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, retrofit2.Response<JsonObject> response) {
                Log.d("GETALL", response.body().toString());
                answerString = response.body().get("answer").toString();
                tv.setText(response.body().get("question").toString());
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.d("GETALL", "FAILED     " + t.toString());
            }
        });
    }

    public void showAnswer(View v)
    {
        TextView answerView = (TextView)findViewById(R.id.answerView);
        answerView.setText(answerString);
        Button answerButton = (Button)findViewById(R.id.getAnswer);
        Button reviewAnswer = (Button)findViewById(R.id.review_question);
        Button reportQuestion = (Button)findViewById(R.id.reportQuestionButton);
        reviewAnswer.setVisibility(View.VISIBLE);
        reportQuestion.setVisibility(View.VISIBLE);

        answerButton.setText(R.string.hide_Answer); //change button to hide Answer
        answerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick (View v) {
                hideAnswer(v);
            }
        });
    }

    public void hideAnswer(View v)
    {
        TextView answerView = (TextView)findViewById(R.id.answerView);
        answerView.setText("");
        Button reviewAnswer = (Button)findViewById(R.id.review_question);
        Button reportQuestion = (Button)findViewById(R.id.reportQuestionButton);
        reviewAnswer.setVisibility(View.INVISIBLE);
        reportQuestion.setVisibility(View.INVISIBLE);

        Button answerButton = (Button)findViewById(R.id.getAnswer);
        answerButton.setText(R.string.Get_Answer); //change button to hide Answer
        answerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick (View v) {
                showAnswer(v);
            }
        });
    }
    public void reviewQuestion(View v){
        openViewRankActivity();
    }
    public void openViewRankActivity(){
        final TextView tv = (TextView)findViewById(R.id.qAView);
        final TextView av = (TextView)findViewById(R.id.answerView);
        Intent intent = new Intent(this, ViewRankActivity.class);
        intent.putExtra("user", user);
        intent.putExtra("question", tv.getText());
        intent.putExtra("answer", av.getText());

        startActivity(intent);
    }
    public void reportQuestion(View v){ openReportQuestionActivity();};
    public void openReportQuestionActivity(){
        final TextView tv = (TextView)findViewById(R.id.qAView);
        final TextView av = (TextView)findViewById(R.id.answerView);
        Intent intent = new Intent(this,ReportQuestionActivity.class);
        intent.putExtra("user",user);
        intent.putExtra("question",tv.getText());
        intent.putExtra("answer", av.getText());

        startActivity(intent);
    }
}
