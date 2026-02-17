const Search = ({ searchName, setSearchName, searchPhone, setSearchPhone, onSearch, onReset }) => {
    return (
        <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search by name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="input input-sm input-bordered w-64"
            />
            <input
                type="text"
                placeholder="Search by phone"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="input input-sm input-bordered w-64"
            />
            <button onClick={onSearch} className="btn btn-sm btn-neutral text-white">
                Search
            </button>
            <button onClick={onReset} className="btn btn-sm btn-outline btn-outline-neutral text-gray-700">
                &nbsp;Reset&nbsp;
            </button>
        </div>
    );
};

export default Search;
