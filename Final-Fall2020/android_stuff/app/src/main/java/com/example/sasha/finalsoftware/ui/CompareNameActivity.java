package com.example.sasha.finalsoftware.ui;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.text.method.ScrollingMovementMethod;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.example.cs4531.finalsoftware.R;
import com.example.sasha.finalsoftware.model.Name;
import com.example.sasha.finalsoftware.model.Period;
import com.example.sasha.finalsoftware.model.util.CensusSearcher;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.List;

import static java.lang.Integer.valueOf;

public class CompareNameActivity extends AppCompatActivity {

    private EditText compareName1, compareName2,
                    compareDate1, compareDate2;
    private TextView compareNameList1, compareNameList2,
                    compareResultName1disc, compareResultName2disc;
    private DatabaseReference database;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_compare);
        compareName1 = findViewById(R.id.compareName1);
        compareName2 = findViewById(R.id.compareName2);
        compareDate1 = findViewById(R.id.compareDate1);
        compareDate2 = findViewById(R.id.compareDate2);
        compareNameList1 = findViewById(R.id.compareNameList1);
        compareNameList1.setMovementMethod(new ScrollingMovementMethod());
        compareNameList2 = findViewById(R.id.compareNameList2);
        compareNameList2.setMovementMethod(new ScrollingMovementMethod());
        compareResultName1disc = findViewById(R.id.compareResultName1disc);
        compareResultName2disc = findViewById(R.id.compareResultName2disc);
        database = FirebaseDatabase.getInstance().getReference("Names");
        /*name1Search = new CensusSearcher(this, this);
        name2Search = new CensusSearcher(this, this);*/

        ImageButton compareBtn = findViewById(R.id.compareBtn);
        compareBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (compareName1.getText().toString().equals("") || compareName2.getText()
                    .toString().equals("")) {
                        Toast.makeText(getApplicationContext(),
                                "Please fill in both name fields.",
                                Toast.LENGTH_LONG).show();
                    } else {
                        if (compareDate1.getText().toString().equals("") || compareName2.getText().toString().equals("")) {
                            if (compareName1.getText().toString().equals("") && compareName2.getText().toString().equals("")) {
                                //display saving and rating
                            } else {
                                Toast.makeText(getApplicationContext(),
                                        "Please fill in both dates, not just one.",
                                        Toast.LENGTH_LONG).show();
                            }
                        } else {
                            String nameInput1 = compareName1.getText().toString();
                            String nameInput2 = compareName2.getText().toString();
                            int minYearInput = valueOf(compareDate1.getText().toString());
                            int maxYearInput = valueOf(compareDate2.getText().toString());
                            if(minYearInput < 1880 || minYearInput > 2008
                                || maxYearInput < 1880 || maxYearInput > 2008
                                || minYearInput > maxYearInput){
                                Toast.makeText(getApplicationContext(),
                                        "Check your numbers.",
                                        Toast.LENGTH_LONG).show();
                            } else {
                                compareResultName1disc.setText(nameInput1);
                                compareResultName2disc.setText(nameInput2);
                            for (int i = minYearInput; i <= maxYearInput; i++) {
                                final int iRef = i;
                                database.child(nameInput1).child(String.valueOf(i)).addValueEventListener(new ValueEventListener() {
                                    @Override
                                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                                        if (snapshot.exists()) {
                            /*int original = Integer.valueOf(snapshot.getValue(String.class));
                            String percentage = String.valueOf(original * 100);*/
                                            compareNameList1.setText(compareNameList1.getText().toString().concat(
                                                    String.valueOf(iRef) + ": " + (snapshot.getValue(String.class))
                                                            + "\n"));
                                        }
                                    }

                                    @Override
                                    public void onCancelled(@NonNull DatabaseError error) {

                                    }
                                });
                                database.child(nameInput2).child(String.valueOf(i)).addValueEventListener(new ValueEventListener() {
                                    @Override
                                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                                        if (snapshot.exists()) {
                            /*int original = Integer.valueOf(snapshot.getValue(String.class));
                            String percentage = String.valueOf(original * 100);*/
                                            compareNameList2.setText(compareNameList2.getText().toString().concat(
                                                    String.valueOf(iRef) + ": " + (snapshot.getValue(String.class))
                                                            + "\n"));
                                        }
                                    }

                                    @Override
                                    public void onCancelled(@NonNull DatabaseError error) {

                                    }
                                });
                            }
                        }
                    }

                }}
            });
    }

}
