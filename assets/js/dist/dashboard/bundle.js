$(function(){
  var $contactCountry = $('#contact-country');

  (function initCountryOptions() {
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
  })();

});

var countryList = {
  'AF': 'Afghanistan',
  'AL': 'Albania',
  'DZ': 'Algeria',
  'AS': 'American Samoa',
  'AD': 'Andorra',
  'AO': 'Angola',
  'AI': 'Anguilla',
  'AQ': 'Antarctica',
  'AG': 'Antigua and Barbuda',
  'AR': 'Argentina',
  'AM': 'Armenia',
  'AW': 'Aruba',
  'AU': 'Australia',
  'AT': 'Austria',
  'AZ': 'Azerbaijan',
  'BH': 'Bahrain',
  'BD': 'Bangladesh',
  'BB': 'Barbados',
  'BY': 'Belarus',
  'BE': 'Belgium',
  'BZ': 'Belize',
  'BJ': 'Benin',
  'BM': 'Bermuda',
  'BT': 'Bhutan',
  'BO': 'Bolivia',
  'BA': 'Bosnia and Herzegovina',
  'BW': 'Botswana',
  'BV': 'Bouvet Island',
  'BR': 'Brazil',
  'IO': 'British Indian Ocean Territory',
  'VG': 'British Virgin Islands',
  'BN': 'Brunei',
  'BG': 'Bulgaria',
  'BF': 'Burkina Faso',
  'BI': 'Burundi',
  'CI': 'Côte d\'Ivoire',
  'KH': 'Cambodia',
  'CM': 'Cameroon',
  'CA': 'Canada',
  'CV': 'Cape Verde',
  'KY': 'Cayman Islands',
  'CF': 'Central African Republic',
  'TD': 'Chad',
  'CL': 'Chile',
  'CN': 'China',
  'CX': 'Christmas Island',
  'CC': 'Cocos (Keeling) Islands',
  'CO': 'Colombia',
  'KM': 'Comoros',
  'CG': 'Congo',
  'CK': 'Cook Islands',
  'CR': 'Costa Rica',
  'HR': 'Croatia',
  'CU': 'Cuba',
  'CY': 'Cyprus',
  'CZ': 'Czech Republic',
  'CD': 'Democratic Republic of the Congo',
  'DK': 'Denmark',
  'DJ': 'Djibouti',
  'DM': 'Dominica',
  'DO': 'Dominican Republic',
  'TP': 'East Timor',
  'EC': 'Ecuador',
  'EG': 'Egypt',
  'SV': 'El Salvador',
  'GQ': 'Equatorial Guinea',
  'ER': 'Eritrea',
  'EE': 'Estonia',
  'ET': 'Ethiopia',
  'FO': 'Faeroe Islands',
  'FK': 'Falkland Islands',
  'FJ': 'Fiji',
  'FI': 'Finland',
  'MK': 'Former Yugoslav Republic of Macedonia',
  'FR': 'France',
  'FX': 'France, Metropolitan',
  'GF': 'French Guiana',
  'PF': 'French Polynesia',
  'TF': 'French Southern Territories',
  'GA': 'Gabon',
  'GE': 'Georgia',
  'DE': 'Germany',
  'GH': 'Ghana',
  'GI': 'Gibraltar',
  'GR': 'Greece',
  'GL': 'Greenland',
  'GD': 'Grenada',
  'GP': 'Guadeloupe',
  'GU': 'Guam',
  'GT': 'Guatemala',
  'GN': 'Guinea',
  'GW': 'Guinea-Bissau',
  'GY': 'Guyana',
  'HT': 'Haiti',
  'HM': 'Heard and Mc Donald Islands',
  'HN': 'Honduras',
  'HK': 'Hong Kong',
  'HU': 'Hungary',
  'IS': 'Iceland',
  'IN': 'India',
  'ID': 'Indonesia',
  'IR': 'Iran',
  'IQ': 'Iraq',
  'IE': 'Ireland',
  'IL': 'Israel',
  'IT': 'Italy',
  'JM': 'Jamaica',
  'JP': 'Japan',
  'JO': 'Jordan',
  'KZ': 'Kazakhstan',
  'KE': 'Kenya',
  'KI': 'Kiribati',
  'KW': 'Kuwait',
  'KG': 'Kyrgyzstan',
  'LA': 'Laos',
  'LV': 'Latvia',
  'LB': 'Lebanon',
  'LS': 'Lesotho',
  'LR': 'Liberia',
  'LY': 'Libya',
  'LI': 'Liechtenstein',
  'LT': 'Lithuania',
  'LU': 'Luxembourg',
  'MO': 'Macau',
  'MG': 'Madagascar',
  'MW': 'Malawi',
  'MY': 'Malaysia',
  'MV': 'Maldives',
  'ML': 'Mali',
  'MT': 'Malta',
  'MH': 'Marshall Islands',
  'MQ': 'Martinique',
  'MR': 'Mauritania',
  'MU': 'Mauritius',
  'YT': 'Mayotte',
  'MX': 'Mexico',
  'FM': 'Micronesia',
  'MD': 'Moldova',
  'MC': 'Monaco',
  'MN': 'Mongolia',
  'ME': 'Montenegro',
  'MS': 'Montserrat',
  'MA': 'Morocco',
  'MZ': 'Mozambique',
  'MM': 'Myanmar',
  'NA': 'Namibia',
  'NR': 'Nauru',
  'NP': 'Nepal',
  'NL': 'Netherlands',
  'AN': 'Netherlands Antilles',
  'NC': 'New Caledonia',
  'NZ': 'New Zealand',
  'NI': 'Nicaragua',
  'NE': 'Niger',
  'NG': 'Nigeria',
  'NU': 'Niue',
  'NF': 'Norfolk Island',
  'KP': 'North Korea',
  'MP': 'Northern Marianas',
  'NO': 'Norway',
  'OM': 'Oman',
  'PK': 'Pakistan',
  'PW': 'Palau',
  'PS': 'Palestine',
  'PA': 'Panama',
  'PG': 'Papua New Guinea',
  'PY': 'Paraguay',
  'PE': 'Peru',
  'PH': 'Philippines',
  'PN': 'Pitcairn Islands',
  'PL': 'Poland',
  'PT': 'Portugal',
  'PR': 'Puerto Rico',
  'QA': 'Qatar',
  'RE': 'Reunion',
  'RO': 'Romania',
  'RU': 'Russia',
  'RW': 'Rwanda',
  'ST': 'São Tomé and Príncipe',
  'SH': 'Saint Helena',
  'PM': 'St. Pierre and Miquelon',
  'KN': 'Saint Kitts and Nevis',
  'LC': 'Saint Lucia',
  'VC': 'Saint Vincent and the Grenadines',
  'WS': 'Samoa',
  'SM': 'San Marino',
  'SA': 'Saudi Arabia',
  'SN': 'Senegal',
  'RS': 'Serbia',
  'SC': 'Seychelles',
  'SL': 'Sierra Leone',
  'SG': 'Singapore',
  'SK': 'Slovakia',
  'SI': 'Slovenia',
  'SB': 'Solomon Islands',
  'SO': 'Somalia',
  'ZA': 'South Africa',
  'GS': 'South Georgia and the South Sandwich Islands',
  'KR': 'South Korea',
  'ES': 'Spain',
  'LK': 'Sri Lanka',
  'SD': 'Sudan',
  'SR': 'Suriname',
  'SJ': 'Svalbard and Jan Mayen Islands',
  'SZ': 'Swaziland',
  'SE': 'Sweden',
  'CH': 'Switzerland',
  'SY': 'Syria',
  'TW': 'Taiwan',
  'TJ': 'Tajikistan',
  'TZ': 'Tanzania',
  'TH': 'Thailand',
  'BS': 'The Bahamas',
  'GM': 'The Gambia',
  'TG': 'Togo',
  'TK': 'Tokelau',
  'TO': 'Tonga',
  'TT': 'Trinidad and Tobago',
  'TN': 'Tunisia',
  'TR': 'Turkey',
  'TM': 'Turkmenistan',
  'TC': 'Turks and Caicos Islands',
  'TV': 'Tuvalu',
  'VI': 'US Virgin Islands',
  'UG': 'Uganda',
  'UA': 'Ukraine',
  'AE': 'United Arab Emirates',
  'GB': 'United Kingdom',
  'US': 'United States',
  'UM': 'United States Minor Outlying Islands',
  'UY': 'Uruguay',
  'UZ': 'Uzbekistan',
  'VU': 'Vanuatu',
  'VA': 'Vatican City',
  'VE': 'Venezuela',
  'VN': 'Vietnam',
  'WF': 'Wallis and Futuna Islands',
  'EH': 'Western Sahara',
  'YE': 'Yemen',
  'ZM': 'Zambia',
  'ZW': 'Zimbabwe'
};



$(function(){
  $('.products .images a.set-primary-image').click(function(e){
    e.preventDefault();
    var imageTag = $(this).find('img');
    var data = imageTag.data();
    var imageName = data.image;
    var productId = data.productId;

    $.ajax({
      url: '/dashboard/products/' + productId + '/primary_images',
      type: 'PUT',
      data: { image_name : imageName },
      success: function(result) {
        updatePrimaryImage(imageName);
      }
    });
  });

  $('.products .images a.remove-image').click(function(e) {
    e.preventDefault();
    var data = $(this).data();
    var imageName = data.image;
    var productId = data.productId;

    $.ajax({
      url: '/dashboard/products/' + productId + '/images',
      type: 'DELETE',
      data: { image_name: imageName },
      success: function(result) {
        removeDeletedImage(result.deleted_image_name);
        if (data.isPrimaryImage) setPrimaryImage();
      }
    });
  });

  function setPrimaryImage() {
    var $image = $('.images .image:first-child');
    if ($image.length == 0) return;
    $image.find('a.set-primary-image').click();
  }

  function updatePrimaryImage(primaryImageName) {
    var $images = $('.images img');
    $images.removeClass('primary-image');

    for (var i = 0; i < $images.length; i++ ) {
      var image = $images[i];
      if($(image).data().image == primaryImageName) {
        $(image).addClass('primary-image');
        $(image).parent().siblings().find('a').data('isPrimaryImage', true);
        break;
      }
    }
  }

  function removeDeletedImage(deletedImage) {
    var images = $('.images .image');
    for (var i = 0; i < images.length; i++) {
      var $image = $(images[i]);
      var $link = $image.find('a img');
      var data = $link.data();
      if (data.image == deletedImage) {
        $image.remove();
        return;
      }
    }
  }

});

$(function() {
  $('.product-delete-btn').click(function(e){
    e.preventDefault();
    var productId = $(this).data().productId;
    $.ajax({
      url: '/dashboard/products/' + productId,
      type: 'DELETE',
      success: function(result) {
        $('#product-' + result.product_id).remove();
      }
    });
  });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvdW50cnlfc3RhdGVfc2VsZWN0LmpzIiwibWFpbi5qcyIsInByb2R1Y3QuanMiLCJwcm9kdWN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hRQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuICB2YXIgJGNvbnRhY3RDb3VudHJ5ID0gJCgnI2NvbnRhY3QtY291bnRyeScpO1xuXG4gIChmdW5jdGlvbiBpbml0Q291bnRyeU9wdGlvbnMoKSB7XG4gICAgdmFyICRjb3VudHJ5U2VsZWN0ID0gJCgnI2NvbnRhY3QtY291bnRyeScpO1xuICAgIHZhciBvcHRpb25zID0gW107XG4gICAgZm9yIChrZXkgaW4gY291bnRyeUxpc3QpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGNvdW50cnlMaXN0W2tleV07XG4gICAgICB2YXIgc3RvcmUgPSAkY291bnRyeVNlbGVjdC5kYXRhKCdzdG9yZScpO1xuICAgICAgdmFyIHByZXNlbGVjdCA9ICghc3RvcmUpID8gJ1RoYWlsYW5kJyA6IHN0b3JlO1xuICAgICAgdmFyIHNlbGVjdGVkID0gKHZhbHVlID09IHByZXNlbGVjdCkgPyAnc2VsZWN0ZWQnIDogJyc7XG5cbiAgICAgIG9wdGlvbnMucHVzaCgnPG9wdGlvbiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIiAnKyBzZWxlY3RlZCArICc+J1xuICAgICAgICAgICAgICAgICAgKyB2YWx1ZSArICc8L29wdGlvbj4nKTtcbiAgICB9XG4gICAgJGNvdW50cnlTZWxlY3QuYXBwZW5kKG9wdGlvbnMuam9pbigpKTtcbiAgfSkoKTtcblxufSk7XG5cbnZhciBjb3VudHJ5TGlzdCA9IHtcbiAgJ0FGJzogJ0FmZ2hhbmlzdGFuJyxcbiAgJ0FMJzogJ0FsYmFuaWEnLFxuICAnRFonOiAnQWxnZXJpYScsXG4gICdBUyc6ICdBbWVyaWNhbiBTYW1vYScsXG4gICdBRCc6ICdBbmRvcnJhJyxcbiAgJ0FPJzogJ0FuZ29sYScsXG4gICdBSSc6ICdBbmd1aWxsYScsXG4gICdBUSc6ICdBbnRhcmN0aWNhJyxcbiAgJ0FHJzogJ0FudGlndWEgYW5kIEJhcmJ1ZGEnLFxuICAnQVInOiAnQXJnZW50aW5hJyxcbiAgJ0FNJzogJ0FybWVuaWEnLFxuICAnQVcnOiAnQXJ1YmEnLFxuICAnQVUnOiAnQXVzdHJhbGlhJyxcbiAgJ0FUJzogJ0F1c3RyaWEnLFxuICAnQVonOiAnQXplcmJhaWphbicsXG4gICdCSCc6ICdCYWhyYWluJyxcbiAgJ0JEJzogJ0JhbmdsYWRlc2gnLFxuICAnQkInOiAnQmFyYmFkb3MnLFxuICAnQlknOiAnQmVsYXJ1cycsXG4gICdCRSc6ICdCZWxnaXVtJyxcbiAgJ0JaJzogJ0JlbGl6ZScsXG4gICdCSic6ICdCZW5pbicsXG4gICdCTSc6ICdCZXJtdWRhJyxcbiAgJ0JUJzogJ0JodXRhbicsXG4gICdCTyc6ICdCb2xpdmlhJyxcbiAgJ0JBJzogJ0Jvc25pYSBhbmQgSGVyemVnb3ZpbmEnLFxuICAnQlcnOiAnQm90c3dhbmEnLFxuICAnQlYnOiAnQm91dmV0IElzbGFuZCcsXG4gICdCUic6ICdCcmF6aWwnLFxuICAnSU8nOiAnQnJpdGlzaCBJbmRpYW4gT2NlYW4gVGVycml0b3J5JyxcbiAgJ1ZHJzogJ0JyaXRpc2ggVmlyZ2luIElzbGFuZHMnLFxuICAnQk4nOiAnQnJ1bmVpJyxcbiAgJ0JHJzogJ0J1bGdhcmlhJyxcbiAgJ0JGJzogJ0J1cmtpbmEgRmFzbycsXG4gICdCSSc6ICdCdXJ1bmRpJyxcbiAgJ0NJJzogJ0PDtHRlIGRcXCdJdm9pcmUnLFxuICAnS0gnOiAnQ2FtYm9kaWEnLFxuICAnQ00nOiAnQ2FtZXJvb24nLFxuICAnQ0EnOiAnQ2FuYWRhJyxcbiAgJ0NWJzogJ0NhcGUgVmVyZGUnLFxuICAnS1knOiAnQ2F5bWFuIElzbGFuZHMnLFxuICAnQ0YnOiAnQ2VudHJhbCBBZnJpY2FuIFJlcHVibGljJyxcbiAgJ1REJzogJ0NoYWQnLFxuICAnQ0wnOiAnQ2hpbGUnLFxuICAnQ04nOiAnQ2hpbmEnLFxuICAnQ1gnOiAnQ2hyaXN0bWFzIElzbGFuZCcsXG4gICdDQyc6ICdDb2NvcyAoS2VlbGluZykgSXNsYW5kcycsXG4gICdDTyc6ICdDb2xvbWJpYScsXG4gICdLTSc6ICdDb21vcm9zJyxcbiAgJ0NHJzogJ0NvbmdvJyxcbiAgJ0NLJzogJ0Nvb2sgSXNsYW5kcycsXG4gICdDUic6ICdDb3N0YSBSaWNhJyxcbiAgJ0hSJzogJ0Nyb2F0aWEnLFxuICAnQ1UnOiAnQ3ViYScsXG4gICdDWSc6ICdDeXBydXMnLFxuICAnQ1onOiAnQ3plY2ggUmVwdWJsaWMnLFxuICAnQ0QnOiAnRGVtb2NyYXRpYyBSZXB1YmxpYyBvZiB0aGUgQ29uZ28nLFxuICAnREsnOiAnRGVubWFyaycsXG4gICdESic6ICdEamlib3V0aScsXG4gICdETSc6ICdEb21pbmljYScsXG4gICdETyc6ICdEb21pbmljYW4gUmVwdWJsaWMnLFxuICAnVFAnOiAnRWFzdCBUaW1vcicsXG4gICdFQyc6ICdFY3VhZG9yJyxcbiAgJ0VHJzogJ0VneXB0JyxcbiAgJ1NWJzogJ0VsIFNhbHZhZG9yJyxcbiAgJ0dRJzogJ0VxdWF0b3JpYWwgR3VpbmVhJyxcbiAgJ0VSJzogJ0VyaXRyZWEnLFxuICAnRUUnOiAnRXN0b25pYScsXG4gICdFVCc6ICdFdGhpb3BpYScsXG4gICdGTyc6ICdGYWVyb2UgSXNsYW5kcycsXG4gICdGSyc6ICdGYWxrbGFuZCBJc2xhbmRzJyxcbiAgJ0ZKJzogJ0ZpamknLFxuICAnRkknOiAnRmlubGFuZCcsXG4gICdNSyc6ICdGb3JtZXIgWXVnb3NsYXYgUmVwdWJsaWMgb2YgTWFjZWRvbmlhJyxcbiAgJ0ZSJzogJ0ZyYW5jZScsXG4gICdGWCc6ICdGcmFuY2UsIE1ldHJvcG9saXRhbicsXG4gICdHRic6ICdGcmVuY2ggR3VpYW5hJyxcbiAgJ1BGJzogJ0ZyZW5jaCBQb2x5bmVzaWEnLFxuICAnVEYnOiAnRnJlbmNoIFNvdXRoZXJuIFRlcnJpdG9yaWVzJyxcbiAgJ0dBJzogJ0dhYm9uJyxcbiAgJ0dFJzogJ0dlb3JnaWEnLFxuICAnREUnOiAnR2VybWFueScsXG4gICdHSCc6ICdHaGFuYScsXG4gICdHSSc6ICdHaWJyYWx0YXInLFxuICAnR1InOiAnR3JlZWNlJyxcbiAgJ0dMJzogJ0dyZWVubGFuZCcsXG4gICdHRCc6ICdHcmVuYWRhJyxcbiAgJ0dQJzogJ0d1YWRlbG91cGUnLFxuICAnR1UnOiAnR3VhbScsXG4gICdHVCc6ICdHdWF0ZW1hbGEnLFxuICAnR04nOiAnR3VpbmVhJyxcbiAgJ0dXJzogJ0d1aW5lYS1CaXNzYXUnLFxuICAnR1knOiAnR3V5YW5hJyxcbiAgJ0hUJzogJ0hhaXRpJyxcbiAgJ0hNJzogJ0hlYXJkIGFuZCBNYyBEb25hbGQgSXNsYW5kcycsXG4gICdITic6ICdIb25kdXJhcycsXG4gICdISyc6ICdIb25nIEtvbmcnLFxuICAnSFUnOiAnSHVuZ2FyeScsXG4gICdJUyc6ICdJY2VsYW5kJyxcbiAgJ0lOJzogJ0luZGlhJyxcbiAgJ0lEJzogJ0luZG9uZXNpYScsXG4gICdJUic6ICdJcmFuJyxcbiAgJ0lRJzogJ0lyYXEnLFxuICAnSUUnOiAnSXJlbGFuZCcsXG4gICdJTCc6ICdJc3JhZWwnLFxuICAnSVQnOiAnSXRhbHknLFxuICAnSk0nOiAnSmFtYWljYScsXG4gICdKUCc6ICdKYXBhbicsXG4gICdKTyc6ICdKb3JkYW4nLFxuICAnS1onOiAnS2F6YWtoc3RhbicsXG4gICdLRSc6ICdLZW55YScsXG4gICdLSSc6ICdLaXJpYmF0aScsXG4gICdLVyc6ICdLdXdhaXQnLFxuICAnS0cnOiAnS3lyZ3l6c3RhbicsXG4gICdMQSc6ICdMYW9zJyxcbiAgJ0xWJzogJ0xhdHZpYScsXG4gICdMQic6ICdMZWJhbm9uJyxcbiAgJ0xTJzogJ0xlc290aG8nLFxuICAnTFInOiAnTGliZXJpYScsXG4gICdMWSc6ICdMaWJ5YScsXG4gICdMSSc6ICdMaWVjaHRlbnN0ZWluJyxcbiAgJ0xUJzogJ0xpdGh1YW5pYScsXG4gICdMVSc6ICdMdXhlbWJvdXJnJyxcbiAgJ01PJzogJ01hY2F1JyxcbiAgJ01HJzogJ01hZGFnYXNjYXInLFxuICAnTVcnOiAnTWFsYXdpJyxcbiAgJ01ZJzogJ01hbGF5c2lhJyxcbiAgJ01WJzogJ01hbGRpdmVzJyxcbiAgJ01MJzogJ01hbGknLFxuICAnTVQnOiAnTWFsdGEnLFxuICAnTUgnOiAnTWFyc2hhbGwgSXNsYW5kcycsXG4gICdNUSc6ICdNYXJ0aW5pcXVlJyxcbiAgJ01SJzogJ01hdXJpdGFuaWEnLFxuICAnTVUnOiAnTWF1cml0aXVzJyxcbiAgJ1lUJzogJ01heW90dGUnLFxuICAnTVgnOiAnTWV4aWNvJyxcbiAgJ0ZNJzogJ01pY3JvbmVzaWEnLFxuICAnTUQnOiAnTW9sZG92YScsXG4gICdNQyc6ICdNb25hY28nLFxuICAnTU4nOiAnTW9uZ29saWEnLFxuICAnTUUnOiAnTW9udGVuZWdybycsXG4gICdNUyc6ICdNb250c2VycmF0JyxcbiAgJ01BJzogJ01vcm9jY28nLFxuICAnTVonOiAnTW96YW1iaXF1ZScsXG4gICdNTSc6ICdNeWFubWFyJyxcbiAgJ05BJzogJ05hbWliaWEnLFxuICAnTlInOiAnTmF1cnUnLFxuICAnTlAnOiAnTmVwYWwnLFxuICAnTkwnOiAnTmV0aGVybGFuZHMnLFxuICAnQU4nOiAnTmV0aGVybGFuZHMgQW50aWxsZXMnLFxuICAnTkMnOiAnTmV3IENhbGVkb25pYScsXG4gICdOWic6ICdOZXcgWmVhbGFuZCcsXG4gICdOSSc6ICdOaWNhcmFndWEnLFxuICAnTkUnOiAnTmlnZXInLFxuICAnTkcnOiAnTmlnZXJpYScsXG4gICdOVSc6ICdOaXVlJyxcbiAgJ05GJzogJ05vcmZvbGsgSXNsYW5kJyxcbiAgJ0tQJzogJ05vcnRoIEtvcmVhJyxcbiAgJ01QJzogJ05vcnRoZXJuIE1hcmlhbmFzJyxcbiAgJ05PJzogJ05vcndheScsXG4gICdPTSc6ICdPbWFuJyxcbiAgJ1BLJzogJ1Bha2lzdGFuJyxcbiAgJ1BXJzogJ1BhbGF1JyxcbiAgJ1BTJzogJ1BhbGVzdGluZScsXG4gICdQQSc6ICdQYW5hbWEnLFxuICAnUEcnOiAnUGFwdWEgTmV3IEd1aW5lYScsXG4gICdQWSc6ICdQYXJhZ3VheScsXG4gICdQRSc6ICdQZXJ1JyxcbiAgJ1BIJzogJ1BoaWxpcHBpbmVzJyxcbiAgJ1BOJzogJ1BpdGNhaXJuIElzbGFuZHMnLFxuICAnUEwnOiAnUG9sYW5kJyxcbiAgJ1BUJzogJ1BvcnR1Z2FsJyxcbiAgJ1BSJzogJ1B1ZXJ0byBSaWNvJyxcbiAgJ1FBJzogJ1FhdGFyJyxcbiAgJ1JFJzogJ1JldW5pb24nLFxuICAnUk8nOiAnUm9tYW5pYScsXG4gICdSVSc6ICdSdXNzaWEnLFxuICAnUlcnOiAnUndhbmRhJyxcbiAgJ1NUJzogJ1PDo28gVG9tw6kgYW5kIFByw61uY2lwZScsXG4gICdTSCc6ICdTYWludCBIZWxlbmEnLFxuICAnUE0nOiAnU3QuIFBpZXJyZSBhbmQgTWlxdWVsb24nLFxuICAnS04nOiAnU2FpbnQgS2l0dHMgYW5kIE5ldmlzJyxcbiAgJ0xDJzogJ1NhaW50IEx1Y2lhJyxcbiAgJ1ZDJzogJ1NhaW50IFZpbmNlbnQgYW5kIHRoZSBHcmVuYWRpbmVzJyxcbiAgJ1dTJzogJ1NhbW9hJyxcbiAgJ1NNJzogJ1NhbiBNYXJpbm8nLFxuICAnU0EnOiAnU2F1ZGkgQXJhYmlhJyxcbiAgJ1NOJzogJ1NlbmVnYWwnLFxuICAnUlMnOiAnU2VyYmlhJyxcbiAgJ1NDJzogJ1NleWNoZWxsZXMnLFxuICAnU0wnOiAnU2llcnJhIExlb25lJyxcbiAgJ1NHJzogJ1NpbmdhcG9yZScsXG4gICdTSyc6ICdTbG92YWtpYScsXG4gICdTSSc6ICdTbG92ZW5pYScsXG4gICdTQic6ICdTb2xvbW9uIElzbGFuZHMnLFxuICAnU08nOiAnU29tYWxpYScsXG4gICdaQSc6ICdTb3V0aCBBZnJpY2EnLFxuICAnR1MnOiAnU291dGggR2VvcmdpYSBhbmQgdGhlIFNvdXRoIFNhbmR3aWNoIElzbGFuZHMnLFxuICAnS1InOiAnU291dGggS29yZWEnLFxuICAnRVMnOiAnU3BhaW4nLFxuICAnTEsnOiAnU3JpIExhbmthJyxcbiAgJ1NEJzogJ1N1ZGFuJyxcbiAgJ1NSJzogJ1N1cmluYW1lJyxcbiAgJ1NKJzogJ1N2YWxiYXJkIGFuZCBKYW4gTWF5ZW4gSXNsYW5kcycsXG4gICdTWic6ICdTd2F6aWxhbmQnLFxuICAnU0UnOiAnU3dlZGVuJyxcbiAgJ0NIJzogJ1N3aXR6ZXJsYW5kJyxcbiAgJ1NZJzogJ1N5cmlhJyxcbiAgJ1RXJzogJ1RhaXdhbicsXG4gICdUSic6ICdUYWppa2lzdGFuJyxcbiAgJ1RaJzogJ1RhbnphbmlhJyxcbiAgJ1RIJzogJ1RoYWlsYW5kJyxcbiAgJ0JTJzogJ1RoZSBCYWhhbWFzJyxcbiAgJ0dNJzogJ1RoZSBHYW1iaWEnLFxuICAnVEcnOiAnVG9nbycsXG4gICdUSyc6ICdUb2tlbGF1JyxcbiAgJ1RPJzogJ1RvbmdhJyxcbiAgJ1RUJzogJ1RyaW5pZGFkIGFuZCBUb2JhZ28nLFxuICAnVE4nOiAnVHVuaXNpYScsXG4gICdUUic6ICdUdXJrZXknLFxuICAnVE0nOiAnVHVya21lbmlzdGFuJyxcbiAgJ1RDJzogJ1R1cmtzIGFuZCBDYWljb3MgSXNsYW5kcycsXG4gICdUVic6ICdUdXZhbHUnLFxuICAnVkknOiAnVVMgVmlyZ2luIElzbGFuZHMnLFxuICAnVUcnOiAnVWdhbmRhJyxcbiAgJ1VBJzogJ1VrcmFpbmUnLFxuICAnQUUnOiAnVW5pdGVkIEFyYWIgRW1pcmF0ZXMnLFxuICAnR0InOiAnVW5pdGVkIEtpbmdkb20nLFxuICAnVVMnOiAnVW5pdGVkIFN0YXRlcycsXG4gICdVTSc6ICdVbml0ZWQgU3RhdGVzIE1pbm9yIE91dGx5aW5nIElzbGFuZHMnLFxuICAnVVknOiAnVXJ1Z3VheScsXG4gICdVWic6ICdVemJla2lzdGFuJyxcbiAgJ1ZVJzogJ1ZhbnVhdHUnLFxuICAnVkEnOiAnVmF0aWNhbiBDaXR5JyxcbiAgJ1ZFJzogJ1ZlbmV6dWVsYScsXG4gICdWTic6ICdWaWV0bmFtJyxcbiAgJ1dGJzogJ1dhbGxpcyBhbmQgRnV0dW5hIElzbGFuZHMnLFxuICAnRUgnOiAnV2VzdGVybiBTYWhhcmEnLFxuICAnWUUnOiAnWWVtZW4nLFxuICAnWk0nOiAnWmFtYmlhJyxcbiAgJ1pXJzogJ1ppbWJhYndlJ1xufTtcblxuIiwiIiwiJChmdW5jdGlvbigpe1xuICAkKCcucHJvZHVjdHMgLmltYWdlcyBhLnNldC1wcmltYXJ5LWltYWdlJykuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBpbWFnZVRhZyA9ICQodGhpcykuZmluZCgnaW1nJyk7XG4gICAgdmFyIGRhdGEgPSBpbWFnZVRhZy5kYXRhKCk7XG4gICAgdmFyIGltYWdlTmFtZSA9IGRhdGEuaW1hZ2U7XG4gICAgdmFyIHByb2R1Y3RJZCA9IGRhdGEucHJvZHVjdElkO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJy9kYXNoYm9hcmQvcHJvZHVjdHMvJyArIHByb2R1Y3RJZCArICcvcHJpbWFyeV9pbWFnZXMnLFxuICAgICAgdHlwZTogJ1BVVCcsXG4gICAgICBkYXRhOiB7IGltYWdlX25hbWUgOiBpbWFnZU5hbWUgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICB1cGRhdGVQcmltYXJ5SW1hZ2UoaW1hZ2VOYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgJCgnLnByb2R1Y3RzIC5pbWFnZXMgYS5yZW1vdmUtaW1hZ2UnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKCk7XG4gICAgdmFyIGltYWdlTmFtZSA9IGRhdGEuaW1hZ2U7XG4gICAgdmFyIHByb2R1Y3RJZCA9IGRhdGEucHJvZHVjdElkO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJy9kYXNoYm9hcmQvcHJvZHVjdHMvJyArIHByb2R1Y3RJZCArICcvaW1hZ2VzJyxcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxuICAgICAgZGF0YTogeyBpbWFnZV9uYW1lOiBpbWFnZU5hbWUgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICByZW1vdmVEZWxldGVkSW1hZ2UocmVzdWx0LmRlbGV0ZWRfaW1hZ2VfbmFtZSk7XG4gICAgICAgIGlmIChkYXRhLmlzUHJpbWFyeUltYWdlKSBzZXRQcmltYXJ5SW1hZ2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gc2V0UHJpbWFyeUltYWdlKCkge1xuICAgIHZhciAkaW1hZ2UgPSAkKCcuaW1hZ2VzIC5pbWFnZTpmaXJzdC1jaGlsZCcpO1xuICAgIGlmICgkaW1hZ2UubGVuZ3RoID09IDApIHJldHVybjtcbiAgICAkaW1hZ2UuZmluZCgnYS5zZXQtcHJpbWFyeS1pbWFnZScpLmNsaWNrKCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVQcmltYXJ5SW1hZ2UocHJpbWFyeUltYWdlTmFtZSkge1xuICAgIHZhciAkaW1hZ2VzID0gJCgnLmltYWdlcyBpbWcnKTtcbiAgICAkaW1hZ2VzLnJlbW92ZUNsYXNzKCdwcmltYXJ5LWltYWdlJyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRpbWFnZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICB2YXIgaW1hZ2UgPSAkaW1hZ2VzW2ldO1xuICAgICAgaWYoJChpbWFnZSkuZGF0YSgpLmltYWdlID09IHByaW1hcnlJbWFnZU5hbWUpIHtcbiAgICAgICAgJChpbWFnZSkuYWRkQ2xhc3MoJ3ByaW1hcnktaW1hZ2UnKTtcbiAgICAgICAgJChpbWFnZSkucGFyZW50KCkuc2libGluZ3MoKS5maW5kKCdhJykuZGF0YSgnaXNQcmltYXJ5SW1hZ2UnLCB0cnVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRGVsZXRlZEltYWdlKGRlbGV0ZWRJbWFnZSkge1xuICAgIHZhciBpbWFnZXMgPSAkKCcuaW1hZ2VzIC5pbWFnZScpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1hZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJGltYWdlID0gJChpbWFnZXNbaV0pO1xuICAgICAgdmFyICRsaW5rID0gJGltYWdlLmZpbmQoJ2EgaW1nJyk7XG4gICAgICB2YXIgZGF0YSA9ICRsaW5rLmRhdGEoKTtcbiAgICAgIGlmIChkYXRhLmltYWdlID09IGRlbGV0ZWRJbWFnZSkge1xuICAgICAgICAkaW1hZ2UucmVtb3ZlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufSk7XG4iLCIkKGZ1bmN0aW9uKCkge1xuICAkKCcucHJvZHVjdC1kZWxldGUtYnRuJykuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBwcm9kdWN0SWQgPSAkKHRoaXMpLmRhdGEoKS5wcm9kdWN0SWQ7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJy9kYXNoYm9hcmQvcHJvZHVjdHMvJyArIHByb2R1Y3RJZCxcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICQoJyNwcm9kdWN0LScgKyByZXN1bHQucHJvZHVjdF9pZCkucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
