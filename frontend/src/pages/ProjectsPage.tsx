import { useState, useEffect } from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { getProjects, createProject } from '../api/projects';
import type { Project } from '../api/projects';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { motion, LayoutGroup } from 'framer-motion';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await createProject({ name, description });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Multi-step outcomes you want to achieve.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {!isLoading && projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to organize your tasks."
          action={<Button onClick={() => setIsModalOpen(true)}>Create Project</Button>}
        />
      ) : (
        <LayoutGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
            {projects.map(project => (
              <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card hoverable className="p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-lg text-slate-100 leading-tight">{project.name}</h3>
                    <Badge variant="primary" className="shrink-0">
                      {project._count?.tasks || 0} tasks
                    </Badge>
                  </div>
                  {project.description ? (
                    <p className="text-slate-400 text-sm line-clamp-3 mt-auto">{project.description}</p>
                  ) : (
                    <p className="text-slate-600 text-sm italic mt-auto">No description</p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Project">
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="E.g., Launch new website"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              className="bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 text-slate-100 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all min-h-[100px] resize-y"
              placeholder="What's the desired outcome?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isSubmitting}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
