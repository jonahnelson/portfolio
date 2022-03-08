package com.example.cs4531.interviewapp;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.view.View;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.RatingBar;
import android.widget.TextView;
import com.google.gson.JsonObject;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import retrofit2.Call;
import retrofit2.Callback;


public class ViewRankActivity extends AppCompatActivity {

    private Button viewAdminCommentsButton;
    private Button viewUserCommentsButton;
    private Button nextCommentButton;
    private Button previousCommentButton;
    private Button closeButton;
    private Button rankQuestionButton;

    private TextView displayCommentsTextView;
    private TextView ratingTextView;

    //retro open
    private Retro interfaceName = Retro.retro.create(Retro.class);

    //for response JSON
    private RatingBar ratingBar;
    private int userRating = 0;
    private int adminRating = 0;
    private int count = 0;
    JSONArray adminArray= null;
    JSONArray userArray= null;


    User user;
    String question;
    String answer;
    private boolean viewingAdmin = false;
    private boolean admin = false;

    String comment;


    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_rank);

        Intent intent = getIntent();
        user = (User) intent.getSerializableExtra("user");
        admin = user.isAdmin();

        viewAdminCommentsButton = findViewById(R.id.viewAdminCommentsButton);
        viewUserCommentsButton = findViewById(R.id.viewUserCommentsButton);
        nextCommentButton = findViewById(R.id.nextQuestionButton);
        previousCommentButton = findViewById(R.id.previousQuestionButton);
        closeButton = findViewById(R.id.closeButton);
        rankQuestionButton = findViewById(R.id.rateQuestionButton);

        displayCommentsTextView = findViewById(R.id.displayCommentsTextView);
        ratingBar = findViewById(R.id.ratingBar);
        ratingBar.setIsIndicator(true);
        ratingTextView = findViewById(R.id.ratingTextView);
        ratingTextView.setText("Select view admin or view user");
        question = (String) intent.getStringExtra("question").replace("\"", "");
        answer = (String) intent.getStringExtra("answer").replace("\"", "");
        try {
            JsonObject payload2 = new JsonObject();
            payload2.addProperty("question", question);
            Call<JsonObject> call2;
            if (answer.isEmpty()) {
                call2 = this.interfaceName.GetRankTech(payload2);
            }
            else {
                call2 = this.interfaceName.GetRankFlash(payload2);
            }
            call2.enqueue(new Callback<JsonObject>() {
                @Override
                public void onResponse(Call<JsonObject> call2, retrofit2.Response<JsonObject> response) {
                    Log.d("Flash get rank: ", "Success");
                    JSONObject jObject = null;
                    try {
                        jObject = new JSONObject(response.body().toString());
                        adminArray = jObject.getJSONArray("admin_comments");
                        userArray = jObject.getJSONArray("user_comments");
                        if (!response.body().get("admin_rank").toString().replace("\"", "").equals("N/A")) {
                            adminRating = (int)Double.parseDouble(response.body().get("admin_rank").toString());
                        }
                        if (!response.body().get("user_rank").toString().replace("\"", "").equals("N/A")) {
                            userRating = (int)Double.parseDouble(response.body().get("user_rank").toString());
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                @Override
                public void onFailure(Call<JsonObject> call2, Throwable t) {
                    Log.d("Flash get rank Failed: ", t.toString());
                }
            });
        } catch (Exception e) {
            // Print the wrapper exception:
            System.out.println("Wrapper exception: " + e);

            // Print the 'actual' exception:
            System.out.println("Underlying exception: " + e.getCause());
        }


    }
    public void onClickClose(View v){
        this.finish();
    }

    public void onClickViewAdminComments(View v){
        viewingAdmin = true;
        nextCommentButton.setVisibility(View.VISIBLE);
        previousCommentButton.setVisibility(View.VISIBLE);
        viewAdminCommentsButton.setText("Hide Rating and Comments");
        ratingTextView.setText("Admin Rating");
        ratingBar.setRating(adminRating);
        onClickNextQuestion(v);
        viewAdminCommentsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick (View v) {
                hideCommentsAdmin(v);
            }
        });

    }
    public void onClickViewUserComments(View v){
        nextCommentButton.setVisibility(View.VISIBLE);
        previousCommentButton.setVisibility(View.VISIBLE);
        viewUserCommentsButton.setText("Hide Rating and Comments");
        ratingTextView.setText("User Rating");
        ratingBar.setRating(userRating);
        onClickNextQuestion(v);
        viewUserCommentsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick (View v) {

                hideCommentsUser(v);
            }
        });
    }
    public void onClickNextQuestion(View v){
        count++;
        try {
            if (viewingAdmin){
                if (adminArray.length() == 0){
                    comment = "No comments from admins";
                }
                else{
                    comment = (String) adminArray.get(count % adminArray.length());
                }
            }
            else {
                if (userArray.length() == 0){
                    comment = "No comments from users";
                }
                else {
                    comment = (String) userArray.get(count % userArray.length());
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        displayCommentsTextView.setText(comment);

    }
    public void onClickPreviousQuestion(View v){
        if (count > 0) {
            count--;
        }
        try {
            if (viewingAdmin){
                if (adminArray.length() == 0){
                    comment = "No comments from admins";
                }
                else{
                    comment = (String) adminArray.get(count % adminArray.length());
                }
            }
            else {
                if (userArray.length() == 0){
                    comment = "No comments from users";
                }
                else {
                    comment = (String) userArray.get(count % userArray.length());
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        displayCommentsTextView.setText(comment);

    }
    public void hideCommentsAdmin(View v){
        viewingAdmin = false;
        nextCommentButton.setVisibility(View.INVISIBLE);
        previousCommentButton.setVisibility(View.INVISIBLE);
        displayCommentsTextView.setText("");
        ratingTextView.setText("Select view admin or view user");
        ratingBar.setRating(0);
        viewAdminCommentsButton.setText("View Admin");
        viewAdminCommentsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick (View v) {
                onClickViewAdminComments(v);
            }
        });
    }
    public void hideCommentsUser(View v){
        nextCommentButton.setVisibility(View.INVISIBLE);
        previousCommentButton.setVisibility(View.INVISIBLE);
        displayCommentsTextView.setText("");
        ratingTextView.setText("Select view admin or view user");
        ratingBar.setRating(0);
        viewUserCommentsButton.setText("View User");
        viewUserCommentsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick (View v) {
                onClickViewUserComments(v);
            }
        });
    }
    public void onClickRankQuestion(View v){
        rankQuestionButton.setVisibility(View.INVISIBLE); //prevents users from rating a question multiple times in one session
        openRankQuestionActivity();
    }
    public void openRankQuestionActivity(){
        Intent intent = new Intent(this, RankQuestionsActivity.class);
        intent.putExtra("user", user);
        intent.putExtra("question", question);
        intent.putExtra("answer", answer);
        startActivity(intent);
    }
}
