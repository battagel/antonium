(function () {
  function handleTextNode(textNode: any) {
    if (
      textNode.nodeName !== "#text" ||
      textNode.parentNode.nodeName === "SCRIPT" ||
      textNode.parentNode.nodeName === "STYLE"
    ) {
      //Don't do anything except on text nodes, which are not children
      //  of <script> or <style>.
      return;
    }
    let origText = textNode.textContent;
    let newHtml = origText.replace(/(^|\s)(\S+)(?=\s|$)/gm, "$1Hello");
    //Only change the DOM if we actually made a replacement in the text.
    //Compare the strings, as it should be faster than a second RegExp operation and
    //  lets us use the RegExp in only one place for maintainability.
    if (newHtml !== origText) {
      let newSpan = document.createElement("span");
      newSpan.innerHTML = newHtml;
      textNode.parentNode.replaceChild(newSpan, textNode);
    }
  }

  //Find all text node descendants of <p> elements:
  let allP = document.querySelectorAll("p"); // Get all <p>
  let textNodes = [];
  for (let p of allP) {
    //Create a NodeIterator to get the text nodes descendants of each <p>
    let nodeIter = document.createNodeIterator(p, NodeFilter.SHOW_TEXT);
    let currentNode;
    //Add text nodes found to list of text nodes to process below.
    while ((currentNode = nodeIter.nextNode())) {
      textNodes.push(currentNode);
    }
  }
  //Process each text node
  textNodes.forEach(function (el) {
    handleTextNode(el);
  });
})();
