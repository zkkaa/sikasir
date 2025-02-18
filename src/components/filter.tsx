import { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

// Definisi tipe props
interface DropdownFilterProps {
  filterCategory: string;
  setFilterCategory: (value: string) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({ filterCategory, setFilterCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div 
        className="flex items-center border rounded-lg p-2 cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <select
          className="appearance-none bg-transparent focus:outline-none"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
        >
          <option value="All">Semua</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
        </select>
        {isOpen ? (
          <CaretUp size={20} className="ml-2 text-gray-600" />
        ) : (
          <CaretDown size={20} className="ml-2 text-gray-600" />
        )}
      </div>
    </div>
  );
};

export default DropdownFilter;
