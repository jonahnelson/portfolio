package com.example.sasha.finalsoftware.ui;

import android.graphics.Color;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.text.method.ScrollingMovementMethod;
import android.view.*;
import android.view.View;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;
import com.example.cs4531.finalsoftware.R;
import com.example.sasha.finalsoftware.model.Period;
import com.example.sasha.finalsoftware.model.Name;
import com.example.sasha.finalsoftware.model.util.CensusSearcher;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.Iterator;
import java.util.List;
import static java.lang.Integer.valueOf;


public class SearchActivity extends AppCompatActivity {
    EditText nameBox, minYearBox, maxYearBox;
    TextView searchNameList, searchResultName;
    RatingBar ratingBar;
    DatabaseReference database = FirebaseDatabase.getInstance().getReference("Names");
    DatabaseReference userDatabase = FirebaseDatabase.getInstance().getReference("Users");
    Bundle userInfo;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);
        nameBox = findViewById(R.id.searchName);
        minYearBox = findViewById(R.id.searchDate);
        maxYearBox = findViewById(R.id.searchDate2);
        searchNameList = findViewById(R.id.searchNameList);
        searchNameList.setMovementMethod(new ScrollingMovementMethod());
        searchResultName = findViewById(R.id.searchResultName);
        ratingBar = findViewById(R.id.ratingBar);
        userInfo = getIntent().getExtras();
        ratingBar.setBackgroundColor(Color.argb(0xff, 200, 200, 200));
        final ImageButton searchButton = findViewById(R.id.searchBtn);

        searchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (nameBox.getText().toString().equals("")) {
                    Toast.makeText(getApplicationContext(),
                            "Please enter a name.",
                            Toast.LENGTH_LONG).show();
                } else {
                    if (minYearBox.getText().toString().equals("") || maxYearBox.getText().toString().equals("")) {
                        if (minYearBox.getText().toString().equals("") && maxYearBox.getText().toString().equals("")) {
                            Toast.makeText(getApplicationContext(),
                                    "Please enter years.",
                                    Toast.LENGTH_LONG).show();
                        } else {
                            Toast.makeText(getApplicationContext(),
                                    "Please fill in both years, not just one.",
                                    Toast.LENGTH_LONG).show();
                        }
                    } else {

                        String nameInput = nameBox.getText().toString();
                        int minYearInput = valueOf(minYearBox.getText().toString());
                        int maxYearInput = valueOf(maxYearBox.getText().toString());
                        if (minYearInput > maxYearInput || minYearInput < 1880 || maxYearInput > 2008) {
                            Toast.makeText(getApplicationContext(),
                                    "Check your numbers.",
                                    Toast.LENGTH_LONG).show();
                        } else {
                            searchResultName.setText(nameInput);
                            for (int i = minYearInput; i <= maxYearInput; i++) {
                                final int iRef = i;
                                database.child(nameInput).child(String.valueOf(i)).addValueEventListener(new ValueEventListener() {
                                    @Override
                                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                                        if (snapshot.exists()) {
                                            searchNameList.setText(searchNameList.getText().toString().concat(
                                                    String.valueOf(iRef) + ": " + (snapshot.getValue(String.class))
                                                            + "\n"));
                                        }
                                    }

                                    @Override
                                    public void onCancelled(@NonNull DatabaseError error) {
                                        Toast.makeText(SearchActivity.this, "Failed to retrieve information.", Toast.LENGTH_SHORT).show();
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });
    }

    public void onClickRatingBar(View v){
        if(nameBox.getText().toString().equals("")){
            Toast.makeText(getApplicationContext(),
                    "Please enter a name to rate.",
                    Toast.LENGTH_LONG).show();
        } else {
            userDatabase.child(userInfo.getString("userID")).
                    child(nameBox.getText().toString()).
                    setValue(String.valueOf(ratingBar.getRating())).addOnSuccessListener(new OnSuccessListener<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    Toast.makeText(getApplicationContext(),
                            "Rated " + nameBox.getText().toString() + " as " + String.valueOf(
                                    ratingBar.getRating()) + " stars in your account.",
                            Toast.LENGTH_LONG).show();
                }
            });
        }
    }
    public void onClickSave(View v){
        if(nameBox.getText().toString().equals("")){
            Toast.makeText(getApplicationContext(),
                    "Please enter a name to save.",
                    Toast.LENGTH_LONG).show();
        } else {
            final DatabaseReference users = FirebaseDatabase.getInstance().getReference("Users");
            users.child(userInfo.getString("userID")).child(nameBox.getText().toString()).setValue("Not rated");


            Toast.makeText(getApplicationContext(),
                    "Saved " + nameBox.getText().toString() + " in your account.",
                    Toast.LENGTH_LONG).show();

        }
    }
    public void onClickUnsave(View v){
        DatabaseReference users = FirebaseDatabase.getInstance().getReference("Users");
        users.child(userInfo.getString("userID")).child(nameBox.getText().toString()).removeValue();
        Toast.makeText(getApplicationContext(),
                "Removed " + nameBox.getText().toString() + " from your account.",
                Toast.LENGTH_LONG).show();
    }
    }

