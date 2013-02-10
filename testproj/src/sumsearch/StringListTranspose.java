public class StringListTranspose {

    // Problem 1 solution: Accepts an array of
    // input strings and performs a tranpose.
    public static String[] transform(String[] text) {
        char[][] inputMat = new char[text.length][];

        for (int i = 0; i < text.length; i++) {
            inputMat[i] = text[i].toCharArray();
        }
        int len = inputMat[0].length;
        String[] outputMat = new String[len];

        for (int i = 0; i < len; i++) {
            String s = "";
            for (int j = 0; j < text.length; j++) {
                s += inputMat[j][i];
            }
            outputMat[i] = s;
        }
        return outputMat;
    }
}
