package com.example.cs4531.interviewapp;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import com.google.android.material.navigation.NavigationView;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RatingBar;
import android.widget.TextView;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.Callback;

public class RankQuestionsActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private DrawerLayout mDrawerLayout;
    private ActionBarDrawerToggle mToggle;
    private boolean admin = false;
    private User user;
    private Retro interfaceName = Retro.retro.create(Retro.class);
    private TextView questionView;
    private TextView answerView;
    private RatingBar ratingBar;
    private TextView currentRankView;
    private EditText commentInput;
    private TextView responseView;
    private Button submitButton;
    private Button closeButton;
    private Button newFlashcardQuestionButton;
    private Button newTechnicalQuestionButton;
    private String newFlashQResponse;
    private String newTechQResponse;
    private String question;
    private String answer;
    private Boolean isFlash = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rank_questions);

        mDrawerLayout = (DrawerLayout) findViewById(R.id.nav_drawer);
        mToggle = new ActionBarDrawerToggle(RankQuestionsActivity.this, mDrawerLayout, R.string.open, R.string.close);
        mDrawerLayout.addDrawerListener(mToggle);
        mToggle.syncState();

        questionView = (TextView) findViewById(R.id.questionToRank);
        answerView = (TextView) findViewById(R.id.answerToRank);
        ratingBar = (RatingBar) findViewById(R.id.ratingBar);
        commentInput = (EditText) findViewById(R.id.commentInput);
        responseView = (TextView) findViewById(R.id.responseView);
        submitButton = (Button) findViewById(R.id.submitRankButton);
        submitButton.setVisibility(View.INVISIBLE);
        closeButton = (Button) findViewById(R.id.closeButton);
        closeButton.setVisibility(View.INVISIBLE);
        newFlashcardQuestionButton = (Button) findViewById(R.id.newFlashcardButton);
        newTechnicalQuestionButton = (Button) findViewById(R.id.newTechnicalButton);
        currentRankView = (TextView) findViewById(R.id.currentRankView);
        addListenerOnRatingBar();

        Intent intent = getIntent();
        user = (User) intent.getSerializableExtra("user");
        admin = user.isAdmin();
        if (admin == false) {
            //The only question/answer a non-admin will be able to rank here.
            question = (String) intent.getStringExtra("question");
            questionView.setText(question);
            answer = (String) intent.getStringExtra("answer").replace("\"", "");
            if (answer.isEmpty()) {
                answer = "N/A";
                isFlash = false;
            }
            answerView.setText(answer);

            //A non-admin will not be allowed to rank multiple questions on this page
            newFlashcardQuestionButton.setVisibility(View.INVISIBLE);
            newTechnicalQuestionButton.setVisibility(View.INVISIBLE);

            //Move the submit/close buttons and response view up, so there isn't a lot of dead space due to the other two buttons being gone
            submitButton.setTranslationY(-150);
            closeButton.setTranslationY(-150);
            responseView.setTranslationY(-150);
        }
        else {
            //Create navigation menu and pull a question from the database
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            NavigationView navigationView = (NavigationView) findViewById(R.id.navigation_view);
            navigationView.setNavigationItemSelectedListener(this);
            newFlashcardQuestionButton.performClick();
        }

    }


    /**
     * @author smatthys
     * @param item
     * This function allows the menu toggle button and other menu buttons
     * properly function when clicked.
     */
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (mToggle.onOptionsItemSelected(item)) {
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

    public void addListenerOnRatingBar() {
        ratingBar.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            public void onRatingChanged(RatingBar ratingBar, float rating, boolean fromUser) {
                currentRankView.setText((int)rating + "/10");
                submitButton.setVisibility(View.VISIBLE);
            }
        });
    }

    public void onClickSubmit(View myView) {
        try {
            if(!admin) {
                closeButton.setVisibility(View.VISIBLE);
            }
            submitButton.setVisibility(View.INVISIBLE);
            ratingBar.setIsIndicator(true);
            commentInput.setEnabled(false);
            final TextView tv = (TextView) findViewById(R.id.questionToRank);
            final RatingBar rb = findViewById(R.id.ratingBar);
            final EditText comment = findViewById(R.id.commentInput);
            if(comment.getText().toString().isEmpty()) {
                comment.setText("N/A"); //There must be something in the comment string, or else there will be errors later
            }
            JsonObject payload2 = new JsonObject();
            payload2.addProperty("question", tv.getText().toString());
            payload2.addProperty("rank", (int) Double.parseDouble(String.valueOf(rb.getRating())));
            payload2.addProperty("comment", comment.getText().toString());
            payload2.addProperty("user", user.getUsername());
            Call<JsonObject> call2;
            if (user.isAdmin()) {
                if (isFlash) {
                    call2 = this.interfaceName.RankFlashAdmin(payload2);
                } else {
                    call2 = this.interfaceName.RankTechAdmin(payload2);
                }
            }
            else {
                if (isFlash) {
                    call2 = this.interfaceName.RankFlashUser(payload2);}
                else {
                    call2 = this.interfaceName.RankTechUser(payload2);
                }
            }
            call2.enqueue(new Callback<JsonObject>() {
                @Override
                public void onResponse(Call<JsonObject> call2, retrofit2.Response<JsonObject> response) {
                    Log.d("Flash Question Rank Update: ", "Success");
                    responseView.setText(
                            getResources().getString(R.string.rankSuccess));

                    questionView.setText(response.body().get("question").toString().replace("\"", ""));
                    answerView.setText(response.body().get("answer").toString().replace("\"", ""));
                    ratingBar.setRating(Float.parseFloat(response.body().get("__v").toString().replace("\"", "")));

                }
                @Override
                public void onFailure(Call<JsonObject> call2, Throwable t) {
                    Log.d("Flash Question Rank Failed: ", t.toString());

                    //Prompts user of failure and why
                    responseView.setText(
                            getResources().getString(R.string.rankFailure) + "\n" + t.toString());
                }
            });
        } catch (Exception e) {
            // Print the wrapper exception:
            System.out.println("Wrapper exception: " + e);

            // Print the 'actual' exception:
            System.out.println("Underlying exception: " + e.getCause());
        }
    }

    public void onClickNewFlashcardQuestion(View myView) {
        isFlash = true;
        Call<JsonObject> call = this.interfaceName.getFlash();
        call.enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, retrofit2.Response<JsonObject> response) {
                Log.d("GETALL", response.body().toString());
                responseView.setText("");

                newFlashQResponse = "New Flashcard Question:\n\""
                        + response.body().get("question").toString().replace("\"", "")
                        + "\"";

                questionView.setText(newFlashQResponse);
                answerView.setText(response.body().get("answer").toString().replace("\"", ""));
                //ratingBar.setRating(Float.parseFloat(response.body().get("__v").toString().replace("\"", "")));
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.d("GETALL", "FAILED     " + t.toString());

                //Prompts user of failure and why
                responseView.setText(
                        getResources().getString(R.string.newQuestionFailure) + "\n" + t.toString());
            }
        });

        submitButton.setVisibility(View.INVISIBLE);
        ratingBar.setIsIndicator(false);
        commentInput.setEnabled(true);
        commentInput.setText("");
    }

    public void onClickNewTechnicalQuestion(View myView) {
        isFlash = false;
        Call<JsonObject> call = this.interfaceName.getTechnical();
        call.enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, retrofit2.Response<JsonObject> response) {
                Log.d("GETTECHNICAL", response.body().toString());
                responseView.setText("");

                newTechQResponse = "New Technical Question:\n\""
                        + response.body().get("question").toString().replace("\"", "")
                        + "\"";

                questionView.setText(newTechQResponse);
                answerView.setText("");
                //ratingBar.setRating(Float.parseFloat(response.body().get("__v").toString().replace("\"", ""))); //ERROR (sometimes): Attempt to invoke virtual method 'java.lang.String com.google.gson.JsonElement.toString()' on a null object reference
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.d("GETTECHNICAL", "FAILED     " + t.toString());

                //Prompts user of failure and why
                responseView.setText(
                        getResources().getString(R.string.newQuestionFailure) + "\n" + t.toString());
            }
        });

        submitButton.setVisibility(View.INVISIBLE);
        ratingBar.setIsIndicator(false);
        commentInput.setEnabled(true);
        commentInput.setText("");
    }

    public void onClickCloseButton(View myView) {
        this.finish();
    }
}
