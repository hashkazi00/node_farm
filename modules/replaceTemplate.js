module.exports = (card, data) => { //a reusable function that can be used for all our pages, note that if the regex fails to match we just skip

    let output = card; //Good functional programming practice to not directly change recd. data.

    //replace the placeholder(s) in the file one by one.
    output = output.replace(/{%PRODUCTNAME%}/g, data.productName);
    output = output.replace(/{%IMAGE%}/g, data.image);
    output = output.replace(/{%QUANTITY%}/g, data.quantity);
    output = output.replace(/{%PRICE%}/g, data.price);
    output = output.replace(/{%ID%}/g, data.id);
    output = output.replace(/{%DESCRIPTION%}/g, data.description);
    output = output.replace(/{%NUTRIENTS%}/g, data.nutrients);
    output = output.replace(/{%FROM%}/g, data.from);
    output = output.replace(/{%SLUG%}/g, data.slug);


    //handling special condition usng an if conditional statement
    if (!data.organic) output = output.replace(/{%NOTORGANIC%}/g, 'not-organic');
    return output;
}