import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SplitLayout({ sidebar, content }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div
                className={`relative border-r bg-base-100 transition-all duration-300 ${collapsed ? "w-0" : "w-96"}`}>
                {!collapsed && (
                    <div className="h-full overflow-y-auto">
                        {sidebar}
                    </div>
                )}

                {/* Collapse button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-[3.3rem] btn btn-xs btn-circle bg-base-200 shadow"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 bg-base-200 overflow-y-auto">
                {content}
            </div>
        </div>
    );
}
