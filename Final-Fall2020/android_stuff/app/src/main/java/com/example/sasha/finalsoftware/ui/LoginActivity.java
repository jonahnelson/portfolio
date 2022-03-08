package com.example.sasha.finalsoftware.ui;

import android.content.Intent;
import android.net.Uri;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import com.example.cs4531.finalsoftware.R;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;


public class LoginActivity extends AppCompatActivity implements View.OnClickListener{

    //Google Sign In
    GoogleSignInClient mGoogleSignInClient;
    static final int RC_SIGN_IN = 9001;

    //Nav Header Components
    ImageView userImage;
    TextView userinfo0;

    @Override
    protected void onStart() {
        super.onStart();
        mGoogleSignInClient.signOut();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        userinfo0 = findViewById(R.id.info);

        //Google Sign in
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);
        findViewById(R.id.SignIn).setOnClickListener((View.OnClickListener) this);
    }

    private void updateUI(GoogleSignInAccount user) {
        if (user != null) {
            String personName = user.getDisplayName();
            String personEmail = user.getEmail();
            String personId = user.getId();
            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
            /*intent.putExtra("name", personName);
            intent.putExtra("email", personEmail);
            userinfo0.setText("Username: " + personName + "\n" + "Id: " +personId+ "\n" + "Email: "  + personEmail);*/
            intent.putExtra("userName", personName);
            intent.putExtra("userEmail", personEmail);
            intent.putExtra("userID", personId);
            startActivity(intent);
        }

    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.SignIn:
                signIn();
                break;
            // ...
        }
    }

    private void signIn() {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            // The Task returned from this call is always completed, no need to attach
            // a listener.
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
    }

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
            Toast.makeText(this, "Signed in successfully.", Toast.LENGTH_SHORT).show();
            // Signed in successfully, show authenticated UI.
            updateUI(account);
        } catch (ApiException e) {
            Toast.makeText(this, "Sign in failed.", Toast.LENGTH_SHORT).show();
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
        }
    }

}



