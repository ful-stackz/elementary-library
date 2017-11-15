var El = function(query, toAppend) {
    /* @this.model 
     * will contain the model object,
     * from which an HTML element
     * will be built
    !*/
    this.model;
    /* @this.element
     * will contain the actual HTML element
     * once it is assembled
    !*/
    this.element;
    /* @this.query
     * holds the right
     * query string
    !*/
    this.query = query;
    /* @this.toAppend
     * determines whether to
     * append the element [true]
     * or just return the 
     * assembled element [false]
    !*/
    this.toAppend = toAppend === undefined ? true : toAppend;
    /* @this.DOMLoaded
     * determines whether the <body>
     * of the El has been loaded
     * can be true OR false
    !*/
    this.DOMLoaded = (document.querySelector('body') === null) ? false : true;

    /* If query is actually a queued
     * element get it's model, element
     * and actual query
    !*/
    if (query.queued && query.queued === true) {
        this.model = query.model;
        this.element = query.element;
        this.query = query.query;
    }

    /* If the model is empty
     * then build a model from query
    !*/
    if (this.model === undefined)
        this.model = this.createModel(this.query);

    /* If the element is empty
     * assemble an element from
     * the model object
    !*/
    if (this.element === undefined)
        this.element = this.assembleElement(this.model)

    /* If El is not yet loaded
     * create a new object and
     * append it to El_Query
     * to be appended when the
     * El is loaded
    !*/
    if (this.DOMLoaded == false && this.toAppend)
        El_Queue.push({ 
            queued: true,
            model: this.model,
            element: this.element,
            query: this.query
        });

    /* If the model is set AND
     * the element is an HTML element
     * try to set the parent
    !*/
    if (typeof(this.model) === 'object' 
        && this.element.ownerDocument
        && this.DOMLoaded)
        this.model.parent = this.getParent(this.query);

    /* If the parent is set
     * attempt to append the HTML element
     * to the given parent
    !*/
    if (this.model.parent
        && this.DOMLoaded
        && this.toAppend)
        this.append(this.element, this.model);

    // Return the HTML element
    return this.element;
}

El.prototype.createModel = function(query) {
    var model = {};

    /* Get the element tag
     * RegExp looks for
     * /\+\w+/g => +tagName
    !*/
    model.tag = query.match(/\+\w+/g);
    if (model.tag) 
        model.tag = model.tag[0].substr(1);
    
    /* Get element ID
     * RegExp looks for
     * /((?!@).)#\w+/g => 
     * (?!@). = any character that is NOT @
     * # = literal match
     * \w+ = any word
     * => a#actualID
     * Then cut the first two characters
    !*/
    model.id = query.match(/((?!@).)#\w+/g);
    if (model.id) 
        model.id = model.id[0].substr(2);
        
    /* Get the element name
     * RegExp looks for
     * /:\w+/g =>
     * : = literal match
     * \w+ = any word
     * => :nameAttribute
     * Then cut the :
    !*/
    model.name = query.match(/:\w+/g);
    if (model.name) 
        model.name = model.name[0].substr(1);

    /* Get element class(es)
     * RegExp looks for
     * /.?\.(\w+|\-)+/g =>
     * .? = match zero or one character before the . (dot)
     * \. = literal match . (dot)
     * (\w+|\-)+ = match words or - multiple times
     * => d.className.classNameTwo
    !*/
    model.classList = query.match(/.?\.(\w+|\-)+/g);
    if (model.classList) {
        /* Iterate the array backwards
         * and if an element starts with @
         * remove that element, because
         * this is the parent selector
        !*/
        for (let i = model.classList.length - 1; i >= 0; i--) {
           let c = model.classList[i];
            if (c.indexOf('@') != -1)
                model.classList.splice(i, 1);
            else
                model.classList[i] = c.slice(c.indexOf('.'), c.length);
        }
    }
        
    /* Get custom attributes and values
     * RegExp looks for
     * /\?\(\w+,.+\)/g =>
     * \? = letaral match ?
     * \( = literal match (
     * \w+ = match any word
     * , = literal match ,
     * (\w+|\s|\.|\-) = match any letter, number, -, .
     * \) = literal match )
     * => ?(attribute,value with any characters)
     * Then prepare the custom attributes with
     * @prepareCustomAttributes()
    !*/
    model.customAttributes = query.match(/\?\(\w+,(\w+|\s|\.|\-)\)/g);
    if (model.customAttributes)
        this.prepareCustomAttributes(model);

    /* Get value attribute
     * RegExp looks for
     * /\$\((\w+|\s)+\)/g =>
     * \$ = literal match $
     * \( = literal match (
     * .+ = match any character multiple times
     * \) = literal match )
     * => $(value with spaces or without)
    !*/
    let value = query.match(/\$\(.+\)/g);

    /* If tag is <input> or <button>
     * it has additional attributes
     * type, value and/or placeholder
     * Get these attributes
    !*/
    if (model.tag == 'input' || model.tag == 'button') {
        /* Get type attribute
         * RegExp looks for
         * /\/\w+/g =>
         * \/ = literal match /
         * \w+ = match any word
         * => /type
        !*/
        model.type = query.match(/\/\w+/g);
        model.value = value;
        /* Get placeholder attribute
         * RegExp looks for
         * /\%\(.+\)/g
         * \% = literal match %
         * \( = literal match (
         * .+ = match any character multiple times
         * \) = literal match )
         * => %(placeholder value)
        !*/
        model.placeholder = query.match(/\%\(.+\)/g);
    } 
    /* Else the element is not <input> or <button>
     * such an element holds its value in the
     * innerText attribute
    !*/
    else {
        model.innerText = value;
    }

    /* If type attribute is specified
     * /type => type
    !*/
    if (model.type)
        model.type = model.type[0].substr(1);
    /* If value attribute is specified
     * $(value) => value
    !*/
    if (model.value)
        model.value = model.value[0].slice(2, model.value[0].length - 1);
    /* If placeholder attribute is specified
     * %(placeholder) => placeholder
    !*/
    if (model.placeholder)
        model.placeholder = model.placeholder[0].slice(2, model.placeholder[0].length - 1);
    /* If innerText is specified
     * $(innerText) => innerText
    !*/
    if (model.innerText)
        model.innerText = model.innerText[0].slice(2, model.innerText[0].length - 1);

    // Return the created model
    return model;
}

El.prototype.prepareCustomAttributes = function(model) {
    /* Take a model object as argument
     * iterate it's customAttributes
     * customAttribute looks like:
     * ?(attribute,value)
     * Slice the attribute, it looks:
     * attribute,value
    !*/
    model.customAttributes.forEach((p, i, m) => m[i] = p.slice(2, p.length - 1));
}

El.prototype.assembleElement = function(model) {
    var element;

    // Create element from tag
    element = document.createElement(model.tag);
    // If ID is given, set it
    if (model.id) 
        element.setAttribute('id', model.id);
    // If type is given set it
    if (model.type)
        element.setAttribute('type', model.type);
    if (model.value)
        element.setAttribute('value', model.value);
    if (model.placeholder)
        element.setAttribute('placeholder', model.placeholder);
    // If name is given set it
    if (model.name)
        element.setAttribute('name', model.name);
    // If only one class is given set it
    if (model.classList && model.classList.length == 1)
        element.classList.add(model.classList[0].substr(1));
    if (model.classList && model.classList.length > 1)
        model.classList.forEach(c => element.classList.add(c.substr(1)));
    // If custom attributes are given set them
    if (model.customAttributes)
        model.customAttributes.forEach(a => 
            element.setAttribute(a.slice(0, a.indexOf(',')), a.slice(a.indexOf(',') + 1)));
    // If innerText is given set it
    if (model.innerText)
        element.innerText = model.innerText;

    // Return the HTML element
    return element;
}

El.prototype.getParent = function(query) {
    let parent;
    /* Get parent element
     * RegExp looks for
     * /@(#|\.|\w)\w+/g =>
     * @ = literal match @
     * (#|\.|\w) = match #, dot or any letter
     * \w+ = match any word
     * => @#anotherElemWithID
     * => @.anotherElemWithClass
     * => @body
    !*/
    parent = query.match(/@(#|\.|\w)(\w+|\-)+/g);
    /* If a parent is specified
     * convert 
     * @#parent => #parent
    !*/
    if (parent)
        parent = parent[0].substr(1);
    /* Else if no parent is specified
     * set the parent to the <body>
    !*/
    else
        parent = 'body';

    // Return the parent
    return parent;
}

El.prototype.append = function(element, model) {
    try {
        document.querySelector(model.parent)
        .appendChild(element);
    } catch(ex) {
        //console.log(ex);
    }
}

var El_Queue = [];

window.addEventListener('load', function() {
    El_Queue.forEach(e => new El(e));
});
