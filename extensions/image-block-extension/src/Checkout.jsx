import {
  reactExtension,
  useStorage,
  Image,
  useSettings,
} from '@shopify/ui-extensions-react/checkout';
import { BlockStack, Text } from '@shopify/ui-extensions/checkout';

const image_block = reactExtension('purchase.checkout.block.render', () => <Extension />);
export { image_block };
function Extension() {
  var abc = '';
  const { image_url, image_title } = useSettings();
  const localstorage = useStorage();
  localstorage.delete('lorem  ');

  return (
    <BlockStack>
      helo
      <Text>{abc}</Text>
      <Text>Image Title : {image_title} </Text>
      <Image source={image_url} />
    </BlockStack>
  );
}
