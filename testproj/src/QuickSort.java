public class QuickSort  {
  private int[] numbers;
  private int number;

  public int[] sort(int[] values) {
    // Check for empty or null array
    if (values ==null || values.length==0){
      return null;
    }
    this.numbers = values;
    this.number = values.length;
    quicksort(0, this.number - 1);
    return this.numbers;
  }

  private void quicksort(int low, int high) {
    int i = low, j = high;
    // Get the pivot element from the middle of the list
    int pivot = this.numbers[low + (high-low)/2];

    // Divide into two lists
    while (i <= j) {
      // If the current value from the left list is smaller then the pivot
      // element then get the next element from the left list
      while (this.numbers[i] < pivot) {
        i++;
      }
      // If the current value from the right list is larger then the pivot
      // element then get the next element from the right list
      while (this.numbers[j] > pivot) {
        j--;
      }

      // If we have found a values in the left list which is larger then
      // the pivot element and if we have found a value in the right list
      // which is smaller then the pivot element then we exchange the
      // values.
      // As we are done we can increase i and j
      if (i <= j) {
        exchange(i, j);
        i++;
        j--;
      }
    }
    // Recursion
    if (low < j)
      quicksort(low, j);
    if (i < high)
      quicksort(i, high);
  }

  private void exchange(int i, int j) {
    int temp = this.numbers[i];
    this.numbers[i] = this.numbers[j];
    this.numbers[j] = temp;
  }
  public static void main(String[] args){
      int[] list = {1, 19, 5, 11, 3, 0, 1};
      QuickSort qs = new QuickSort();
      int[] result = qs.sort(list); 
      for(int i=0;i<result.length;i++){
          System.out.println(result[i]);
      }
      
      
  }
} 