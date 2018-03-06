foam.CLASS({
  package: 'net.nanopay.util',
  name: 'FormValidation',

  exports: [
    'validateName',
    'validateEmail',
    'validatePostalCode',
    'validatePhone',
    'validateCity',
    'validateStreetNumber',
    'validateStreetName',
    'validateAddressLine',
    'validatePassword',
    'validateWebsite',
    'validateTitleNumOrAuth',
    'validateInstitutionNumber'
  ],

  methods: [
    function validateName(name) {
      var re = /^[a-zA-Z ]{1,70}$/;
      return re.test(String(name));
    },
    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    function validatePhone(number) {
      var re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      return re.test(String(number));
    },
    function validateStreetNumber(streetNumber) {
      var re = /^[0-9]{1,16}$/;
      return re.test(String(streetNumber));
    },
    function validateStreetName(streetName) {
      var re = /^[a-zA-Z0-9 ]{1,70}$/;
      return re.test(String(streetName));
    },
    function validateAddressLine(addressLine) {
      var re = /^[a-zA-Z0-9 ]{1,70}$/;
      return re.test(String(addressLine));
    },
    function validatePostalCode(code) {
      var re = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
      return re.test(String(code));
    },
    function validateCity(city) {
      var re = /^[a-zA-Z ]{1,35}$/;
      return re.test(String(city));
    },
    function validatePassword(password) {
      var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{7,32}$/;
      return re.test(String(password));
    },
    function validateWebsite(website) {
      var re = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
      return re.test(String(website));
    },
    function validateTitleNumOrAuth(issuingAuthority) {
      var re = /^[a-zA-Z0-9 ]{1,35}$/;
      return re.test(String(issuingAuthority));
    },
    function validateAccountNumber(accountNumber) {
      var re = /^[0-9]{1,30}$/;
      return re.test(String(accountNumber));
    },
    function validateTransitNumber(transitNumber) {
      var re = /^[0-9]{5}$/;
      return re.test(String(transitNumber));
    },
    function validateInstitutionNumber(institutionNumber) {
      var re = /^[0-9]{3}$/;
      return re.test(String(institutionNumber));
    }
  ]
});
