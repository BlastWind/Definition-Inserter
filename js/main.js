window.addEventListener("message", (e) => {
  console.log(e);
});

document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection();
  const hit_elem = document.elementFromPoint(event.clientX, event.clientY);

  if (!hit_elem) {
    return;
  }

  if (/INPUT|TEXTAREA/.test(hit_elem.nodeName) || hit_elem.isContentEditable) {
    return;
  }

  word = selection.toString().trim();
  if (word != "") {
    var oRange = selection.getRangeAt(0);

    var boxHTML = `<div style="position: absolute; top:${event.pageY}px; left:${event.pageX}px; z-index: 2147;">Box Yo!</div>`;
    var box = htmlToElement(boxHTML);
    document.body.appendChild(box);
  }

  /*
  const selection = window.getSelection().toString().trim();
  if (selection.length) {
    console.log("Got selection: " + selection);
    //var oRange = selection.getRangeAt(0);
    //var oRect = oRange.getBoundingClientRect();

    var boxHTML =
      '<div style="position: absolute; transform:translate(100px, 100px)">Fucking Box Yo!</div>';

    var box = htmlToElement(boxHTML);
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.opacity = 0;
    document.body.appendChild(input);

    
  } */
});

function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}
