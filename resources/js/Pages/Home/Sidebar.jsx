import Dropdown from '@/Components/Dropdown';

export default function Sidebar() {
    return (
        <div className="fixed left-0 top-0 h-full w-64 mt-14 bg-white shadow-lg z-50">
            <Dropdown>
                <Dropdown.Trigger>
                    <span className="inline-flex rounded-md w-full">
                        <button
                            type="button"
                            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                        >
                            <p>Filters</p>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 4h16l-6 8v6l-4 2v-8l-6-8z"
                                    stroke="black"
                                    strokeWidth="2"
                                    fill="none"
                                />
                            </svg>
                        </button>
                    </span>
                </Dropdown.Trigger>

                <Dropdown.Content
                    contentClasses="bg-white border border-gray-200 p-4 w-full"
                >
                    <div className="space-y-2">
                        <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100">
                            Location
                        </button>
                        <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100">
                            Ratings
                        </button>
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}
