import React, { useState, useCallback } from 'react';
import {
  reactExtension,
  Checkbox,
  useSettings,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useApplyNoteChange,
  useTotalAmount,
  useStorage,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
  const [textFieldValue, setTextFieldValue] = useState('');
  const [checked, setChecked] = useState(false);
  const { checkbox_title, status, display_block, total_amount_basis } = useSettings();
  const handleTextFieldChange = useCallback((value) => setTextFieldValue(value), []);
  const handleChange = () => {
    setChecked(!checked);
  };
  const applyMetafieldsChange = useApplyMetafieldsChange();
  const ApplyNoteChange = useApplyNoteChange();
  const totalAmount = useTotalAmount();
  const localstorage = useStorage();
  // localstorage.write('key1', 'Anil');

  const read_promise = localstorage.read('key1').then((result) => {
    console.log(result, 'no');
  });

  const handleUpdateMetafields = (value) => {
    if (status === 'metafields') {
      applyMetafieldsChange({
        type: 'updateMetafield',
        namespace: 'custom',
        key: 'customer_message',
        valueType: 'string',
        value: value,
      });
      // console.log('updated to metafields', value);
    } else if (status === 'notes') {
      ApplyNoteChange({
        type: 'updateNote',
        note: value,
      });
    } else {
      console.log('none');
    }
  };

  let shouldDisplayBlock = false;
  if (
    total_amount_basis === 'greater than the amount entered' &&
    totalAmount.amount > display_block
  ) {
    // console.log(totalAmount.amount);
    shouldDisplayBlock = true;
  } else if (
    total_amount_basis === 'less than the amount entered' &&
    totalAmount.amount < display_block
  ) {
    // console.log(totalAmount.amount);
    shouldDisplayBlock = true;
  } else if (
    total_amount_basis === 'equal to the entered amount' &&
    totalAmount.amount === display_block
  ) {
    // console.log(totalAmount);
    shouldDisplayBlock = true;
  }

  if (!shouldDisplayBlock) {
    return null;
  }

  return (
    <BlockStack>
      <Checkbox id="checkbox" name="checkbox" checked={checked} onChange={handleChange}>
        {checkbox_title}
      </Checkbox>
      {checked && (
        <TextField
          label="Enter Message"
          maxLength={100}
          autoComplete="off"
          value={textFieldValue}
          onChange={(e) => {
            handleTextFieldChange(e);
            handleUpdateMetafields(e);
          }}
        />
      )}
    </BlockStack>
  );
}
