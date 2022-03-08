package com.example.cs4531.interviewapp;

import android.net.Uri;

import java.util.List;

public class Upload {
    private String mName;
    private String mVideoUrl;
    private String mTitle;
    private String mComments;
    Uri video;

    public Upload(){}
    public Upload(String username, String videoUrl, String title, String comments){
        mName = username;
        mVideoUrl = videoUrl;
        mTitle = title;
        mComments = comments;
    }
    
    public String getName(){
        return mName;
    }

    public void setName(String name){
        mName = name;
    }

    public String getVideoUrl(){
        return mVideoUrl;
    }

    public void setVideoUrl(String videoUrl){
        mVideoUrl = videoUrl;
    }

    public void setTitle(String title) {mTitle = title; }
    
    public String getTitle() { return mTitle; }

    public String getComments(){return mComments;}
    
    public void setComments(String comments){mComments = comments;}
    
    public Uri getVideo(){
        return video;
    }

    public void setVideo(Uri iVideo){
        video = iVideo;
    }
}
