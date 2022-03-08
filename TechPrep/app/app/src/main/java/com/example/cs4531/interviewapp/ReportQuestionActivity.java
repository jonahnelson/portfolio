package com.example.cs4531.interviewapp;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.view.View;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.Callback;

public class ReportQuestionActivity  extends AppCompatActivity {

   private User user;
   private String question;
   private String answer;
   private String comment;
   private boolean check = false;
   private Retro interfaceName = Retro.retro.create(Retro.class);
   private Button responseButton;
   private Button cancelButton;

   private EditText commentField;
   private TextView answerTextView;
   private TextView questionTextView;
   private TextView errorTextView;

   private Spinner choiceSpinner;
   private String[] options = {"Select an option","Duplicate Question","Poor Phrasing","Wrong Answer","Other"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report_question);

        Intent intent = getIntent();
        user = (User) intent.getSerializableExtra("user");
        responseButton = findViewById(R.id.responseButton);
        responseButton.setText("Cancel");

        questionTextView = findViewById(R.id.questionTextView);
        answerTextView = findViewById(R.id.answerTextView);
        errorTextView = findViewById(R.id.errorTextView);
        choiceSpinner = findViewById(R.id.decisionSpinner);
        commentField = findViewById(R.id.editText);

        question = (String) intent.getStringExtra("question").replace("\"", "");
        answer = (String) intent.getStringExtra("answer").replace("\"","");

        questionTextView.setText(question);
        answerTextView.setText(answer);

        ArrayAdapter aa = new ArrayAdapter(this,android.R.layout.simple_spinner_item,options);
        aa.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        choiceSpinner.setAdapter(aa);
        choiceSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int position, long l) {
                if(position == 0){
                    responseButton.setText("Cancel");
                    check = false;
                    errorTextView.setText("");
                }
                if(position == 1){
                    responseButton.setText("Submit");//Duplicate Question
                    check = false;
                    errorTextView.setText("");
                }
                if(position == 2){
                    responseButton.setText("Submit");//Poor phrasing
                    check = false;
                    errorTextView.setText("");
                }
                if(position == 3){
                    responseButton.setText("Submit");//Wrong answer
                    check = false;
                    errorTextView.setText("");
                }
                if(position == 4){
                    responseButton.setText("Submit");//Other
                    check =true;
                }
            }
            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
    }
    public void onClickSubmitReport(View v){
            comment = commentField.getText().toString();
            if(comment == "" && check == true){
                errorTextView.setText("The comment can not be blank!");
            }
            else{
                try {
                JsonObject payload2 = new JsonObject();
                payload2.addProperty("question", questionTextView.getText().toString());
                payload2.addProperty("reason", choiceSpinner.getSelectedItem().toString());
                payload2.addProperty("comment",comment);
                payload2.addProperty("user", user.getUsername());
                Call<JsonObject> call2;
                call2 = this.interfaceName.ReportFlash(payload2);
                call2.enqueue(new Callback<JsonObject>() {
                    @Override
                    public void onResponse(Call<JsonObject> call2, retrofit2.Response<JsonObject> response) {
                        Log.d("Flash Question Report Update: ", "Success");
                    }
                    @Override
                    public void onFailure(Call<JsonObject> call2, Throwable t) {
                        Log.d("Flash Question Report Failed: ", t.toString());
                    }
                });
            } catch (Exception e) {
            // Print the wrapper exception:
            System.out.println("Wrapper exception: " + e);

            // Print the 'actual' exception:
            System.out.println("Underlying exception: " + e.getCause());
        }
                this.finish();
            }
        }
    }


