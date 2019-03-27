foam.ENUM({
  package: 'net.nanopay.meter.compliance.dowjones.enums',
  name: 'SearchType',

  documentation: `The desired tolerance for the search`,

  values: [
    {
      name: 'PRECISE',
      label: 'Precise'
    },
    {
      name: 'NEAR',
      label: 'Near'
    },
    {
      name: 'BROAD',
      label: 'Broad'
    }
  ]
});
