package com.example.sasha.finalsoftware.model.util;

import com.example.sasha.finalsoftware.model.Name;
import com.example.sasha.finalsoftware.model.Period;

import java.util.ArrayList;

import android.content.Context;
import android.util.Log;
import com.android.volley.*;
import com.android.volley.toolbox.*;
import com.example.sasha.finalsoftware.ui.CompareNameActivity;
import com.example.sasha.finalsoftware.ui.SearchActivity;
import org.json.*;
import java.util.*;

/**
 * A class that provides methods for searching the names-census database.
 */
public class CensusSearcher {

    public Context context;
    public List nameList;
    private RequestQueue queue;
    private CompareNameActivity compareActivity;
    private SearchActivity searchActivity;

    /**
     * Constructs a new CensusSearcher
     */
    public CensusSearcher(Context context, CompareNameActivity com) {
        this.context = context;
        nameList = new ArrayList<Name>();
        queue = Volley.newRequestQueue(context);
        compareActivity = com;
    }

    public CensusSearcher(Context context, SearchActivity searchcom){
        this.context = context;
        nameList = new ArrayList<Name>();
        queue = Volley.newRequestQueue(context);
        searchActivity = searchcom;
    }

    /**
     * Searches the census database for the passed in name and returns an ArrayList of Names containing the results.
     * @param name The name to search for.
     * @return  An ArrayList of Names that contains the search results.
     */
    public void searchForName(String name, Period period) {
        // TODO: parse name and change into a regular expression with the
        // behavior we want
        /*String url = "http://ukko.d.umn.edu:15001/getName/"
                + wildcardToRegex(name) + "/" + period.getStartYear() + "/" + period.getEndYear();

        JsonArrayRequest req = new JsonArrayRequest
                (Request.Method.GET, url, null, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                Log.d("git_sum", "response in searchForName");
                fillNameList(response);
                //compareActivity.updateGUI();
                searchActivity.updateGUI();
            }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d("git_sum", "error in searchForName" + error);
                }
            });

        queue.add(req);*/
    }

    public String wildcardToRegex(String wildcard) {
        if (wildcard.toCharArray()[0] == '*') wildcard = wildcard.substring(1);
        else if (wildcard.toCharArray()[0] == '?') wildcard = "^." + wildcard.substring(1);
        else wildcard = "^" + wildcard;

        int len = wildcard.toCharArray().length - 1;
        if (wildcard.toCharArray()[len] == '*') wildcard = wildcard.substring(0, len);
        else if(wildcard.toCharArray()[len] == '?') wildcard = wildcard.substring(0, len) + ".$";
        else wildcard = wildcard + "$";

        wildcard = wildcard.replace("*", "[a-z]*");
        wildcard = wildcard.replace('?', '.');

        return wildcard;
    }

    /**
     * Returns the List of names to be used for GUI implementation.
     * @return
     */
    public List<String> getNameList(){
        return nameList;
    }

    /**
     * Searches the census database for the passed in name within the given time period.
     * @param name The name to search for.
     * @param period The time period for the search.
     * @return An ArrayList of Names that contains the search results.
     */
    public ArrayList<Name> searchForNameWithinPeriod(String name, Period period) {
        ArrayList<Name> nameList = new ArrayList<Name>();

        //TODO

        return nameList;
    }

    /**
     * Searches the census database for names associated with the passed in prefix String
     * @param prefix The prefix to search the database for.
     * @return An ArrayList of Names that contains the search results.
     */
    public ArrayList<Name> prefixSearch(String prefix) {
        ArrayList<Name> nameList = new ArrayList<Name>();

        //TODO

        return nameList;
    }

    /**
     * Searches the census database for names associated with the passed in wildcard String.
     * @param wildcard The wildcard to search the database for.
     * @return An ArrayList of Names that contains the search results.
     */
    public ArrayList<Name> wildcardSearch(String wildcard) {
        ArrayList<Name> nameList = new ArrayList<Name>();

        //TODO

        return nameList;
    }

    /**
     * Fills nameList with response from server
     * @param jsonArray
     */
    private void fillNameList(JSONArray jsonArray) {
        JSONObject jsonObject;
        Name name;

        try {
            for (int i = 0, len = jsonArray.length(); i < len; i++) {
                jsonObject = jsonArray.getJSONObject(i);
                name = new Name();
                name.setName((String) jsonObject.get("name"));
                name.setYear((Integer) jsonObject.get("year"));
                name.setPopularity((Double) jsonObject.get("percent"));
                name.setSex(Name.Sex.fromString((String) jsonObject.get("sex")));
                nameList.add(name);
                Log.d("git_sum", name.getName() + " " + name.getYear());
            }
        } catch (JSONException e) {
            Log.d("git_sum", "exception in fill name list " + e);
        }
    }
}
