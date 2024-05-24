import { reactExtension, Image, useSettings } from '@shopify/ui-extensions-react/checkout';
import { BlockStack, Text } from '@shopify/ui-extensions/checkout';

const image_block = reactExtension('purchase.checkout.block.render', () => <Extension />);
export { image_block };
function Extension() {
  const { image_url, image_title } = useSettings();
  return (
    <BlockStack>
      <Text>Image Title : {image_title} </Text>
      <Image source={image_url} />
    </BlockStack>
  );
}
