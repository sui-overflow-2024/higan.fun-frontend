"use client"
import React, { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {CaretSortIcon} from '@radix-ui/react-icons'
const Filter = () => {
  const [selected, setSelected] = useState('Bump Order');

  const handleSelect = (value: React.SetStateAction<string>) => {
    if (value !== selected) {
      setSelected(value);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="bg-[#102a4d9e] text-white px-4 py-2 rounded w-[13rem] flex justify-between">
        <span>Sort By: </span><div className='flex items-center'>{selected} <CaretSortIcon/> </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content alignOffset={0} align='end' className="bg-[#102a4d] text-gray-200 shadow-lg rounded border border-gray-200">
          <DropdownMenu.Item className={`px-4 py-2 hover:bg-[#4776b4e0] hover:text-white ${selected === 'Bump Order' ? 'bg-[#2554919e]' : ''}`} onSelect={() => handleSelect('Bump Order')}>
            Bump Order
          </DropdownMenu.Item>
          <DropdownMenu.Item className={`px-4 py-2 hover:bg-blue-500 hover:text-white ${selected === 'Reply Count' ? 'bg-blue-200' : ''}`} onSelect={() => handleSelect('Reply Count')}>
            Reply Count
          </DropdownMenu.Item>
          <DropdownMenu.Item className={`px-4 py-2 hover:bg-blue-500 hover:text-white ${selected === 'Last Reply' ? 'bg-blue-200' : ''}`} onSelect={() => handleSelect('Last Reply')}>
            Last Reply
          </DropdownMenu.Item>
          <DropdownMenu.Item className={`px-4 py-2 hover:bg-blue-500 hover:text-white ${selected === 'Creation Date' ? 'bg-blue-200' : ''}`} onSelect={() => handleSelect('Creation Date')}>
            Creation Date
          </DropdownMenu.Item>
          <DropdownMenu.Item className={`px-4 py-2 hover:bg-blue-500 hover:text-white ${selected === 'Market Cap' ? 'bg-blue-200' : ''}`} onSelect={() => handleSelect('Market Cap')}>
            Market Cap
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
  


export default Filter