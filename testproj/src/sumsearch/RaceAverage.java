public class RaceAverage {

    //Returns average number of minutes from list of times...
    public static double avgMinutes(String[] times) {
        double mins = 0;
        for (int i = 0; i < times.length; i++) {
            // Would want to redo this with python regex
            String[] time = times[i].replace(":", " ").replace("M, DAY ", " ")
                    .split(" ");
            mins += (Integer.parseInt(time[3]) - 1) * 1440;

            int hours = Integer.parseInt(time[0]);
            if(time[2].contains("P")){
                hours += 12;
            }
            
            mins += (hours - 8) * 60;
            mins += Integer.parseInt(time[1]);

        }
        return (mins / times.length);
    }
}
