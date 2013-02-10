package hashtab;

public class HashTableExample {

    private class Entry{
        
        private String key;
        private String value;
        private Entry next;
        
        public Entry(String key, String value){
            this.key = key;
            this.value = value;
            this.next = null;
        }
        public String getKey(){
            return this.key;
        }
        public String getValue(){
            return this.value;
        }
        public Entry getNext(){
            return this.next;
        }
        public void setNext(Entry ent){
            this.next = ent;
        }
        
    }
    
    private Entry[] entries; 
    private int Nbuckets;
    
    public HashTableExample(int nentries, double loadfactor){
        this.Nbuckets = (int)(nentries / loadfactor);
        this.entries = new Entry[this.Nbuckets];
    }
    private int hashCode(String key){
        int hashVal = 0;
        for(int i=0;i<key.length();i++){
            hashVal += (127*hashVal +key.charAt(i))%16908799;
        }
        return hashVal % this.Nbuckets;
    }
    public Entry insert(String key, String value){
        int ind = this.hashCode(key);
        Entry thisent = this.entries[ind];
        Entry newEnt = new Entry(key, value);
        if(thisent==null){
            //thisent = newEnt;
            this.entries[ind] = newEnt;
            return newEnt;
        }
        while(thisent.getNext()!=null){
            thisent = thisent.getNext();
        }
        thisent.setNext(newEnt);
        return newEnt;     
    }
    public Entry remove(String key){
        Entry thisent = this.entries[this.hashCode(key)];
        if(thisent.getKey() == key){
            Entry retent = thisent;
            thisent = thisent.getNext();
            return retent;      
        }
        while(thisent.getNext() != null){
            if(thisent.getNext().getKey()==key){
                Entry retent = thisent.getNext();
                thisent.setNext(thisent.getNext().getNext());
                return retent;
            }         
            thisent = thisent.getNext();      
        }       
        return thisent;       
    }
    public Entry find(String key){
        Entry thisent = this.entries[this.hashCode(key)];
        if(thisent == null){
            return null;
        }
        if(thisent.getKey() == key){
            return thisent;      
        }
        while(thisent.getNext().getKey() != key){
            thisent = thisent.getNext();
        }
        return thisent;
    }
    
    public static void main(String[] args) {
        // TODO Auto-generated method stub
        //HashTableExample ht = new HashTableExample(1000,0.8);
        //Entry e = ht.insert("dog", "a canine");
        //e = ht.insert("cat", "a feline");
        //e = ht.insert("owl", "a bird");
        //e = ht.insert("dog", "a canine with teeth");
        
        //System.out.println(ht.find("owl").getValue());  
        int[] test = {1,2,3};
        System.out.println(test[3]);
        
    }

}
