package com.example.cs4531.interviewapp;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.view.View;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;

public class ResolveReportedQuestionActivity extends AppCompatActivity {

    String question;
    String answer;
    String useremail;
    String reason;
    String comment;
    TextView questionView;
    TextView answerView;
    TextView reasonView;
    TextView reasonPrompt;
    Button keepQuestionButton;
    Button removeQuestionButton;
    Button editQuestionButton;
    private Retro interfaceName = Retro.retro.create(Retro.class);
    JSONObject jObject = null;
    JSONArray reportArray= null;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_resolve_reported_question);

        Intent intent = getIntent();
        question = (String) intent.getStringExtra("question");
        answer = (String) intent.getStringExtra("answer");

        questionView = (TextView) findViewById(R.id.questionToResolve);
        questionView.setText(question);
        answerView = (TextView) findViewById(R.id.answerToResolve);
        answerView.setText(answer);
        reasonView = (TextView) findViewById(R.id.reasonView);
        reasonPrompt = (TextView) findViewById(R.id.textView);
        keepQuestionButton = (Button) findViewById(R.id.keepQuestionButton);
        removeQuestionButton = (Button) findViewById(R.id.removeQuestionButton);
        editQuestionButton = (Button) findViewById(R.id.editQuestionButton);

        try {
            JsonObject payload2 = new JsonObject();
            payload2.addProperty("question", question);
            Call<JsonObject> call2;
            call2 = this.interfaceName.FindFlash(payload2);
            call2.enqueue(new Callback<JsonObject>() {
                @Override
                public void onResponse(Call<JsonObject> call2, retrofit2.Response<JsonObject> response) {
                    Log.d("Find Flash: ", "Success");
                    try {
                        jObject = new JSONObject(response.body().toString());
                        reportArray = jObject.getJSONArray("report");
                        Object Temp = reportArray.get(0);
                        useremail = ((JSONObject) Temp).get("user").toString();
                        reason = ((JSONObject) Temp).get("reason").toString();
                        comment = ((JSONObject) Temp).get("comment").toString();
                        String reason_full = (reason + ": " + comment);
                        reasonView.setText(reason_full);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
                @Override
                public void onFailure(Call<JsonObject> call2, Throwable t) {
                    Log.d("Find Flash Failed: ", t.toString());
                }
            });
        } catch (Exception e) {
            // Print the wrapper exception:
            System.out.println("Wrapper exception: " + e);

            // Print the 'actual' exception:
            System.out.println("Underlying exception: " + e.getCause());
        }
    }


    public void onClickKeepQuestionButton(View myView) {
        try {
            JsonObject payload2 = new JsonObject();
            payload2.addProperty("question", question);
            payload2.addProperty("reason", reason);
            payload2.addProperty("comment",comment);
            payload2.addProperty("user", useremail);
            Call<JsonObject> call2;
            call2 = this.interfaceName.ClearReportFlash(payload2);
            call2.enqueue(new Callback<JsonObject>() {
                @Override
                public void onResponse(Call<JsonObject> call2, retrofit2.Response<JsonObject> response) {
                    Log.d("Flash Question Report Update: ", "Success");
                    reasonView.setText("Question Kept Sucessfully");
                    reasonPrompt.setText("");
                    keepQuestionButton.setVisibility(View.INVISIBLE);
                    removeQuestionButton.setVisibility(View.INVISIBLE);
                    editQuestionButton.setVisibility(View.INVISIBLE);
                }
                @Override
                public void onFailure(Call<JsonObject> call2, Throwable t) {
                    Log.d("Flash Question Report Failed: ", t.toString());
                    reasonView.setText("Flash Question Report Failed");
                }
            });
        } catch (Exception e) {
            // Print the wrapper exception:
            System.out.println("Wrapper exception: " + e);

            // Print the 'actual' exception:
            System.out.println("Underlying exception: " + e.getCause());
        }
    }


    public void onClickRemoveQuestionButton(View myView) {
        try {
            JsonObject payload2 = new JsonObject();
            payload2.addProperty("question", question);
            Call<JsonObject> call2;
            call2 = this.interfaceName.DeleteFlash(payload2);
            call2.enqueue(new Callback<JsonObject>() {
                @Override
                public void onResponse(Call<JsonObject> call2, retrofit2.Response<JsonObject> response) {
                    Log.d("Delete Flash: ", "Success");
                    reasonView.setText("Question Deleted Sucessfully");
                    reasonPrompt.setText("");
                    keepQuestionButton.setVisibility(View.INVISIBLE);
                    removeQuestionButton.setVisibility(View.INVISIBLE);
                    editQuestionButton.setVisibility(View.INVISIBLE);
                }
                @Override
                public void onFailure(Call<JsonObject> call2, Throwable t) {
                    Log.d("Delete Flash Failed: ", t.toString());
                    reasonView.setText("Delete Flash Failed: " + t.toString());
                }
            });
        } catch (Exception e) {
            // Print the wrapper exception:
            System.out.println("Wrapper exception: " + e);

            // Print the 'actual' exception:
            System.out.println("Underlying exception: " + e.getCause());
        }
    }


    public void onClickEditQuestionButton(View myView) {
        Intent intent = new Intent(this, EditQuestionActivity.class);
        intent.putExtra("question", question);
        intent.putExtra("answer", answer);
        startActivityForResult(intent, 1000);
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        boolean edited = data.getBooleanExtra("edited", false);
        question = data.getStringExtra("question");
        answer = data.getStringExtra("answer");

        questionView.setText(question);
        answerView.setText(answer);
        if (edited == true) {
            reasonView.setText("");
            reasonPrompt.setWidth(1000);
            reasonPrompt.setText(R.string.question_edited);
        }
    }

    public void onClickCloseButton(View myView) {
        this.finish();
    }
}
