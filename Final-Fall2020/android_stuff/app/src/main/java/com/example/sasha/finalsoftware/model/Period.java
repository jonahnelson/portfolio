package com.example.sasha.finalsoftware.model;

import java.util.Objects;

/**
 * Class used for storing a year to year time period associated with the name-census database.
 * @author Chris Dowd
 */
public class Period {

    /**
     * Default Constructor. Creates a period with the default values of the minimum staring year, and the maximum
     * ending year.
     */
    public Period() {
        this.setPeriodTimeFrame(MIN_START_YEAR,MAX_END_YEAR);
    }

    /**
     * Copy constructor. Creates a period that is equivalent to the passed in Period.
     * @param period The Period to create a copy of.
     */
    public Period(Period period) {
        this.setPeriodTimeFrame(period.getStartYear(),period.getEndYear());
    }

    /**
     * Returns the start year of the period.
     * @return The starting year of the Period.
     */
    public int getStartYear() {
        return startYear;
    }

    /**
     * Returns the end year of the period
     * @return The ending year of the Period.
     */
    public int getEndYear() {
        return endYear;
    }

    /**
     * Sets the time frame of the Period from start year to end year
     * @param startYear The starting year of the period.
     * @param endYear The ending year of the period.
     * @throws IllegalArgumentException If the endYear > startYear, the startYear is > MIN_START_YEAR, or the endYear
     * is > MAX_END_YEAR.
     * @see IllegalArgumentException
     */
    public void setPeriodTimeFrame(int startYear, int endYear) {
        if((startYear <= endYear) && (startYear >= MIN_START_YEAR) && (endYear <= MAX_END_YEAR)) {
            this.startYear = startYear;
            this.endYear = endYear;
        } else {
            throw new IllegalArgumentException("The value of startYear must be <= endYear");
        }
    }

    /**
     * Returns the length of the period in years including the start year and end year.
     * @return The length of the time period in years including the start year and the end year.
     */
    public int lengthInYears() {
        int length = this.getEndYear() - this.getStartYear() + 1;

        return length;
    }

    /**
     * Indicated whether or not this Period is equivalent to the passed in Period.
     * @param obj The period to test for equivalence with this period
     * @return True if this Period is equivalent to the passed in period; otherwise, false.
     * @throws IllegalArgumentException If the passed in obj is not an instance of Name.
     * @see IllegalArgumentException
     */
    @Override
    public boolean equals(Object obj) {
        boolean ret = false;
        Period period = null;

        if(obj instanceof Period) {
            period  = (Period) obj;
        } else {
            throw new IllegalArgumentException("The passed in value of obj is not an instance of" +
                    " Period");
        }
        if(period != null
                && (this.getStartYear() == period.getStartYear())
                && (this.getEndYear() == period.getEndYear())) {
            ret = true;
        }

        return ret;
    }

    /**
     * Returns the hashcode value of this period.
     * @return the hashcode value of this period.
     */
    @Override
    public int hashCode() {
        int hash = 7;
        hash = 83 * hash + this.startYear;
        hash = 83 * hash + this.endYear;
        return hash;
    }

    private int startYear;

    private int endYear;

    private static final int MIN_START_YEAR = 1880;

    private static final int MAX_END_YEAR = 2008;
}
