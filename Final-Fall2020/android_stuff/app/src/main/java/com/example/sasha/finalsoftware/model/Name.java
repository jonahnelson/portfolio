package com.example.sasha.finalsoftware.model;


import org.json.JSONException;
import org.json.JSONObject;
import java.util.Comparator;

import java.util.Comparator;
import java.util.Objects;

/**
 * Class for storing name information associated with the Census Names Database.
 * @author Chris Dowd
 */
public class Name {

    /**
     * Default Constructor. Creates an empty Name with default values.
     */
    public Name() {
        this.setName("");
        this.setYear(0);
        this.setPopularity(0);
        this.setSex(Sex.NONE);
        this.setRating(Rating.NONE);
        this.setTagStatus(TagStatus.NOT_TAGGED);
    }

    /**
     * Copy Constructor
     * @param otherName The Name object to be copied.
     */
    public Name(Name otherName) {
        this.setSex(otherName.getSex());
        this.setYear(otherName.getYear());
        this.setPopularity(otherName.getPopularity());
        this.setRating(otherName.getRating());
        this.setTagStatus(otherName.getTagStatus());
    }

    /**
     * Returns the name string associated with this Name.
     * @return The name string associated with this Name
     */
    public String getName() {
        return this.name;
    }

    /**
     * Returns the year associated with this Name
     * @return The year associated with this name.
     */
    public int getYear() {
        return this.year;
    }

    /**
     * Returns the popularity of this Name
     * @return The popularity of this Name
     */
    public double getPopularity() {
        return this.popularity;
    }

    /**
     * Returns the sex associated with this Name
     * @return The sex associated with this Name.
     */
    public Sex getSex() {
        return this.sex;
    }

    /**
     * Returns the 1-5 rating of this name
     * @return The 1-5 rating of this name if the Name is rated otherwise NONE.
     */
    public Rating getRating() {
        return this.rating;
    }

    /**
     * Returns the current tag status of this Name.
     * @return TAGGED if this name is tagged; otherwise, NOT_TAGGED
     */
    public TagStatus getTagStatus() {
        return this.tagStatus;
    }

    /**
     * Sets the name associated with this name.
     * @param name The name string to be associated with this Name.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Sets the year associated with this Name.
     * @param year The year associated with this Name.
     */
    public void setYear(int year) {
        this.year = year;
    }

    /**
     * Sets the popularity of this Name within the range 0-1.
     * @param popularity The popularity of this Name within the range 0-1.
     * @throws IllegalArgumentException If the passed in popularity is not within the range 0-1.
     * @see IllegalArgumentException
     */
    public void setPopularity(double popularity) {
        if(popularity >= 0 && popularity <= 1) {
            this.popularity = popularity;
        } else {
            throw new IllegalArgumentException("Popularity must be within the range 0-1");
        }
    }

    /**
     * Sets the sex associated with this Name.
     * @param sex The sex to be associated with this Name.
     */
    public void setSex(Sex sex) {
        this.sex = sex;
    }

    /**
     * Sets the ONE-FIVE rating of this Name.
     * @param rating The ONE_FIVE rating of this name if the Name is rated; otherwise, none.
     */
    public void setRating(Rating rating) {
        this.rating = rating;
    }

    /**
     * Sets the tag status of this Name.
     * @param tagStatus The tag status of this name. TAGGED if you wish to tag the Name; otherwise, NOT_TAGGED.
     */
    public void setTagStatus(TagStatus tagStatus) {
        this.tagStatus = tagStatus;
    }

    /**
     * Returns a JSONObject representation of this Name.
     * @return A JSONObject representation of this Name.
     * @throws JSONException Unexpected Error in writing fields to a JSONObject.
     * @see JSONException
     */
    public JSONObject toJSON() throws JSONException {
        JSONObject nameJSON = new JSONObject();

        try {
            nameJSON.put("name", this.getName());
            nameJSON.put("year", this.getYear());
            nameJSON.put("popularity", this.getPopularity());
            nameJSON.put("sex", this.getSex());
        } catch (JSONException je) {
            throw new JSONException("Unexpected error in writing fields to JSONObject");
        }

        return nameJSON;
    }

    /**
     * Parses a JSONObject for name data fields and stores them within this Name object.
     * @param res A JSONObject representation of a Name
     * @throws JSONException If the res parameter is not a valid JSONObject
     * representation of a Name
     * @throws NullPointerException If the res parameter is null.
     * @see JSONException
     * @see NullPointerException
     */
    public void fromJSON(JSONObject res) throws JSONException {
        String fromJSONName;
        int fromJSONYear;
        double fromJSONPopularity;
        Sex fromJSONSex;

        try {
            fromJSONName = res.getString("name");
            fromJSONYear = res.getInt("year");
            fromJSONPopularity = res.getDouble("percent");
            fromJSONSex = Sex.fromString(res.getString("sex"));
        } catch (JSONException je) {
            throw new JSONException("The passed in JSONObject is not a valid JSON representation" +
                    " of a Name.");
        }

        if(res.length() == 4) {
            this.setName(fromJSONName);
            this.setYear(fromJSONYear);
            this.setPopularity(fromJSONPopularity);
            this.setSex(fromJSONSex);
        } else {
            throw new JSONException("The passed in JSONObject is not a valid JSON representation" +
                    " Name.");
        }
    }

    /**
     * Returns the string representation of this Name object.
     * @return The string represetation of this Name object.
     */
    @Override
    public String toString() {
        return "==========\n" + this.getYear() + "\n" + this.getName() + "\n" + this.getPopularity() + "\n" + this.getSex() + "\n";
    }

    /**
     * Returns true if this Name is equivalent to the passed in Name ignoring rating and tagStatus.
     * @param obj The Name to test for equality.
     * @return True if this Name is equivalent to the passed in Name name; otherwise, false.
     * @throws IllegalArgumentException If the passed in obj is not an instance of Name.
     * @see IllegalArgumentException
     */
    @Override
    public boolean equals(Object obj) {
        boolean ret = false;
        Name name = null;

        if(obj instanceof Name) {
            name = (Name) obj;
        } else {
            throw new IllegalArgumentException("The passed in value of obj is not an instance of" +
                    " Name");
        }
        if(name != null
                && (this.getName().equals(name.getName()))
                && (this.getYear() == name.getYear())
                && (this.getSex().equals(name.getSex()))) {
            ret = true;
        }

        return ret;
    }

    /**
     * Returns the hashcode value for this name ignoring rating and tagStatus.
     * @return The hashcode value for this name.
     */
    @Override
    public int hashCode() {
        int hash = 7;

        hash = 83 * hash + this.getName().hashCode();
        hash = 83 * hash + this.getYear();
        hash = 83 * hash + this.getSex().hashCode();

        return hash;
    }

    /**
     * Returns a Comparator for Names that compares two names by their name fields lexicographically.
     * @return A Comparator that compares two names by their name fields lexicographically.
     */
    public static Comparator<Name> getNameComparator() {
        return new Comparator<Name>() {
            @Override
            public int compare(Name name1, Name name2) {
                return name1.getName().compareTo(name2.getName());
            }
        };
    }


    /**
     * Retuns a Comparator for Names that compares two names by their year fields using standard integer comparison.
     * @return A comparator that compares two names by their year fields
     */
    public static Comparator<Name> getYearComparator() {
        return new Comparator<Name>() {
            @Override
            public int compare(Name name1, Name name2) {
                return Integer.compare(name1.getYear(),name2.getYear());
            }
        };
    }

    /**
     * Returns a Comparator for Names that compares two names by their popularity fields using standard double
     * comparison.
     * @return A comparator that compares two names by their popularity fields
     */
    public static Comparator<Name> getPopularityComparator() {
        return new Comparator<Name>() {
            @Override
            public int compare(Name name1, Name name2) {
                return Double.compare(name1.getPopularity(),name2.getPopularity());
            }
        };
    }

    public static Comparator<Name> getRatingComparator() {
        return new Comparator<Name>() {
            @Override
            public int compare(Name name1, Name name2) {
                return name1.getRating().compareTo(name2.getRating());
            }
        };
    }

    private String name;

    private int year;

    private double popularity;

    private Sex sex;

    private Rating rating;

    private TagStatus tagStatus;

    public enum Sex {
        BOY("boy"),
        GIRL("girl"),
        NONE("none");

        /**
         * Constructs the Sex with the associated String.
         * @param sexString The String associated with this Sex.
         */
        Sex(String sexString) {
            this.sexString = sexString;
        }

        /**
         * Returns the String associated with the given Sex.
         * @return The String associated with the given Sex.
         */
        @Override
        public String toString() {
            return sexString;
        }

        /**
         * Returns the Sex Enum associated with str.
         * @param str A string representation of a sex. Can be boy, girl, or none.
         * @return  The sex associated with the passed in string
         * @throws IllegalArgumentException If the passed in string does not have an associated Sex Enum.
         */
        public static Sex fromString(String str) {
            Sex sex = NONE;

            switch (str) {
                case "boy":
                    sex = BOY;
                    break;
                case "girl":
                    sex = GIRL;
                    break;
                case "none":
                    sex = NONE;
                    break;
                default:
                    throw new IllegalArgumentException("Passed in value str must be boy, girl, or none.");
            }

            return sex;
        }

        private String sexString;
    }



    public enum Rating {
        NONE,
        ONE,
        TWO,
        THREE,
        FOUR,
        FIVE;
    }

    public enum TagStatus {
        TAGGED,
        NOT_TAGGED;
    }
}
