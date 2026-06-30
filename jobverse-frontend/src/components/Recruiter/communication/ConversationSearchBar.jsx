import { Search } from "lucide-react";

const ConversationSearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="p-4 border-b">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />

        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full
            pl-10
            pr-4
            py-2
            border
            rounded-lg
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />
      </div>
    </div>
  );
};

export default ConversationSearchBar;
