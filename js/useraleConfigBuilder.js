$(document).ready(function () {
  $('.ui.checkbox').checkbox();
  $('#autostart-checkbox').checkbox('set checked');

  $('#script-tag-builder').on('submit', function (e) {
    e.preventDefault();

    var fields = $(this).serializeArray();

    var scriptTag = '&lt;script';

    fields.forEach(function (field) {
      if (field.value) {
        if (field.name !== 'data-autostart') {
          scriptTag += ' ' + field.name + '="' + field.value + '"';
        }
      } else if (field.name === 'src') {
        scriptTag += ' ' + field.name + '="http://draperlaboratory.github.io/useralejs/userale.min.js"';
      }
    });

    if (!$('#autostart-checkbox').checkbox('is checked')) {
      scriptTag += ' data-autostart="false"';
    }

    scriptTag += '&gt;&lt;/script&gt;';

    $('#script-builder-result').html(scriptTag);
    console.log(scriptTag);
  });
});
