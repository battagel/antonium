let data = [{
  "acronym": "HPE",
  "definition": "Hewlett Packard Enterprise",
  "reference": "hpe.com"
},
{
  "acronym": "DSCC",
  "definition": "Data Services Cloud Console",
  "reference": "hpe.com/dscc"
}];

let db: any = null;


function create_db() {
  var shouldInit = false;
  console.log("Creating db...");
  const request = indexedDB.open("AntoniumDB");

  request.onerror = function(event: any) {
    console.log("Problem opening Antonium Database")
  }

  request.onupgradeneeded = function(event: any) {
    shouldInit = true;
    console.log("Upgrade needed");
    db = request.result;
    let objectStore = db.createObjectStore("acronyms", {keyPath: "acronym"});
    console.log("ObjectStore created");
  }

  // Will always run when database is opened
  request.onsuccess = function(event: any) {
    db = request.result;
    console.log("Antonium Database opened");
    if (shouldInit) {
      insert_records(data);
    }
  }
}

function delete_db() {
  const request = indexedDB.deleteDatabase('AntoniumDB')

  request.onsuccess = function(event: any) {
    console.log("Antonium Database deleted");
    db.onerror = function(event: any) {
      console.log("Error deleting database");
    }
  }
}

async function insert_records(data: any) {
  if (db) {
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

    data.forEach(function(record: any) {
      let request = objectStore.put(record);

      request.onsuccess = function() {
        console.log("Added: ", record);
      }
    });
  }
}

function get_record(acronym: any) {
  console.log("Getting record");
  if (db) {
    // what tables should transaction be associated with (can be multiple tables)
    let transaction: any = db.transaction("acronyms"); // read only transaction
    // specify specific table we want to do transaction on
    let acronyms: any = transaction.objectStore("acronyms");

    let request: any = acronyms.get(acronym);

    request.onsuccess = function() {
      if (request.result !== undefined) {
        console.log("Acronym: ", request.result);
      } else {
        console.log("No such acronym");
      }
    }
  }
}

create_db();
