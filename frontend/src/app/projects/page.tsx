"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Filter,
  Plus,
  MoreHorizontal,
  ChevronDown,
  FolderKanban,
  CheckSquare,
  X,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Signal,
  Menu,
  Trash2,
} from "lucide-react";
import ThemeMenu from "../components/ThemeMenu";
import Sidebar from "../components/Sidebar";
import { API_URL } from "../lib/api";

type Project = {
  id: string;
  name: string;
  description?: string | null;
  priority: "HIGH" | "MEDIUM" | "LOW" | "NO_PRIORITY";
  dueDate?: string | null;
  lead?: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  } | null;
  tasks?: any[];
};

const priorityIconMap = {
  HIGH: <SignalHigh className="w-3.5 h-3.5 text-red-500" />,
  MEDIUM: <SignalMedium className="w-3.5 h-3.5 text-amber-500" />,
  LOW: <SignalLow className="w-3.5 h-3.5 text-blue-500" />,
  NO_PRIORITY: <Signal className="w-3.5 h-3.5 text-zinc-400" />,
};

const priorityColorMap = {
  HIGH: "text-red-500 font-semibold",
  MEDIUM: "text-amber-500 font-semibold",
  LOW: "text-blue-500 font-semibold",
  NO_PRIORITY: "text-zinc-400",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  const fetchProjects = async () => {
    try {
      let res = await fetch(`${API_URL}/projects`);
      if (res.ok) {
        let data = await res.json();
        if (data.length === 0) {
          await fetch(`${API_URL}/seed`, { method: "POST" }).catch(() => {});
          const seedRes = await fetch(`${API_URL}/projects`);
          if (seedRes.ok) data = await seedRes.json();
        }
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((curr) => curr.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex transition-colors">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-[240px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex-col bg-zinc-50/50 dark:bg-zinc-900/30">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile Drawer */}
      {showSidebarMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowSidebarMobile(false)} />
          <aside className="relative w-[260px] bg-white dark:bg-zinc-900 h-full shadow-xl flex flex-col z-10">
            <div className="p-3 flex justify-end">
              <button onClick={() => setShowSidebarMobile(false)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Section */}
      <section className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 md:px-6 gap-3 bg-white dark:bg-zinc-950 sticky top-0 z-10">
          <button
            onClick={() => setShowSidebarMobile(true)}
            className="md:hidden p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <span className="text-zinc-400">Workspace</span>
            <span>/</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Projects</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search Toggle */}
            <button
              onClick={() => setShowSearch((c) => !c)}
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Fields */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Fields
            </button>

            {/* Filter */}
            <button className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
              <Filter className="w-4 h-4" />
            </button>

            {/* Add Project Button */}
            <button
              onClick={() => setShowAddProject(true)}
              className="h-9 px-3.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>
        </header>

        {/* Search Bar Input */}
        {showSearch && (
          <div className="px-4 md:px-6 pt-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                autoFocus
                className="w-full h-9 pl-9 pr-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              />
            </div>
          </div>
        )}

        {/* Content Table Area */}
        <div className="p-4 md:p-6 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Projects ({filteredProjects.length})
            </h1>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50 shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              <div className="col-span-5">Projects</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2">Lead</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-zinc-400">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400 italic">No projects found</div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="grid grid-cols-12 px-4 py-3.5 border-b last:border-b-0 border-zinc-100 dark:border-zinc-800/60 items-center hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition"
                >
                  {/* Project Name */}
                  <div className="col-span-5 min-w-0 pr-2">
                    <span className="text-xs font-semibold text-accent hover:underline cursor-pointer">
                      {project.name}
                    </span>
                    {project.description && (
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="col-span-2 flex items-center gap-1.5 text-xs">
                    {priorityIconMap[project.priority]}
                    <span className={priorityColorMap[project.priority]}>
                      {project.priority === "NO_PRIORITY" ? "No Priority" : project.priority}
                    </span>
                  </div>

                  {/* Lead Avatar */}
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold shadow-xs">
                      {project.lead?.fullName?.[0] ?? "D"}
                    </div>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                      {project.lead?.fullName ?? "Dexter"}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    {project.dueDate
                      ? new Date(project.dueDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "12 Sep 2026"}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 text-right flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1 text-zinc-400 hover:text-red-500 transition"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Bottom Add Project Row */}
            <button
              onClick={() => setShowAddProject(true)}
              className="w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-50/30 dark:bg-zinc-900/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition border-t border-zinc-100 dark:border-zinc-800/50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Projects</span>
            </button>
          </div>
        </div>
      </section>

      {/* Add Project Modal */}
      {showAddProject && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onProjectCreated={fetchProjects}
        />
      )}
    </main>
  );
}

function SidebarContent({
  showUserMenu,
  setShowUserMenu,
}: {
  showUserMenu: boolean;
  setShowUserMenu: (val: boolean) => void;
}) {
  return (
    <div className="flex flex-col h-full relative">
      {/* Sidebar Top Profile Menu Dropdown */}
      <div className="relative border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full h-16 flex items-center px-4 gap-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
            D
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              Dexter
            </span>
            <span className="text-[10px] text-zinc-400 truncate">Dexter@gmail.com</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-auto" />
        </button>

        {/* User Card Popover from Figma */}
        {showUserMenu && (
          <div className="absolute top-14 left-3 right-3 z-30 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-4 space-y-3">
            <div className="flex flex-col items-center text-center pt-1 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-base font-bold text-white mb-2 shadow-sm">
                D
              </div>
              <span className="text-xs font-bold text-zinc-900 dark:text-white">Dexter</span>
              <span className="text-[11px] text-zinc-400">Dexter@gmail.com</span>
            </div>

            <ThemeMenu />

            <Link
              href="/settings"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              ⚙ Settings
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-1">
        <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
          Workspace
        </div>

        <Link
          href="/tasks"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition"
        >
          <CheckSquare className="w-4 h-4" />
          Tasks
        </Link>

        <Link
          href="/projects"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white"
        >
          <FolderKanban className="w-4 h-4 text-accent" />
          Projects
        </Link>
      </div>

      {/* Footer Settings Link */}
      <div className="mt-auto p-3 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/settings"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition"
        >
          ⚙ Settings
        </Link>
      </div>
    </div>
  );
}

function AddProjectModal({
  onClose,
  onProjectCreated,
}: {
  onClose: () => void;
  onProjectCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Project["priority"]>("HIGH");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        }),
      });

      if (res.ok) {
        await onProjectCreated();
        onClose();
      } else {
        console.error("Failed to create project:", res.statusText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">Add New Project</h2>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Project Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Design Homepage"
            className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-xs outline-none font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project goal or overview..."
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 text-xs outline-none font-medium resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 text-xs font-medium outline-none"
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="NO_PRIORITY">No Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 text-xs font-medium outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 h-9 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
