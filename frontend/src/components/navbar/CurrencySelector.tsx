/**
 * CurrencySelector Component - Using Preact Signals
 */

import type { ComponentChildren } from 'preact';
import { DollarSign } from 'lucide-preact';
import { currency, setCurrency } from '../../stores/preferencesStore';
import { SUPPORTED_CURRENCIES } from '../../lib/constants';
import Dropdown, { type DropdownItem } from '../ui/Dropdown';
import IconButton from '../ui/IconButton';

export default function CurrencySelector() {
  /**
   * Handle currency change
   */
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency as 'USD' | 'EUR' | 'PEN');
  };

  /**
   * Convert currency options to dropdown items
   */
  const currencyItems: DropdownItem[] = SUPPORTED_CURRENCIES.map((curr) => ({
    value: curr.code,
    label: `${curr.symbol} ${curr.code}`,
    icon: <span className="text-lg">{curr.flag}</span> as ComponentChildren,
  }));

  const triggerContent = (
    <IconButton
      icon={<DollarSign size={20} /> as ComponentChildren}
      onClick={() => {}}
      ariaLabel="Select currency"
      active={false}
    />
  ) as ComponentChildren;

  return (
    <Dropdown
      trigger={triggerContent}
      items={currencyItems}
      value={currency.value}
      onChange={handleCurrencyChange}
    />
  );
}