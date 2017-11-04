var cont = new El('+div.container');
var h = new El('+h1.header.text-center@.container$(Element/ary Library)');
var p = new El('+p.text-center.lead@.container$(It has never been easier to create HTML elements with JavaScript!)');
new El('+p.text-center@.container$(This page has been created entirely with the Element/ary Library!<br>\(Check the source code\))');

new El('+div#ex1.example@.container');
new El('+p.example-desc@#ex1$(Creating an element with class <i>container</i> and appending it to the <i>\<\bbody\></i>)');
var code1 = new El('+code@#ex1');
code1.innerHTML += `Old-school HTML style<br>
var cont = document.createElement('div');<br>
cont.classList.add('container');<br>
document.querySelector('body')<br>
.appendChild(cont);<br>
<br>
Element/ary<br>
var cont = new El('+div.container');
`;

new El('+div#ex2.example@.container');
new El('+p.example-desc@#ex2$(Creating an element withouth retrieving it for later use)');
var code2 = new El('+code@#ex2').innerHTML = `new El('+elementTag#elementID.elementClass1.elementClass2@#parentID');`;

new El('+div#ex3.example@.container');
new El('+p.example-desc@#ex3$(Creating a form with method <i>POST</i> and appending a label and an input field of type <i>text</i>)');
var code2 = new El('+code@#ex3').innerHTML = `
new El('+form#newForm?(type,POST)');<br>
new El('+label@#newForm?(for,uname)$(Username:)');<br>
new El('+input/text:username#uname@#newForm');
`;
new El('+p.example-desc@#ex3$(This would yield the following HTML code:)');
new El('+pre@#ex3').textContent = 
`<form id="newForm" method="POST">\n  <label for="uname">Username:</label>\n  <input id="uname" name="username" type="text">\n</form>`;