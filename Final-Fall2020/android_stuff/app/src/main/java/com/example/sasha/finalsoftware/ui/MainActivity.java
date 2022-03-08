package com.example.sasha.finalsoftware.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.cs4531.finalsoftware.R;



public class MainActivity extends LoginActivity {
    //SignOut Button
    Button GsignOut;
    TextView Account;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Bundle bundle = getIntent().getExtras();
        Button buttonToCompare = findViewById(R.id.compButton);
        Button buttonToSearch = findViewById(R.id.searchButton);
        Button buttonToViewNames = findViewById(R.id.ViewNames);
        Account = findViewById(R.id.textView2);

        buttonToCompare.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                startActivity(new Intent(MainActivity.this, CompareNameActivity.class));
            }
        });

        buttonToSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, SearchActivity.class);
                intent.putExtra("userName", getIntent().getExtras().getString("userName"));
                intent.putExtra("userEmail", getIntent().getExtras().getString("userEmail"));
                intent.putExtra("userID", getIntent().getExtras().getString("userID"));
                startActivity(intent);
            }
        });

        buttonToViewNames.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, NamesListedActivity.class);
                intent.putExtra("userName", getIntent().getExtras().getString("userName"));
                intent.putExtra("userEmail", getIntent().getExtras().getString("userEmail"));
                intent.putExtra("userID", getIntent().getExtras().getString("userID"));
                startActivity(intent);
            }
        });

        GsignOut = findViewById(R.id.SignOut);
        GsignOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Gsignout();
            }
        });

        String name = bundle.getString("userName");
        String email = bundle.getString("userEmail");
        Account.setText(name + "\n" + email);

    }

    public void switchToNamesListed(View myView) {
        Intent myIntent = new Intent(this, NamesListedActivity.class);
        startActivity(myIntent);
    }

    private void Gsignout(){
        mGoogleSignInClient.signOut();
        startActivity(new Intent(MainActivity.this, LoginActivity.class));
    }

}
