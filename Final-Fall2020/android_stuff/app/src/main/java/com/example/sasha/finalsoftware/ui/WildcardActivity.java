package com.example.sasha.finalsoftware.ui;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.text.method.ScrollingMovementMethod;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.TextView;
import com.example.cs4531.finalsoftware.R;

import java.util.Random;

public class WildcardActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_wildcard);


        Button compareBtn = findViewById(R.id.compareBtn);
        compareBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
            char[] letters = {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'};
            Random r = new Random();
            String nameToServer;
            int minTimeToServer;
            int maxTimeToServer;
            int sexToServer;
            TextView resultList = findViewById(R.id.wildcardNameList);
            TextView errorbox = findViewById(R.id.wildcardErrorBox);
            EditText mindate = findViewById(R.id.wildcardTimeMin);
            EditText maxdate = findViewById(R.id.wildcardTimeMax);
            EditText name = findViewById(R.id.wildcardName);
            Switch nameSwitch = findViewById(R.id.wildcardSwitchName);
            Switch timeSwitch = findViewById(R.id.wildcardSwitchPeriod);
            Switch sexSwitch = findViewById(R.id.wildcardSwitchSex);

                resultList.setMovementMethod(new ScrollingMovementMethod());

                String minDate = mindate.getText().toString();
                String maxDate = maxdate.getText().toString();
                String n1 = name.getText().toString();

                if (!minDate.equals("") && !maxDate.equals("") && !n1.equals("")) {      //Makes sure there is no blank fields
                    int mDate = Integer.parseInt(minDate);
                    int maDate = Integer.parseInt(maxDate);
                    if (mDate < 1880 || maDate > 2008 || mDate > maDate) {    //Makes sure data is in range
                        errorbox.setText("Check your dates");
                    } else {

                        if (nameSwitch.isEnabled() == true){

                            for (int n = 0; n<20; ++n){
                                int rand = (r.nextInt(25)+0);
                                int prefixletter = letters[rand];
                                resultList.append(prefixletter + "\n");
                            }
                            //int rand = (r.nextInt(25)+0);
                            //int prefixletter = letters[rand];
                            //Send prefixletter to thet server to be used in a prefix search
                        }


                    }
                } else {
                    errorbox.setText("The two name and date fields can not be blank");
                }
            }
        });
    }
}