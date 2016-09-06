var Autocomplete = Backbone.View.extend({
  initialize: function(options) {
    this.options.choices.bind('reset', this.reset, this);
  },
  reset: function(models) {
    var choices = this.options.choices,
        selected = this.options.selected,
        iterator = this.options.iterator,
        label = this.options.label,
        allowDupes = this.options.allowDupes,
        $el = $(this.el);
    $el.autocomplete({
      source: function(request, response) {
        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
        response(choices.filter(function(model) {
          return iterator(model, matcher);
        }));
      },
      focus: function(event, ui) {
        $el.val(label(ui.item));
        return false;
      },
      select: function(event, ui) {
        selected.add(ui.item);
        if (!allowDupes) {
          choices.remove(ui.item);
        }
        $el.val('');
        return false;
      }
    }).data('autocomplete')._renderItem = function(ul, item) {
      return $('<li/>')
        .data('item.autocomplete', item)
        .append($('<a/>').text(label(item)))
        .appendTo(ul);
    };
  }
});
