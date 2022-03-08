package com.example.sasha.finalsoftware.model.util;

import com.example.sasha.finalsoftware.model.Name;
import org.w3c.dom.NameList;

import java.util.ArrayList;

/**
 * This class provides utility methods for making statistics calculations involving the names census database.
 * @author Chris Dowd
 */
public class CensusStatisticsCalculator {

    /**
     * Constructs a new CensusStatisticsCalculator
     */
    public CensusStatisticsCalculator() { }

    /**
     * Calculates the average popularity for a name String within an ArrayList of Names
     * @param nameList A list of Names containing the name to calculate the average popularity for.
     * @param name The name String to calculate the average for.
     * @return The average popularity of the name String within a list of Names. *Note* - If the name String is not
     * found within the NameList this method will return 0.
     */
    public static double calculateAveragePopularity(ArrayList<Name> nameList, String name) {
        int nameCount = 0;
        double popularitySum = 0;
        double averagePopularity = 0;

        for(Name curName : nameList) {
            if(curName.getName().equals(name)) {
                nameCount++;
                popularitySum += curName.getPopularity();
            }
        }
        if (nameCount > 0) {
            averagePopularity = popularitySum / nameCount;
        }

        return averagePopularity;
    }
}
