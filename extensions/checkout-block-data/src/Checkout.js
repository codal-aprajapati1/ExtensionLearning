import { extension, Banner, Image } from '@shopify/ui-extensions/checkout';

export default extension('purchase.checkout.block.render', (root, { settings }) => {
  const banner = root.createComponent(Banner, {
    title: settings.current.banner_title,
  });
  settings.subscribe((newSettings) => {
    banner.updateProps({
      title: newSettings.banner_title,
    });
  });
  const image_block = root.createComponent(Image, {
    source: settings.image_url,
    loading: 'lazy',
  });

  root.appendChild(banner);
  root.appendChild(image_block);
});
