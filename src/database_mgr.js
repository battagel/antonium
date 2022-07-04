import Dexie from "dexie";

export class DatabaseMgr {
  constructor() {
    this.db = new Dexie("AntoniumDatabase");
  }

  create_db() {
    this.db.version(1).stores({
      data_table: "acronym",
    });
    console.log("Created DB Schema");
  }

  get(key, value) {
    //console.log("Performing GET for word " + value);
    return this.db.data_table.where(key).equals(value).first();
  }

  async bulk_insert_of_confluence(data) {
    // Now add some values.
    console.log("Bulk inserting data");
    console.log(data);
    this.db.data_table.bulkPut(data).catch((err) => {
      console.log("Error with populating DB " + err);
    });
  }
}
