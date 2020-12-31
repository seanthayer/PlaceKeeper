(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['savedPlaceEntry'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"saved-place-entry\" name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":37},"end":{"line":1,"column":45}}}) : helper)))
    + "\" data-latLng=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"latLng") || (depth0 != null ? lookupProperty(depth0,"latLng") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latLng","hash":{},"data":data,"loc":{"start":{"line":1,"column":60},"end":{"line":1,"column":70}}}) : helper)))
    + "\">\n\n  <h5 class=\"saved-place-entry-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":38},"end":{"line":3,"column":46}}}) : helper)))
    + "</h5>\n  <button type=\"button\" name=\"saved-place-entry-latLng\" class=\"saved-place-entry-latLng\">("
    + alias4(((helper = (helper = lookupProperty(helpers,"lat") || (depth0 != null ? lookupProperty(depth0,"lat") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lat","hash":{},"data":data,"loc":{"start":{"line":4,"column":90},"end":{"line":4,"column":97}}}) : helper)))
    + ", "
    + alias4(((helper = (helper = lookupProperty(helpers,"lng") || (depth0 != null ? lookupProperty(depth0,"lng") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lng","hash":{},"data":data,"loc":{"start":{"line":4,"column":99},"end":{"line":4,"column":106}}}) : helper)))
    + ")</button>\n\n  <div class=\"trash-button-container\">\n    <button type=\"button\" name=\"trash-button\" class=\"trash-button\"><i class=\"far fa-trash-alt\"></i></button>\n  </div>\n\n</div>\n";
},"useData":true});
templates['pinInfoForm'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"pin-infoform-container\">\n\n  <h2 class=\"pin-infoform-title\">Create New Pin</h2>\n\n  <fieldset class=\"pin-infoform-fieldset\">\n\n    <legend>Pin Details</legend>\n\n    <label for=\"pin-infoform-name\">Name:</label>\n    <input type=\"text\" class=\"pin-infoform-name\" name=\"name\" maxlength=\"30\" placeholder=\"Max 30 characters\"><br><br>\n\n    <label for=\"pin-infoform-description\">Description</label><br>\n    <textarea class=\"pin-infoform-description\" name=\"description\" rows=\"4\" cols=\"28\" maxlength=\"200\" placeholder=\"Max 200 characters\"></textarea><br>\n\n    <div class=\"pin-infoform-buttons-container\">\n      <button type=\"button\" name=\"cancel\">Cancel</button>\n      <button type=\"button\" name=\"save\">Save</button>\n    </div>\n\n  </fieldset>\n\n</div>\n";
},"useData":true});
templates['pinInfoBoxReadOnly'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n    <div class=\"pin-infobox-readonly-description\">\n      <p>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data,"loc":{"start":{"line":8,"column":9},"end":{"line":8,"column":24}}}) : helper)))
    + "</p>\n    </div>\n\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"pin-infobox-readonly-container\" data-latLng=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"latLng") || (depth0 != null ? lookupProperty(depth0,"latLng") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latLng","hash":{},"data":data,"loc":{"start":{"line":1,"column":57},"end":{"line":1,"column":67}}}) : helper)))
    + "\">\n\n  <h2 class=\"pin-infobox-readonly-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":3,"column":41},"end":{"line":3,"column":49}}}) : helper)))
    + "</h2>\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"description") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":2},"end":{"line":11,"column":9}}})) != null ? stack1 : "")
    + "\n  <div class=\"trash-button-container\">\n    <button type=\"button\" name=\"trash-button\" class=\"trash-button\"><i class=\"far fa-trash-alt\"></i></button>\n  </div>\n\n</div>\n";
},"useData":true});
templates['pinTableRow'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-description=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"description","hash":{},"data":data,"loc":{"start":{"line":1,"column":88},"end":{"line":1,"column":103}}}) : helper)))
    + "\" ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<tr class=\"modal-table-row\" data-name=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":39},"end":{"line":1,"column":47}}}) : helper)))
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"description") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":49},"end":{"line":1,"column":112}}})) != null ? stack1 : "")
    + " data-lat=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"lat") || (depth0 != null ? lookupProperty(depth0,"lat") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lat","hash":{},"data":data,"loc":{"start":{"line":1,"column":123},"end":{"line":1,"column":130}}}) : helper)))
    + "\" data-lng=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"lng") || (depth0 != null ? lookupProperty(depth0,"lng") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lng","hash":{},"data":data,"loc":{"start":{"line":1,"column":142},"end":{"line":1,"column":149}}}) : helper)))
    + "\">\n\n    <td class=\"modal-table-checkboxes\"><input type=\"checkbox\" class=\"table-row-checkbox\"></td>\n    <td class=\"table-row-name\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":4,"column":31},"end":{"line":4,"column":39}}}) : helper)))
    + "</td>\n    <td class=\"table-row-latitude\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"lat") || (depth0 != null ? lookupProperty(depth0,"lat") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lat","hash":{},"data":data,"loc":{"start":{"line":5,"column":35},"end":{"line":5,"column":42}}}) : helper)))
    + "</td>\n    <td class=\"table-row-longitude\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"lng") || (depth0 != null ? lookupProperty(depth0,"lng") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lng","hash":{},"data":data,"loc":{"start":{"line":6,"column":36},"end":{"line":6,"column":43}}}) : helper)))
    + "</td>\n\n</tr>\n";
},"useData":true});
})();