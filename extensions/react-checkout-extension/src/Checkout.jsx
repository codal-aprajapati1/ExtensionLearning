import {
  BlockStack,
  InlineStack,
  Select,
  reactExtension,
  Text,
  useApi,
  useApplyMetafieldsChange,
  useMetafield,
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
  const [handleId] = useState('country-description-bzrsdsuv');
  const { query } = useApi();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [fetchedData, setFetchedData] = useState(null); // Initialized to null

  const country_key = 'customer_country';
  const state_key = 'customer_state';
  const city_key = 'customer_city';

  const applyMetafieldsChange = useApplyMetafieldsChange(); // Move this declaration to the top

  const fetchDropDowndata = async () => {
    try {
      const response = await query(
        `query($handleId: String!) {
          metaobject(handle: { handle: $handleId, type: "country_description" }) {
            fields {
              value
            }
          }
        }`,
        { variables: { handleId } },
      );

      const data = response?.data;
      if (data) {
        const parsedData = JSON.parse(data.metaobject.fields[0].value);
        setFetchedData(parsedData);
      }
    } catch (errors) {
      console.error(errors);
    }
  };

  useEffect(() => {
    fetchDropDowndata();
  }, [handleId, query]);

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    const countryLabel = fetchedData.countries.find((country) => country.key === value).value;
    console.log('This is the value for the country change', countryLabel);
    applyMetafieldsChange({
      type: 'updateMetafield',
      namespace: 'custom',
      key: country_key,
      valueType: 'string',
      value: countryLabel,
    });
    setSelectedState(''); // Reset state selection when country changes
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    const stateLabel = fetchedData[selectedCountry].find((state) => state.key === value).value;
    console.log(stateLabel);
    applyMetafieldsChange({
      type: 'updateMetafield',
      namespace: 'custom',
      key: state_key,
      valueType: 'string',
      value: stateLabel,
    });
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    const cityLabel = fetchedData[selectedState].find((city) => city.key === value).value;
    console.log(cityLabel);
    applyMetafieldsChange({
      type: 'updateMetafield',
      namespace: 'custom',
      key: city_key,
      valueType: 'string',
      value: cityLabel,
    });
  };

  if (!fetchedData) {
    return <Text>Loading...</Text>; // Use <Text> for loading state
  }

  return (
    <BlockStack>
      <InlineStack wrap={false}>
        <Text>Select Country:</Text>
        <Select
          label="Country"
          value={selectedCountry}
          onChange={handleCountryChange}
          options={[
            { value: '', label: '--Your Country--' },
            ...fetchedData.countries.map((country) => ({
              value: country.key,
              label: country.value,
            })),
          ]}
        />
      </InlineStack>

      {selectedCountry && (
        <InlineStack wrap={false}>
          <Text>Select State:</Text>
          <Select
            label="State"
            value={selectedState}
            onChange={handleStateChange}
            options={[
              { value: '', label: '--Your State--' },
              ...fetchedData[selectedCountry]?.map((state) => ({
                value: state.key,
                label: state.value,
              })),
            ]}
          />
        </InlineStack>
      )}

      {selectedState && (
        <InlineStack wrap={false}>
          <Text>Select City:</Text>
          <Select
            label="City"
            value={selectedCity}
            onChange={handleCityChange}
            options={[
              { value: '', label: '--Your City--' },
              ...fetchedData[selectedState]?.map((city) => ({
                value: city.key,
                label: city.value,
              })),
            ]}
          />
        </InlineStack>
      )}
    </BlockStack>
  );
}
