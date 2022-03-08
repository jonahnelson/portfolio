package com.example.cs4531.interviewapp;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.google.gson.JsonObject;

import org.w3c.dom.Text;

import retrofit2.Call;
import retrofit2.Callback;

public class EditQuestionActivity extends AppCompatActivity {

    String question;
    String answer;
    EditText questionView;
    EditText answerView;
    TextView responseView;
    Intent returnIntent;
    Retro interfaceName = Retro.retro.create(Retro.class);


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_question);

        Intent intent = getIntent();
        question = (String) intent.getStringExtra("question");
        answer = (String) intent.getStringExtra("answer");

        questionView = (EditText) findViewById(R.id.questionToEdit);
        questionView.setText(question);
        answerView = (EditText) findViewById(R.id.answerToEdit);
        answerView.setText(answer);
        responseView = (TextView) findViewById(R.id.responseView);
    }


    public void onClickSaveChangesButton(View myView) {
        responseView.setText("");
        returnIntent = new Intent();
        Intent intent = getIntent();
        String oldQuestion = intent.getStringExtra("question");
        final String newQuestion = questionView.getText().toString();
        final String newAnswer = answerView.getText().toString();
        try {
            JsonObject payload2 = new JsonObject();
            payload2.addProperty("newQuestion", newQuestion);
            payload2.addProperty("answer", newAnswer);
            payload2.addProperty("question", oldQuestion);
            Call<JsonObject> call2;
            call2 = this.interfaceName.EditFlash(payload2);
            call2.enqueue(new Callback<JsonObject>() {
                @Override
                public void onResponse(Call<JsonObject> call2, retrofit2.Response<JsonObject> response) {
                    Log.d("Flash Question Update: ", "Success");
                    responseView.setText("Changes made successfully");
                    returnIntent.putExtra("edited", true);
                    returnIntent.putExtra("question", newQuestion);
                    returnIntent.putExtra("answer", newAnswer);
                }
                @Override
                public void onFailure(Call<JsonObject> call2, Throwable t) {
                    Log.d("Flash Question Update Failed: ", t.toString());
                    responseView.setText("Flash Question Update Failed");
                    returnIntent.putExtra("edited", false);
                    returnIntent.putExtra("question", question);
                    returnIntent.putExtra("answer", answer);
                }
            });
        } catch (Exception e) {
            // Print the wrapper exception:
            System.out.println("Wrapper exception: " + e);

            // Print the 'actual' exception:
            System.out.println("Underlying exception: " + e.getCause());
        }

    }


    public void onClickCloseButton(View myView) {
        if(returnIntent == null) {
            returnIntent = new Intent();
            returnIntent.putExtra("edited", false);
            returnIntent.putExtra("question", question);
            returnIntent.putExtra("answer", answer);
        }
        setResult(RESULT_OK, returnIntent);
        this.finish();
    }
}
