"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Lock,
  Eye,
  Share2,
  MoreHorizontal,
  Sidebar,
  Plus,
  Paperclip,
  Send,
  Calendar,
  User,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Signal,
  CheckSquare,
  ArrowLeft,
  ChevronDown,
  Tag,
  Users,
  X,
  RotateCcw,
} from "lucide-react";
import { API_URL } from "../../lib/api";

type TaskDetail = {
  id: string;
  title: string;
  description?: string | null;
  status: "TODO" | "DOING" | "COMPLETED";
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW" | "NO_PRIORITY";
  dueDate?: string | null;
  members?: { id: string; user: { fullName: string; username: string } }[];
  subtasks?: { id: string; title: string; completed: boolean; priority?: string; dueDate?: string }[];
  comments?: { id: string; content: string; createdAt: string; user?: { fullName: string; username: string } }[];
};

type ActivityLog = {
  id: string;
  action: string;
  details?: string | null;
  createdAt: string;
  user?: { fullName: string };
};

const priorityIconMap = {
  URGENT: <SignalHigh className="w-3.5 h-3.5 text-red-500" />,
  HIGH: <SignalHigh className="w-3.5 h-3.5 text-orange-500" />,
  MEDIUM: <SignalMedium className="w-3.5 h-3.5 text-amber-500" />,
  LOW: <SignalLow className="w-3.5 h-3.5 text-blue-500" />,
  NO_PRIORITY: <Signal className="w-3.5 h-3.5 text-zinc-400" />,
};

const priorityColorMap = {
  URGENT: "text-red-500 font-semibold",
  HIGH: "text-orange-500 font-semibold",
  MEDIUM: "text-amber-500 font-semibold",
  LOW: "text-blue-500 font-semibold",
  NO_PRIORITY: "text-zinc-400",
};

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const fetchTaskDetails = async () => {
    try {
      let res = await fetch(`${API_URL}/tasks/${taskId}`);
      if (!res.ok) {
        // Fallback to first task if ID doesn't exist
        const allRes = await fetch(`${API_URL}/tasks`);
        if (allRes.ok) {
          const allTasks = await allRes.json();
          if (allTasks.length > 0) res = await fetch(`${API_URL}/tasks/${allTasks[0].id}`);
        }
      }
      if (res.ok) {
        const data = await res.json();
        setTask(data);
      }

      // Fetch activity updates timeline
      const actRes = await fetch(`${API_URL}/activity/task/${taskId}`).catch(() => null);
      if (actRes && actRes.ok) {
        const actData = await actRes.json();
        setActivities(actData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const handleUpdatePriority = async (newPriority: TaskDetail["priority"]) => {
    if (!task) return;
    const oldPriority = task.priority;
    setTask({ ...task, priority: newPriority });
    setShowPriorityDropdown(false);

    try {
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });

      // Log activity
      await fetch(`${API_URL}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: `changed priority from ${oldPriority} to ${newPriority}`,
          taskId: task.id,
        }),
      });

      fetchTaskDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (newStatus: TaskDetail["status"]) => {
    if (!task) return;
    setTask({ ...task, status: newStatus });

    try {
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      await fetch(`${API_URL}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: `changed status to ${newStatus}`,
          taskId: task.id,
        }),
      });

      fetchTaskDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim() || !task) return;
    try {
      const res = await fetch(`${API_URL}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newSubtaskTitle,
          taskId: task.id,
          completed: false,
        }),
      });
      if (res.ok) {
        setNewSubtaskTitle("");
        fetchTaskDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!newCommentContent.trim() || !task) return;
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newCommentContent,
          taskId: task.id,
        }),
      });
      if (res.ok) {
        setNewCommentContent("");
        fetchTaskDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 text-xs text-zinc-500">
        Loading task details...
      </main>
    );
  }

  if (!task) {
    return (
      <main className="min-h-screen p-8 bg-white dark:bg-zinc-950 text-xs text-zinc-500">
        Task not found. <Link href="/tasks" className="underline text-accent">Return to tasks</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors">
      {/* Top Breadcrumbs Header */}
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-zinc-950">
        <Link href="/tasks" className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </Link>

        <div className="flex items-center gap-2 text-zinc-400">
          <button className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs">
            <Lock className="w-3.5 h-3.5" />
          </button>
          <button className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-semibold flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>1</span>
          </button>
          <button className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs">
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs">
            <Sidebar className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Page Body Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-6 md:p-8 gap-8 max-w-7xl mx-auto w-full">
        {/* Left Column: Main Task Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Description */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
              {task.title}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {task.description || "Create clear and detailed documentation to guide developers effectively."}
            </p>
          </div>

          {/* Properties Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Properties</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-semibold">
                Designer
              </span>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[11px] font-semibold border border-pink-500/20 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "31 Jul"}
              </span>
            </div>
          </div>

          {/* Labels Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-400 font-medium mr-2">Labels</span>
            {["Research", "Design", "Development", "Testing", "Deployment"].map((lbl) => (
              <span key={lbl} className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-700/60 flex items-center gap-1">
                <Tag className="w-2.5 h-2.5 text-zinc-400" />
                {lbl}
              </span>
            ))}
          </div>

          {/* Resources */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-medium mr-2">Resources</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-xs transition">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Add document or link...</span>
            </button>
          </div>

          {/* Subtasks Table Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-white">
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              <span>Subtasks</span>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50 shadow-xs">
              <div className="grid grid-cols-12 bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <div className="col-span-5">Task</div>
                <div className="col-span-2">Priority</div>
                <div className="col-span-2">Members</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {task.subtasks && task.subtasks.length > 0 ? (
                task.subtasks.map((st, i) => (
                  <div key={st.id} className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0 border-zinc-100 dark:border-zinc-800/60 items-center text-xs">
                    <div className="col-span-5 font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <input type="checkbox" checked={st.completed} readOnly className="rounded text-accent" />
                      <span>{st.title}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1 text-xs">
                      {priorityIconMap[(st.priority as keyof typeof priorityIconMap) || "MEDIUM"]}
                      <span className={priorityColorMap[(st.priority as keyof typeof priorityColorMap) || "MEDIUM"]}>{st.priority || (i === 0 ? "High" : i === 1 ? "Low" : "Medium")}</span>
                    </div>
                    <div className="col-span-2 flex -space-x-1">
                      <div className="w-5 h-5 rounded-full bg-purple-500 text-[8px] text-white font-bold flex items-center justify-center">D</div>
                    </div>
                    <div className="col-span-2 text-zinc-500 text-[11px]">{st.dueDate || "12 Sep 2026"}</div>
                    <div className="col-span-1 text-right text-zinc-400"><MoreHorizontal className="w-3.5 h-3.5 inline" /></div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-zinc-400 italic">No subtasks created</div>
              )}

              {/* Add Subtasks inline input */}
              <div className="p-2 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center gap-2">
                <Plus className="w-4 h-4 text-zinc-400 ml-2" />
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                  placeholder="Add Subtasks..."
                  className="flex-1 bg-transparent text-xs outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-medium"
                />
                <button onClick={handleAddSubtask} className="px-3 py-1 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-semibold">
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Activity / Comments Discussion Feed */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <h2 className="text-xs font-bold text-zinc-900 dark:text-white">Subtasks & Discussion</h2>

            {/* Comment Items */}
            {task.comments && task.comments.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] text-white font-bold">
                      {c.user?.fullName?.[0] ?? "A"}
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      {c.user?.fullName ?? "Ankit Dutta"}
                    </span>
                    <span className="text-[10px] text-zinc-400">just now</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <RotateCcw className="w-3 h-3 cursor-pointer hover:text-zinc-600" />
                    <MoreHorizontal className="w-3 h-3 cursor-pointer hover:text-zinc-600" />
                  </div>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium pl-8">{c.content}</p>

                {/* Reply box inside comment */}
                <div className="mt-2 pl-8 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[8px] text-white font-bold">D</div>
                  <input
                    type="text"
                    placeholder="Leave a reply..."
                    className="flex-1 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 text-xs outline-none"
                  />
                  <Paperclip className="w-4 h-4 text-zinc-400 cursor-pointer" />
                  <Send className="w-4 h-4 text-accent cursor-pointer" />
                </div>
              </div>
            ))}

            {/* General Add Comment Box */}
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2 shadow-xs">
              <input
                type="text"
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 outline-none font-medium px-2"
              />
              <button className="p-1.5 text-zinc-400 hover:text-zinc-600">
                <Paperclip className="w-4 h-4" />
              </button>
              <button onClick={handleAddComment} className="p-1.5 text-accent hover:opacity-80">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Activity Sidebar Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Details Card */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                Details
              </span>
              <Plus className="w-4 h-4 text-zinc-400 cursor-pointer" />
            </div>

            {/* Status */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">Status</span>
              <select
                value={task.status}
                onChange={(e) => handleUpdateStatus(e.target.value as any)}
                className="h-7 border border-zinc-200 dark:border-zinc-700 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold rounded-md px-2 text-[11px] outline-none"
              >
                <option value="TODO">Backlog / To Do</option>
                <option value="DOING">Doing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Priority with Figma Popup */}
            <div className="relative flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">Priority</span>
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-semibold"
              >
                {priorityIconMap[task.priority]}
                <span className={priorityColorMap[task.priority]}>{task.priority}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {/* Priority Picker Dropdown Popup matching Figma */}
              {showPriorityDropdown && (
                <div className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5">
                  <p className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase">Priority</p>
                  {(["NO_PRIORITY", "URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((pKey) => (
                    <button
                      key={pKey}
                      onClick={() => handleUpdatePriority(pKey)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      <span className="flex items-center gap-2">
                        {priorityIconMap[pKey]}
                        <span className={priorityColorMap[pKey]}>{pKey === "NO_PRIORITY" ? "No Priority" : pKey}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Members */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">Members</span>
              <div className="flex -space-x-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[9px] text-white font-bold border border-white dark:border-zinc-900">
                  D
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">Dates</span>
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "31 Jul 2026"}
              </span>
            </div>

            {/* Reporter */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500 font-medium">Reporter</span>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-purple-500 text-[8px] text-white font-bold flex items-center justify-center">D</div>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Dexter</span>
              </div>
            </div>
          </div>

          {/* Updates Timeline Card matching Figma */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              <span>Updates</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {activities.length > 0 ? (
                activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 mt-0.5">
                      D
                    </div>
                    <div>
                      <p className="text-zinc-800 dark:text-zinc-200 font-semibold leading-snug">
                        {act.user?.fullName ?? "You"} {act.action}
                      </p>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(act.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 mt-0.5">
                      D
                    </div>
                    <div>
                      <p className="text-zinc-800 dark:text-zinc-200 font-semibold leading-snug">
                        You changed priority from No priority to Urgent
                      </p>
                      <span className="text-[10px] text-zinc-400">Aug 2026</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0 mt-0.5">
                      D
                    </div>
                    <div>
                      <p className="text-zinc-800 dark:text-zinc-200 font-semibold leading-snug">
                        You posted an update
                      </p>
                      <span className="text-[10px] text-zinc-400">Aug 2026</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
