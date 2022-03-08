package com.example.cs4531.interviewapp;

import android.content.Intent;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.Callback;

public class LogIn extends AppCompatActivity implements View.OnClickListener, GoogleApiClient.OnConnectionFailedListener {


    private SignInButton signIn;
    private Button signOut;
    private TextView accountInfo;
    GoogleSignInOptions signInOptions;
    private static final int REQ_CODE = 9001;
    GoogleApiClient googleApiClient;
    User user;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_log_in);
        signIn = (SignInButton)findViewById(R.id.googleLogIn);
        signIn.setOnClickListener(this);
        signOut = (Button)findViewById(R.id.googleLogOut);
        GoogleSignInOptions signInOptions = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN).requestEmail().build();
        googleApiClient = new GoogleApiClient.Builder(this).enableAutoManage(this, this).addApi(Auth.GOOGLE_SIGN_IN_API, signInOptions).build();
        accountInfo = (TextView)findViewById(R.id.accountInfo);
        accountInfo.setText("Tech Prep");

    }

    @Override
    public void onClick(View view) {

        //either logs in or logs out depending on the id
        if(view.getId() == R.id.googleLogIn)
        {
            signIn();
        }

        else {
            signOut(view);
        }
    }

    //signs user in
    private void signIn() {
        Intent intent = Auth.GoogleSignInApi.getSignInIntent(googleApiClient);
        startActivityForResult(intent, REQ_CODE);
    }

    //signs user out
    protected void signOut(View view) {
        Auth.GoogleSignInApi.signOut(googleApiClient).setResultCallback(new ResultCallback<Status>() {
            @Override
            public void onResult(@NonNull Status status) {
                Toast.makeText(getApplicationContext()," Logged out", Toast.LENGTH_SHORT).show();
                updateUI(false);
            }
        });
    }

    //signOut function that doesn't need a view parameter
    protected void logout() {
        Auth.GoogleSignInApi.signOut(googleApiClient);
        updateUI(false);

    }

    /**
     * Used when the node server is not running, which makes regular login not work properly.
     * This gives quick and easy access to the rest of the app.
     * (Will delete later)
     */
    public void onClickTestUserButton(View view) {
        user = new User("testUser@d.umn.edu", false);
        updateUI(true);
    }
    public void onClickTestAdminButton(View view) {
        user = new User("testAdmin@d.umn.edu", true);
        updateUI(true);
    }

    public void updateUI(boolean isLogin) {
        if(isLogin) {
            //brings app to main activity
            Intent main = new Intent(this, MainActivity.class);
            main.putExtra("user", user);
            startActivity(main);
        }
        else{
            //stays at login screen
            Intent logInIntent = new Intent(this, LogIn.class);
            startActivity(logInIntent);

        }

    }
    Retro interfaceName = Retro.retro.create(Retro.class);
    private void handleResult(GoogleSignInResult result){
        if(result.isSuccess()) {
            GoogleSignInAccount account = result.getSignInAccount();
            final String email = account.getEmail();
            user = new User(email, false);
            if(email.endsWith("d.umn.edu")) {
                //Send Card
                try {
                Call<JsonObject> call2 = this.interfaceName.getUser("moexx399@d.umn.edu");
                call2.enqueue(new Callback<JsonObject>() {
                        @Override
                        public void onResponse(Call<JsonObject> call2, retrofit2.Response<JsonObject> response) {
                            Log.d("Admin Check Sucessfull: ", "Success");
                            if (response.body().get("accessLevel").getAsString().equals("admin")) {
                                user = new User(email, true);
                                updateUI(true);
                            } else {
                                user = new User(email, false);
                                updateUI(true);}
                        }
                        @Override
                        public void onFailure(Call<JsonObject> call2, Throwable t) {
                            Log.d("Admin Check Failed: ", t.toString());
                            user = new User(email, false);
                        }
                    });
                }
                catch(Exception e) {
                    // Print the wrapper exception:
                    System.out.println("Wrapper exception: " + e);

                    // Print the 'actual' exception:
                    System.out.println("Underlying exception: " + e.getCause());
                }


            }
            else {
                Toast.makeText(LogIn.this,"Please use a d.umn.edu email",
                        Toast.LENGTH_LONG).show();
                updateUI(false);
                logout();
            }
        }
        else {
            updateUI(false);
        }

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQ_CODE) {
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            handleResult(result);

        }
    }


    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }
}