import { useState, useEffect } from 'react';
import { Plus, Inbox as InboxIcon } from 'lucide-react';
import { motion, LayoutGroup } from 'framer-motion';
import { getTasks, createTask, updateTask } from '../api/tasks';
import type { Task } from '../api/tasks';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';

export function InboxPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks({ status: 'Inbox' });
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async () => {
    if (!newTaskTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await createTask({
        title: newTaskTitle,
        description: newTaskDesc,
        status: 'Inbox'
      });
      setIsModalOpen(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveToNextAction = async (task: Task) => {
    try {
      await updateTask(task.id, { status: 'Next Action' });
      setTasks(tasks.filter(t => t.id !== task.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Inbox</h1>
          <p className="text-slate-400 text-sm mt-1">Capture tasks and ideas quickly.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Capture
        </Button>
      </div>

      {!isLoading && tasks.length === 0 ? (
        <EmptyState
          icon={InboxIcon}
          title="Inbox Zero"
          description="You have captured everything! Enjoy the peace of mind."
          action={<Button onClick={() => setIsModalOpen(true)}>Capture a thought</Button>}
        />
      ) : (
        <LayoutGroup>
          <div className="space-y-3">
            {tasks.map(task => (
              <motion.div key={task.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-slate-200">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => handleMoveToNextAction(task)}>
                      Make Next Action
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Quick Capture">
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="What's on your mind?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            autoFocus
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
            <textarea
              className="bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 text-slate-100 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all min-h-[100px] resize-y"
              placeholder="Add details..."
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isSubmitting}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
