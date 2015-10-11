'use strict';

exports.DropdownMenu = function(type) {
  function _getInputNodes(name, val) {
    return '<option value=' + val + '>' + name + '</option>';
  }

  var elm = '<select id="' + type + '-dropdown" ' +' name="' + type + '">';

  this[type].forEach(function(i) {
    var name = i.info.title;
    name = (type === 'people') ? i.info.name : name;
    elm += _getInputNodes(name, i._id);
  });

  elm += "</select>";

  return elm;
};
