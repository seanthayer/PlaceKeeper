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
templates['pinInfoForm'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"pin-infoform-container\">\r\n  <h2 class=\"pin-infoform-title\">Create New Pin</h2>\r\n  <fieldset class=\"pin-infoform-fieldset\">\r\n    <legend>Pin Details</legend>\r\n    <label for=\"pin-infoform-name\">Name:</label>\r\n    <input type=\"text\" class=\"pin-infoform-name\" name=\"name\" maxlength=\"30\" placeholder=\"Max 30 characters\"><br><br>\r\n    <label for=\"pin-infoform-description\">Description</label><br>\r\n    <textarea class=\"pin-infoform-description\" name=\"description\" rows=\"4\" cols=\"28\" maxlength=\"200\" placeholder=\"Max 200 characters\"></textarea><br>\r\n    <div class=\"pin-infoform-buttons-container\">\r\n      <button type=\"button\" name=\"cancel\">Cancel</button>\r\n      <button type=\"button\" name=\"save\">Save</button>\r\n    </div>\r\n  </fieldset>\r\n</div>\r\n";
},"useData":true});
templates['pinInfoBoxReadOnly'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"pin-infobox-readonly-container\" data-lat=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"lat") || (depth0 != null ? lookupProperty(depth0,"lat") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lat","hash":{},"data":data,"loc":{"start":{"line":1,"column":54},"end":{"line":1,"column":61}}}) : helper)))
    + "\" data-lng=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"lng") || (depth0 != null ? lookupProperty(depth0,"lng") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lng","hash":{},"data":data,"loc":{"start":{"line":1,"column":73},"end":{"line":1,"column":80}}}) : helper)))
    + "\" data-latLng=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"latLng") || (depth0 != null ? lookupProperty(depth0,"latLng") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latLng","hash":{},"data":data,"loc":{"start":{"line":1,"column":95},"end":{"line":1,"column":105}}}) : helper)))
    + "\">\r\n  <h2 class=\"pin-infobox-readonly-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":41},"end":{"line":2,"column":49}}}) : helper)))
    + "</h2>\r\n  <div class=\"pin-trash-button-container\">\r\n    <button type=\"button\" name=\"pin-trash-button\" class=\"pin-trash-button\"><i class=\"far fa-trash-alt\"></i></button>\r\n  </div>\r\n</div>\r\n";
},"useData":true});
templates['pins'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<tr class=\"modal-table-row\">\r\n    <td class=\"modal-table-checkboxes\"><input type=\"checkbox\" class=\"table-row-checkbox\"></td>\r\n    <td class=\"table-row-name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":31},"end":{"line":3,"column":39}}}) : helper)))
    + "</td>\r\n    <td class=\"table-row-latitude\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"lat") || (depth0 != null ? lookupProperty(depth0,"lat") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lat","hash":{},"data":data,"loc":{"start":{"line":4,"column":35},"end":{"line":4,"column":42}}}) : helper)))
    + "</td>\r\n    <td class=\"table-row-longitude\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"lng") || (depth0 != null ? lookupProperty(depth0,"lng") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lng","hash":{},"data":data,"loc":{"start":{"line":5,"column":36},"end":{"line":5,"column":43}}}) : helper)))
    + "</td>\r\n</tr>\r\n";
},"useData":true});
})();