package com.example.cs4531.interviewapp;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface Retro {
    @GET("getTechnical")
    Call<JsonObject> getTechnical();

    @GET("getFlash")
    Call<JsonObject> getFlash();

    @Headers({"Content-Type: application/json"})
    @POST("createFlashAPI")
    Call<JsonObject> createFlash(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("createTechAPI")
    Call<JsonObject> createTech(@Body JsonObject object);

    @GET("getUser")
    Call<JsonObject> getUser(@Query("email") String email);

    @Headers({"Content-Type: application/json"})
    @POST("RankFlashAdmin")
    Call<JsonObject> RankFlashAdmin(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("RankFlashUser")
    Call<JsonObject> RankFlashUser(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("GetRankFlash")
    Call<JsonObject> GetRankFlash(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("RankTechAdmin")
    Call<JsonObject> RankTechAdmin(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("RankTechUser")
    Call<JsonObject> RankTechUser(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("GetRankTech")
    Call<JsonObject> GetRankTech(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @GET("getAllTechnical")
    Call<JsonArray> getAllTechnical();

    @Headers({"Content-Type: application/json"})
    @GET("getAllFlash")
    Call<JsonArray> getAllFlash();

    @Headers({"Content-Type: application/json"})
    @POST("ReportFlash")
    Call<JsonObject> ReportFlash(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("ReportTech")
    Call<JsonObject> ReportTech(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("FindFlash")
    Call<JsonObject> FindFlash(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("FindTech")
    Call<JsonObject> FindTech(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("DeleteFlash")
    Call<JsonObject> DeleteFlash(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("DeleteTech")
    Call<JsonObject> DeleteTech(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("ClearReportFlash")
    Call<JsonObject> ClearReportFlash(@Body JsonObject object);

    @Headers({"Content-Type: application/json"})
    @POST("EditFlash")
    Call<JsonObject> EditFlash(@Body JsonObject object);


    Gson gson = new GsonBuilder()
            .setLenient()
            .create();

    public static final Retrofit retro = new Retrofit.Builder()
            .baseUrl("http://ukko.d.umn.edu:12386/")
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build();
}
