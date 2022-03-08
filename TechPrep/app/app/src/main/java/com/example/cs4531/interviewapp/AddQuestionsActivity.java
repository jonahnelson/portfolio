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
import android.widget.EditText;
import android.widget.TextView;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;


public class AddQuestionsActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener{


    private DrawerLayout mDrawerLayout;
    private ActionBarDrawerToggle mToggle;
    private boolean admin = false;
    private User user;

    TextView questionPrompt;
    Button flashcardButton;
    Button technicalButton;
    EditText newQuestionInput;
    EditText newAnswerInput;
    Button submitButton;
    TextView newQAResponse;
    Boolean isTechnical = false;

    private String[] profanityList = {"crap", "frick"}; //more words can be added
    private String[] questionList;
    private JSONArray jObject = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_questions);

        mDrawerLayout= (DrawerLayout) findViewById(R.id.nav_drawer);
        mToggle = new ActionBarDrawerToggle(AddQuestionsActivity.this, mDrawerLayout, R.string.open, R.string.close);
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

        questionPrompt = findViewById(R.id.newQuestionPrompt);
        flashcardButton = findViewById(R.id.buttonFlashcard);
        technicalButton = findViewById(R.id.buttonTechnical);
        newQuestionInput = (EditText) findViewById(R.id.newQuestionInput);
        newAnswerInput = (EditText) findViewById(R.id.newAnswerInput);
        submitButton = (Button) findViewById(R.id.recordButton);
        newQAResponse = (TextView) findViewById(R.id.newQAResponse);

        newAnswerInput.setText("");
        newQuestionInput.setText("");
        getAllExistingQuestions();
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

    public void onClickFlashcard(View myView){
        flashcardButton.setEnabled(false);
        technicalButton.setEnabled(true);
        questionPrompt.setText(R.string.enterQuestionAnswer);
        newAnswerInput.setEnabled(true);
        newAnswerInput.setVisibility(View.VISIBLE);
        isTechnical = false;

        //Resets the response and question input field
        newQAResponse.setText("");
        newQuestionInput.setText("");
    }

    public void onClickTechnical(View myView){
        flashcardButton.setEnabled(true);
        technicalButton.setEnabled(false);
        questionPrompt.setText(R.string.enterTechnicalQuestion);
        newAnswerInput.setVisibility(View.INVISIBLE);
        newAnswerInput.setText("");
        isTechnical = true;

        //Resets the response and question input field
        newQAResponse.setText("");
        newQuestionInput.setText("");
    }

    Retro interfaceName = Retro.retro.create(Retro.class);
    public void onSubmitButtonClick(View view) {
        //If q or a field blank on flashcard question, notify user
        if (!isTechnical && (newAnswerInput.getText().toString().equals("") ||
                newQuestionInput.getText().toString().equals(""))) {
            newQAResponse.setText(getResources().getString(R.string.empty_field));
        }
        //if q field blank on technical question, notify user
        else if (isTechnical && newQuestionInput.getText().toString().equals("")) {
            newQAResponse.setText(getResources().getString(R.string.empty_field));
        }
        //makes sure the input is clean (doesn't have profanity, ect)
        else if (!isSafeInput(newQuestionInput.getText().toString()) ||
            !isSafeInput(newAnswerInput.getText().toString())) {
            newQAResponse.setText(getResources().getString(R.string.profanity));
            newQuestionInput.setText("");
            newAnswerInput.setText("");
        }

        //make sure question isn't a repeat
        else if (isRepeatQuestion()) {
            newQAResponse.setText(getResources().getString(R.string.repeat_question));
            newQuestionInput.setText("");
            newAnswerInput.setText("");
        }
        //If all good and question is for flashcard, add it.
        else if (!isTechnical) {
            try {
                JsonObject payload2 = new JsonObject();
                payload2.addProperty("question", newQuestionInput.getText().toString());
                payload2.addProperty("answer", newAnswerInput.getText().toString());
                payload2.addProperty("authorName", user.getUsername());
                payload2.addProperty("loguser", "admin@d.umn.edu");
                payload2.addProperty("logpassword", "Bulldogs");
                Call<JsonObject> call2 = this.interfaceName.createFlash(payload2);
                call2.enqueue(new Callback<JsonObject>() {

                    @Override
                    public void onResponse(Call<JsonObject> call2, retrofit2.Response<JsonObject> response) {
                        Log.d("Flash Question", "Success");
                            newQAResponse.setText(getResources().getString(R.string.newFlashcardSuccess));

                            //Adds new question to existing question list
                            getAllExistingQuestions();
                    }

                    @Override
                    public void onFailure(Call<JsonObject> call2, Throwable t) {
                        Log.d("Flash Question Failed :  ", t.toString());

                        //Prompts user of failure and why
                        newQAResponse.setText(
                                getResources().getString(R.string.failure) + "\n" + t.toString());
                    }
                });
            } catch (Exception e) {
                // Print the wrapper exception:
                System.out.println("Wrapper exception: " + e);

                // Print the 'actual' exception:
                System.out.println("Underlying exception: " + e.getCause());
            }

        }
        //If all good & question is technical, add it.
        else {
            try {
                JsonObject payload2 = new JsonObject();
                payload2.addProperty("question", newQuestionInput.getText().toString());
                payload2.addProperty("authorName", user.getUsername());
                payload2.addProperty("loguser", "admin@d.umn.edu");
                payload2.addProperty("logpassword", "Bulldogs");
                Call<JsonObject> call2 = this.interfaceName.createTech(payload2);
                call2.enqueue(new Callback<JsonObject>() {

                    @Override
                    public void onResponse(Call<JsonObject> call2, retrofit2.Response<JsonObject> response) {
                        Log.d("Tech Question:  ", "Success");
                        newQAResponse.setText(getResources().getString(R.string.newTechnicalSuccess));

                        //Adds new question to existing question list
                        getAllExistingQuestions();
                    }

                    @Override
                    public void onFailure(Call<JsonObject> call2, Throwable t) {
                        Log.d("Tech Question Failed:  ", t.toString());
                        newQAResponse.setText(
                                getResources().getString(R.string.failure) + "\n" + t.toString());
                    }
                });
            } catch (Exception e) {
                // Print the wrapper exception:
                System.out.println("Wrapper exception: " + e);

                // Print the 'actual' exception:
                System.out.println("Underlying exception: " + e.getCause());
            }
        }
    }

    //Checks if profanity in input
    private boolean isSafeInput(String input) {
        //Removing "leet speak"
        input = input.replaceAll("1","i");
        input = input.replaceAll("!","i");
        input = input.replaceAll("3","e");
        input = input.replaceAll("4","a");
        input = input.replaceAll("@","a");
        input = input.replaceAll("5","s");
        input = input.replaceAll("7","t");
        input = input.replaceAll("0","o");
        input = input.replaceAll("I", "l");

        //Makes input all lowercase
        input.toLowerCase();

        //Check if new word is in profanity list
        for (int i = 0; i < profanityList.length; i++) {
            if (input.contains(profanityList[i]))
                return false;
        }
        return true;
    }

    private void getAllExistingQuestions() {
        //if question is technical, will get all tech questions as jsonObject 'response'
        if (isTechnical) {
            Call<JsonArray> call = this.interfaceName.getAllTechnical();

            call.enqueue(new Callback<JsonArray>() {
                @Override
                public void onResponse(Call<JsonArray> call, retrofit2.Response<JsonArray> response) {
                    Log.d("GETALLTECHNICAL", "success technical");

                    try {
                        jObject = new JSONArray(response.body().toString());
                        questionList = new String[jObject.length()];
                        for (int i = 0; i < jObject.length(); i++) {
                            questionList[i] = jObject.getJSONObject(i).get("question").toString();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Call<JsonArray> call, Throwable t) {
                    Log.d("GETALLTECHNICAL", "FAILED     " + t.toString());
                }
            });
        }
        //Otherwise, will get all flashcard questions as jsonObject 'response'
        else {
            Call<JsonArray> call = this.interfaceName.getAllFlash();

            call.enqueue(new Callback<JsonArray>() {
                @Override
                public void onResponse(Call<JsonArray> call, retrofit2.Response<JsonArray> response) {
                    Log.d("GETALLFLASH", "success flash");

                    try {
                        jObject = new JSONArray(response.body().toString());
                        questionList = new String[jObject.length()];
                        for (int i = 0; i < jObject.length(); i++) {
                            questionList[i] = jObject.getJSONObject(i).get("question").toString();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Call<JsonArray> call, Throwable t) {
                    Log.d("GETALLFLASH", "FAILED     " + t.toString());
                }
            });
        }
    }

    private boolean isRepeatQuestion() {
        for (int i = 0; i < questionList.length; i++) {
            if (newQuestionInput.getText().toString().toLowerCase().contains(
                questionList[i].toLowerCase())) {
                return true;
            }
        }
        return false;
    }



}