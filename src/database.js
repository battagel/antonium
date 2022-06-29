export class DatabaseMgr {

    create_db(data) {
        var shouldInit = false;
        console.log("Creating db...");
        const request = indexedDB.open("AntoniumDB");
      
        request.onerror = function() {
          console.log("Problem opening Antonium Database")
        }
      
        request.onupgradeneeded = function() {
          shouldInit = true;
          console.log("Upgrade needed");
          let db = request.result;
          let objectStore = db.createObjectStore("acronyms", {keyPath: "acronym"});
          console.log("ObjectStore created");
        }
      
        // Will always run when database is opened
        request.onsuccess = function() {
          let db = request.result;
          console.log("Antonium Database opened");
          if (shouldInit) {
            DatabaseMgr.insert_records(data);
          }
        }
      }

      static insert_records(data) {
          const connection = indexedDB.open("AntoniumDB");
          connection.onsuccess = function() {
            let db = connection.result;
            // what tables should transaction be associated with (can be multiple tables)
            const insert_transaction = db.transaction("acronyms", "readwrite");
            // specify specific table we want to do transaction on
            const objectStore = insert_transaction.objectStore("acronyms");
        
            insert_transaction.oncomplete = function () {
              console.log("All INSERT transactions successfully completed");
            };
        
            insert_transaction.onerror = function() {
              console.log("Problem with INSERT transactions");
            };
            console.log(data);
            data.forEach(function(record) {
              let request = objectStore.put(record);
        
              request.onsuccess = function() {
                console.log("Added: ", record);
              }
            });
          }
    }

    get_record(acronym) {
        console.log("Getting record");
        const connection = indexedDB.open("AntoniumDB");
        let db = connection.result;
        // what tables should transaction be associated with (can be multiple tables)
        let transaction = db.transaction("acronyms"); // read only transaction
        // specify specific table we want to do transaction on
        let acronyms = transaction.objectStore("acronyms");
    
        let request = acronyms.get(acronym);
    
        request.onsuccess = function() {
          if (request.result !== undefined) {
            console.log("Acronym: ", request.result);
            return request.result;
          } else {
            console.log("No such acronym");
          }
        }
    }
    
}
