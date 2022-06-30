import { openDB, DBSchema} from 'idb';
import { PageScanner } from "./pagescanner";
interface AntoniumDB extends DBSchema {
    'acronyms': {
        key: string;
        value: {
            acronym: string;
            definition: string;
            reference: string;
        }
    };
  }
async function driver() {
    console.log("Driver function")
    let db = await openDB<AntoniumDB>("AntonioDB", 1, {
        upgrade(db) {
            console.log("Upgrade needed")
            db.createObjectStore('acronyms', {
                keyPath: 'acronym',
            });
        },
      });
    console.log("DB opened")
    let data =  {
        acronym: "HPE",
        definition: "Hewlett Packard Enterprise", 
        reference: "hpe.com"
    };
    db.put('acronyms', data);
    console.log("getting value");
    const value = await db.get('acronyms', 'HPE');
    console.log("#############")
    console.log(value);
    console.log("#############")
    var page_scanner = new PageScanner(db);
    page_scanner.scan();
}
driver()