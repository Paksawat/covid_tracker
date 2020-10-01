let countryCode = geoplugin_countryCode();

country_list.foreach((country) => {
  if (country.code == countryCode) {
    country = country.name;
  }
});
