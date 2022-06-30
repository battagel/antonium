export class PageScanner {
  db: any;

  constructor(db:any) {
    this.db = db;
  }

  scan() {
    const text_elements = document
      .getElementById("content")!
      .querySelectorAll("p, h1, h2, h3, h4");

    // you can add more in the query using a comma e.g. "p, span"

    for (var i = 0; i < text_elements.length; i++) {
      this.update_paragraph(text_elements[i]);
    }
  }

  async update_paragraph(para_obj: any) {
    // For searching and replacing of words in the paragraph
    var paragraph: string = para_obj.innerHTML;
    const word_pattern = /[a-zA-Z0-9]/;
    var on_tag: boolean = false;
    var on_word: boolean = false;
    var start_word: number = 0;
    var end_word: number = 0;
    const len: number = paragraph.length;

    for (var ptr: number = len - 1; ptr >= 0; ptr--) {
      let char = paragraph[ptr];

      if (char === ">") {
        // found beginning of a tag
        on_tag = true;
        if (on_word) {
          // beginning of tag is the end of a word
          paragraph = await this.process_word(ptr + 1, end_word, paragraph);
          on_word = false;
        }
        continue;
      }
      if (char == "<" && on_tag) {
        // found end of tag
        on_tag = false;
        continue;
      }
      if (!on_tag) {
        // not in a tag so must be raw text
        if (word_pattern.test(char)) {
          // found a letter
          if (!on_word) {
            // starting word
            on_word = true;
            end_word = ptr;
          } else {
            // middle of word
          }
        } else {
          // found a deliminator
          if (on_word) {
            // found a word!
            // process word
            paragraph = await this.process_word(ptr + 1, end_word, paragraph);
            on_word = false;
          }
        }
      }
    }
    if (on_word == true) {
      on_word = false;
      paragraph = await this.process_word(ptr + 1, end_word, paragraph);
    }
    para_obj.innerHTML = paragraph;
  }

  async process_word(
    word_start: number,
    word_end: number,
    para_text: string
  ) {
    // Look into instead of returning, use by reference to edit para_text
    var word = para_text.substring(word_start, word_end + 1);

    // Query word
    var new_word = await this.query_word(word);
    console.log("Word returned: ", new_word)
    // Change word in para
    para_text =
      para_text.slice(0, word_start) + new_word + para_text.slice(word_end + 1);
    //console.log(para_text);
    return para_text;
  }

  async query_word(word: string) {
    // Query the DB for the word
    let query = await this.query_db(word);
    console.log("query:");
    console.log(query);
    // if the word exists compile a abbr tag
    if (query) {
      const abbr_tag: string =
        "<abbr title='" +
        query.definition +
        "&#13; &#13;" +
        query.reference +
        "'>" +
        query.acronym +
        "</Tooltip>";
      return abbr_tag;
    } else {
      console.log("No result found: ", word)
      return word;
    }
    // if it doesnt exist then just return the word
  }

  async query_db(word: string): Promise<any> {
    return this.db.get('acronyms', word);
  }

  tooltip() {}
}
