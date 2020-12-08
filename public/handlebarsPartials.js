(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['savedPlaceEntry'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<ul class=\"saved-place-entry\" name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":36},"end":{"line":1,"column":44}}}) : helper)))
    + "\" data-lat=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"lat") || (depth0 != null ? lookupProperty(depth0,"lat") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lat","hash":{},"data":data,"loc":{"start":{"line":1,"column":56},"end":{"line":1,"column":63}}}) : helper)))
    + "\" data-lng=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"lng") || (depth0 != null ? lookupProperty(depth0,"lng") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lng","hash":{},"data":data,"loc":{"start":{"line":1,"column":75},"end":{"line":1,"column":82}}}) : helper)))
    + "\">\r\n  <li>Place: "
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":21}}}) : helper)))
    + "</li>\r\n  <li>Lat: "
    + alias4(((helper = (helper = lookupProperty(helpers,"lat") || (depth0 != null ? lookupProperty(depth0,"lat") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lat","hash":{},"data":data,"loc":{"start":{"line":3,"column":11},"end":{"line":3,"column":18}}}) : helper)))
    + "</li>\r\n  <li>Lng: "
    + alias4(((helper = (helper = lookupProperty(helpers,"lng") || (depth0 != null ? lookupProperty(depth0,"lng") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lng","hash":{},"data":data,"loc":{"start":{"line":4,"column":11},"end":{"line":4,"column":18}}}) : helper)))
    + "</li>\r\n</ul>\r\n";
},"useData":true});
templates['pinInfoBox'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"pin-infobox-container\">\r\n  <h2 class=\"pin-infobox-title\">Create New Pin</h2>\r\n  <fieldset class=\"pin-infobox-fieldset\">\r\n    <legend>Pin Details</legend>\r\n    <label for=\"pin-infobox-name\">Name:</label>\r\n    <input type=\"text\" id=\"pin-infobox-name\" name=\"name\" maxlength=\"30\" placeholder=\"Max 30 characters\"><br><br>\r\n    <label for=\"pin-infobox-description\">Description</label><br>\r\n    <textarea id=\"pin-infobox-description\" name=\"description\" rows=\"4\" cols=\"28\" maxlength=\"200\" placeholder=\"Max 200 characters\"></textarea><br>\r\n    <div class=\"pin-infobox-buttons-container\">\r\n      <button type=\"button\" name=\"cancel\">Cancel</button>\r\n      <button type=\"button\" name=\"save\">Save</button>\r\n    </div>\r\n  </fieldset>\r\n</div>\r\n";
},"useData":true});
templates['pinInfoBoxReadOnly'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"pin-infobox-readonly-container\">\r\n  <h2 class=\"pin-infobox-readonly-title\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":41},"end":{"line":2,"column":49}}}) : helper)))
    + "</h2>\r\n</div>\r\n";
},"useData":true});
})();