import { Sidebar } from "lucide-react";
import Link from "next/link";
import {
    LayoutDashboard,
    Database,
    Settings,
    Users,
    Image as ImageIcon,
    LogOut
} from "lucide-react";

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Strapi Clone Style */}
            <aside className="w-64 bg-[#1e1e2d] text-[#8e8ea9] flex flex-col">
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-[#2b2b3c]">
                    <div className="text-white font-bold text-xl flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                            S
                        </div>
                        <span>StrapiClone</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-4 space-y-6">

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 px-2">Global</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#2b2b3c] hover:text-white transition-colors text-white bg-[#2b2b3c]"
                                >
                                    <Database size={18} />
                                    <span>Content Manager</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/media"
                                    className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#2b2b3c] hover:text-white transition-colors"
                                >
                                    <ImageIcon size={18} />
                                    <span>Media Library</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 px-2">Settings</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link
                                    href="/admin/users"
                                    className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#2b2b3c] hover:text-white transition-colors"
                                >
                                    <Users size={18} />
                                    <span>Users Permissions</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/settings"
                                    className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#2b2b3c] hover:text-white transition-colors"
                                >
                                    <Settings size={18} />
                                    <span>Configuration</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-[#2b2b3c]">
                    <Link href="/" className="flex items-center gap-3 px-2 py-2 text-red-400 hover:text-red-300 transition-colors">
                        <LogOut size={18} />
                        <span>Exit Admin</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b flex items-center justify-between px-8">
                    <h2 className="font-semibold text-gray-800">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
