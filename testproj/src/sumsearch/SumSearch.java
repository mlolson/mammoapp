package sumsearch;
import java.util.*;
import java.util.Iterator;
import java.util.List;
import java.util.ArrayList;

public class SumSearch {

    // Returns first two positive integers in array that
    // sum to 10. If they do not exist,
    // returns [-1,-1].
    public static int[] returnSumPair(int[] array) {
        ArrayList<Integer> indices = new ArrayList<Integer>();

        for (int i = 0; i < array.length; i++) {
            if (array[i] > 0 && array[i] < 10) {
                boolean add = true;
                
                for (Integer ind : indices) {
                    if ((array[ind] + array[i]) == 10) {
                        return (new int[] { ind, i });
                    } else if (array[ind] == array[i]) {
                        add = false;
                    }
                }
                if (add) {
                    indices.add(i);
                }
            }
        }
        return (new int[] { -1, -1 });
    }
}
