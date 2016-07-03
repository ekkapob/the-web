$(function(){
  var $contactCountry = $('#contact-country');
  initCountryOptions();
  // initStateOptions($contactCountry.val());

  $contactCountry.change(function(){
    // initStateOptions($contactCountry.val());
    // $contactCountry.val(
    //   $contactCountry.find('option:selected').text()
    // );
  });
});

function initCountryOptions() {
  var $countrySelect = $('#contact-country');
  var options = [];
  for (key in countryList) {
    var value = countryList[key];
    var store = $countrySelect.data('store');
    var preselect = (!store) ? 'Thailand' : store;
    var selected = (value == preselect) ? 'selected' : '';

    options.push('<option value="' + value + '" '+ selected + '>'
                 + value + '</option>');
  }
  $countrySelect.append(options.join());
}

function initStateOptions(country) {
  var options = [];
  if (!stateOptionsCache[country]) {
    for (key in stateList[country]) {
      states = stateList[country][key];
      var selected = (states.name == 'Bangkok') ? 'selected' : '';
      options.push('<option value="' + states.name + '" '+ selected + '>'
                  + states.name + '</option>');
    }
    stateOptionsCache[country] = options.join();
  }
  var $contactCity = $('#contact-city');
  $contactCity.empty();
  if (!stateOptionsCache[country]) return $contactCity.prop('disabled', true);
  $contactCity.append(stateOptionsCache[country]);
}

var stateOptionsCache = {};
