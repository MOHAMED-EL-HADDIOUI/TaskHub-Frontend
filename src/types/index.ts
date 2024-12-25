// User Interface
export interface User {
  id: string;
  username: string;
  email: string;
}

// Task Interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  project: string;
  assigned_to?: User; // User object for assigned user
  completed: boolean;
  completed_by?: User; // User object for the user who completed the task
  created_at: string;
  updated_at: string;
}

// Project Interface
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  taskCounts: { [status: string]: number };
  managerId: string;
}
