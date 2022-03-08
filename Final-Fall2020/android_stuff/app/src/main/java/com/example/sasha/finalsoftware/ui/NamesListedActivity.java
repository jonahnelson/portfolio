package com.example.sasha.finalsoftware.ui;

import android.os.Bundle;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import com.example.cs4531.finalsoftware.R;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.Iterator;

public class NamesListedActivity extends AppCompatActivity {
    TextView testTextView, nameView;

    Bundle userInfo;
    DatabaseReference database;
    DataSnapshot current;
    ArrayList<String> list, namesList5, namesList45, namesList4,
            namesList35, namesList3, namesList25, namesList2,
            namesList15, namesList1, namesList05, namesList0,
            namesListUnrated;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.names_listed);
        testTextView = findViewById(R.id.textView3);
        userInfo = getIntent().getExtras();
        nameView = findViewById(R.id.nameView);
        namesList5 = new ArrayList<>();
        namesList45  = new ArrayList<>();
        namesList4  = new ArrayList<>();
        namesList35 = new ArrayList<>();
        namesList3 = new ArrayList<>();
        namesList25 = new ArrayList<>();
        namesList2 = new ArrayList<>();
        namesList15 = new ArrayList<>();
        namesList1 = new ArrayList<>();
        namesList05 = new ArrayList<>();
        namesList0 = new ArrayList<>();
        namesListUnrated = new ArrayList<>();
        database = FirebaseDatabase.getInstance().getReference("Users");
        list = new ArrayList<>();
        //database.child(userInfo.getString("userID")).
        database.child(userInfo.getString("userID")).addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                Iterator<DataSnapshot> iterator = snapshot.getChildren().iterator();
                boolean exhausted = false;

                for(DataSnapshot child : snapshot.getChildren()){
                    /*if(testTextView.getText().toString().equals("Loading...")){
                        testTextView.setText("");
                    }*/
                    if(child.getValue(String.class).contains("5.0")){
                        /*if(testTextView.getText().toString().equals("Loading...")){
                            testTextView.setText("");
                        }*/
                        namesList5.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("4.5")){

                        namesList45.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("4.0")){
                        namesList4.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("3.5")){
                        namesList35.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("3.0")){
                        namesList3.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("2.5")){
                        namesList25.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("2.0")){
                        namesList2.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("1.5")){
                        namesList15.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("1.0")){
                        namesList1.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("0.5")){
                        namesList05.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("0.0")){
                        namesList0.add(child.getKey() + ": " + child.getValue());
                    } else if(child.getValue(String.class).contains("Not rated")){
                        namesListUnrated.add(child.getKey() + ": " + child.getValue());
                                /*child.getKey().concat(": ").concat(child.getValue(String.class)).concat(
                                        "\n"
                                )));*/
                    }


                }
                ArrayList<String> fullList = new ArrayList<String>();
                fullList.addAll(namesList5);
                fullList.addAll(namesList45);
                fullList.addAll(namesList4);
                fullList.addAll(namesList35);
                fullList.addAll(namesList3);
                fullList.addAll(namesList25);
                fullList.addAll(namesList2);
                fullList.addAll(namesList15);
                fullList.addAll(namesList1);
                fullList.addAll(namesList05);
                fullList.addAll(namesList0);
                fullList.addAll(namesListUnrated);
                nameView.setText(userInfo.getString("userName") + "'s saved names and ratings");
                String namesList = fullList.toString().replace(", ", "\n")
                        .replace("[", "").replace("]", "");
                testTextView.setText(namesList);
                /*testTextView.setText(testTextView.getText().toString().substring(0, testTextView.
                        getText().toString().length() - 1));*/

                //testTextView.setText(list.toString());
                //testTextView.setText(snapshot.getChildren().toString());
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
        //namesList5.addAll(namesList4);

        //testTextView.setText(String.valueOf(namesList5.size()));
        //testTextView.setText(database.child(userInfo.getString("userID"))
    }
}
